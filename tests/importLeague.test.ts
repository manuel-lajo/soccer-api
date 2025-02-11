import request from 'supertest';
import { startApolloServer, app } from '../index';
import mongoose from 'mongoose';
import Competition from '../models/Competition';
import Team from '../models/Team';
import Player from '../models/Player';
import Coach from '../models/Coach';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Mutation: importLeague', () => {
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

  it('should import a league successfully', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          id: 1,
          name: 'Premier League',
          code: 'PL',
          area: { name: 'England' },
          seasons: [
            {
              id: 1,
              startDate: '2023-08-11',
              endDate: '2024-05-19',
              currentMatchday: 10,
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          teams: [
            {
              id: 1,
              name: 'Manchester City FC',
              shortName: 'Man City',
              tla: 'MCI',
              area: { name: 'England' },
              coach: {
                id: 1,
                name: 'Pep Guardiola',
                nationality: 'Spain',
              },
              squad: [
                {
                  id: 1,
                  name: 'Jack Grealish',
                  position: 'Left Winger',
                  dateOfBirth: '1995-09-10',
                  nationality: 'England',
                },
                {
                  id: 2,
                  name: 'Erling Haaland',
                  position: 'Centre-Forward',
                  dateOfBirth: '2000-07-21',
                  nationality: 'Norway',
                },
              ],
            },
          ],
        },
      });

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            importLeague(leagueCode: "PL") {
              success
              message
            }
          }
        `,
      })
      .set('Accept', 'application/json');

    expect(response.body.data.importLeague.success).toBe(true);
    expect(response.body.data.importLeague.message).toContain('imported successfully');
  });

  it('should return an error for an invalid league code', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('League not found'));

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            importLeague(leagueCode: "INVALID") {
              success
              message
            }
          }
        `,
      })
      .set('Accept', 'application/json');

    // TODO: udpate to check by response.body.data.importLeague
    expect(response.body.errors).toBeDefined();
  });
});
