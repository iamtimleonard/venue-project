import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { MongoClient } from "mongodb"
import typeDefs from "./schema.graphql"
import { venuesApi } from "./venues-api";
import { resolvers } from "./resolvers";

const dbUrl = 'mongodb://localhost:27017';
const client = new MongoClient(dbUrl);
await client.connect()
console.log("connected to mongodb")

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    console.log(req.body)
    return {
      client,
      dataSources: {
        venuesApi
      }
    }
  }
});

export { handler as GET, handler as POST };
