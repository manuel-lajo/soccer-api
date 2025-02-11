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
  
  it('should fetch a team by ID', async () => {
    const mockTeam = new Team({
      id: 1,
      name: 'Manchester City FC',
      shortName: 'Man City',
      tla: 'MCI',
      areaName: 'England',
    });
    await mockTeam.save();

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            team(name: "Manchester City FC") {
              name
              shortName
              tla
              areaName
            }
          }
        `,
      })
      .set('Accept', 'application/json');

    expect(response.body.data.team.name).toBe('Manchester City FC');
    expect(response.body.data.team.shortName).toBe('Man City');
    expect(response.body.data.team.tla).toBe('MCI');
    expect(response.body.data.team.areaName).toBe('England');
  });

  it('should return null for a non-existent team', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            team(name: "Evil Team") {
              name
            }
          }
        `,
      })
      .set('Accept', 'application/json');

    expect(response.body.data.team).toBeNull();
  });
});
