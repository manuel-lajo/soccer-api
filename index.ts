import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import connectDB from './config/database';
import dotenv from 'dotenv';

import typeDefs from './schema/typeDefs';
import resolvers from './schema/resolvers';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({ typeDefs, resolvers });

export async function startApolloServer() {
  await server.start();
  // TODO: resolve this TS issue: No overload matches this call
  // @ts-ignore
  app.use('/graphql', expressMiddleware(server));

  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/graphql`));
  }
}

if (process.env.NODE_ENV !== 'test') {
  startApolloServer();
}

export { app };
