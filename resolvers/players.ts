import { IResolvers } from '@graphql-tools/utils';
import Competition from '../models/Competition';
import Team from '../models/Team';
import Player from '../models/Player';
import Coach from '../models/Coach';

const playersResolver: IResolvers = {
  Query: {
    players: async (_, { leagueCode, teamName }) => {
      try {
        const competition = await Competition.findOne({ code: leagueCode });
        if (!competition) {
          throw new Error(`There is no competition with the requested leagueCode ${leagueCode}`)
        }

        let teams = await Team.find({ leagues: competition._id });

        if (teamName) {
          teams = teams.filter(({ name }) => name === teamName);
          if (teams.length === 0) {
            throw new Error(`There is no team with the requested teamName ${teamName}`);
          }
        }

        const players = await Player
          .find({ team: { $in: teams.map(({ _id }) => _id) } })
          .populate({ path: 'team', populate: { path: 'leagues' } });

        if (players.length === 0) {
          const coaches = await Coach
            .find({ team: { $in: teams.map(({ _id }) => _id) } })
            .populate({ path: 'team', populate: { path: 'leagues' } });
          return coaches;
        }

        return players;
      } catch (error) {
        // TODO: manage error logging
        throw error;
      }
    },
  },
};

export default playersResolver.Query;
