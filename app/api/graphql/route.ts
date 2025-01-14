import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { MongoClient } from "mongodb"
import { venuesApi } from "./venues-api";
import { resolvers } from "./resolvers";

const dbUrl = 'mongodb://localhost:27017';
const client = new MongoClient(dbUrl);
await client.connect()
console.log("connected to mongodb")

const typeDefs = gql(
`
"A location that either existed at one time or still exists"
type Venue {
  "the ID of the venue"
  id: ID!
  "the general locale of the venue"
  area: String!
  "the name of the venue"
  name: String!
  "the coordinates of the location of the venue"
  location: [Float]
  "the ISO formatted date of the opening of the venue, as precisely as possible (YYYY-MM-DD)"
  dateOpen: String!
  "the ISO formatted date of the closing of the venue, as precisely as possible (YYYY-MM-DD)"
  dateClosed: String
  "the genres represented by the venue"
  genres: [String!]!
}

type Query {
  "A list of venues"
  venues(area: String): [Venue!]!
}

type Mutation {
  "Creates a new listing"
  createVenue(input: CreateVenueInput): CreateVenueResponse!
}

type CreateVenueResponse {
  "represents status of request"
  code: Int!
  "says if request was successful or not"
  success: Boolean!
  "Human-readable message for UI"
  message: String!
  "the newly created listing"
  venue: Venue
}

input CreateVenueInput {
  "the general locale of the venue"
  area: String!
  "the name of the venue"
  name: String!
  "the coordinates of the location of the venue"
  location: [Float]
  "the ISO formatted date of the opening of the venue, as precisely as possible (YYYY-MM-DD)"
  dateOpen: String!
  "the ISO formatted date of the closing of the venue, as precisely as possible (YYYY-MM-DD)"
  dateClosed: String
  "the genres represented by the venue"
  genres: [String!]! 
}
`
)

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
