import request from 'supertest';
import { startApolloServer, app } from '../index';
import mongoose from 'mongoose';
import Competition from '../models/Competition';
import Team from '../models/Team';
import Player from '../models/Player';
import Coach from '../models/Coach';

describe('Query: team', () => {
  beforeAll(async () => {
    await startApolloServer();
  
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions);
    }
  });
  
  afterAll(async () => {
    await Competition.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Coach.deleteMany({});
    await mongoose.connection.close();
  });
  
  it('should fetch all players', async () => {
    const mockCompetition = new Competition({
      id: 1,
      name: 'Premier League',
      code: 'PL',
      areaName: 'England',
    });
    await mockCompetition.save();
    const mockTeam = new Team({
      id: 1,
      name: 'Manchester City FC',
      shortName: 'Man City',
      tla: 'MCI',
      areaName: 'England',
      leagues: [mockCompetition._id]
    });
    await mockTeam.save();
    await Player.insertMany([
      { id: 1, name: 'Jack Grealish', position: 'Left Winger', nationality: 'England', team: mockTeam._id },
      { id: 2, name: 'Erling Haaland', position: 'Centre-Forward', nationality: 'Norway', team: mockTeam._id },
    ]);

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            players(leagueCode: "PL") {
              name
              position
              nationality
            }
          }
        `,
      })
      .set('Accept', 'application/json');

    expect(response.body.data.players).toHaveLength(2);
    expect(response.body.data.players[0].name).toBe('Jack Grealish');
    expect(response.body.data.players[1].name).toBe('Erling Haaland');
  });

  it('should return no competition message for a non-existent league', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            players(leagueCode: "ABC") {
              name
            }
          }
        `,
      })
      .set('Accept', 'application/json');

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('There is no competition with the requested leagueCode ABC');
  });
});
