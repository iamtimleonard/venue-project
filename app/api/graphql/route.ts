import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { google } from "googleapis"
import typeDefs from "./schema.graphql"
import { venuesApi } from "./venues-api";
import { resolvers } from "./resolvers";

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const auth = await google.auth.getClient({ scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]})
const sheets = google.sheets({ version: "v4", auth })

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    return {
      sheets,
      dataSources: {
        venuesApi
      }
    }
  }
});

export { handler as GET, handler as POST };
