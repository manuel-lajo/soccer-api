import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Competition {
    name: String!
    code: String!
    areaName: String!
  }

  type Team {
    name: String!
    tla: String!
    shortName: String!
    areaName: String!
    address: String
    leagues: [Competition!]!
    players: [Player!]
    coach: Coach
  }

  type Player {
    name: String!
    position: String
    dateOfBirth: String
    nationality: String
    team: Team!
  }

  type Coach {
    name: String
    dateOfBirth: String
    nationality: String
    team: Team!
  }

  type ImportLeagueResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    players(leagueCode: String!, teamName: String): [Player]
    team(name: String!): Team
  }

  type Mutation {
    importLeague(leagueCode: String!): ImportLeagueResponse!
  }
`;

export default typeDefs;
