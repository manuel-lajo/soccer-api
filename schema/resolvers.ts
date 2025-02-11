import { IResolvers } from '@graphql-tools/utils';
import playersResolver from '../resolvers/players'
import teamResolver from '../resolvers/team'
import importLeagueResolver from '../resolvers/importLeague';

const resolvers: IResolvers = {
  Query: {
    ...playersResolver,
    ...teamResolver,
  },
  Mutation: {
    ...importLeagueResolver,
  },
};

export default resolvers;
