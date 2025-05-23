import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import { verifyToken } from './middleware/auth.js';
import pool from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = verifyToken(token); // implement this function in auth.js
    return { user };
  }
});

await server.start();
server.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GraphQL running at http://localhost:${PORT}/graphql`);
});
