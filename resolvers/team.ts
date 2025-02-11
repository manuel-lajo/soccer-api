import { IResolvers } from '@graphql-tools/utils';
import Team from '../models/Team';

const teamResolver: IResolvers = {
  Query: {
    team: async (_parent, { name }) => {
      try {
        const team = await Team.findOne({ name }).populate('leagues players coach');
        if (!team) {
          throw new Error('There is no team with the requested name');
        }
        return team;
      } catch (error) {
        // TODO: manage error logging
        throw error;
      }
    },
  },
};

export default teamResolver.Query;
