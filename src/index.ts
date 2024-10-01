import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

const app = express();
async function init() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const httpServer = http.createServer(app);
  const appoloServer = new ApolloServer<any>({
    typeDefs: `type Query{
      find:String
    }`,
    resolvers: {
      Query: {
        find: async () => {
          return "ILY";
        },
      },
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await appoloServer.start();
  app.use(
    "/graphql",
    expressMiddleware(appoloServer, { context: async () => {} })
  );
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}
init();

// npm install @apollo/server express graphql cors
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
// import express from 'express';
// import http from 'http';
// import cors from 'cors';
// import { typeDefs, resolvers } from './schema';

// interface MyContext {
//   token?: String;
// }

// const app = express();
// const httpServer = http.createServer(app);
// const server = new ApolloServer<MyContext>({
//   typeDefs,
//   resolvers,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
// });
// await server.start();
// app.use(
//   '/graphql',
//   cors<cors.CorsRequest>(),
//   express.json(),
//   expressMiddleware(server, {
//     context: async ({ req }) => ({ token: req.headers.token }),
//   }),
// );

// await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
// console.log(`🚀 Server ready at http://localhost:4000/graphql`);
