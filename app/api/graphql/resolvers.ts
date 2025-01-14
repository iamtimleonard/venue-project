import { Resolvers } from './types'

export const resolvers: Resolvers = {
  Query: {
    venues: (_, { area }, { dataSources, client }) => {
      console.log("getting venues")
      return dataSources.venuesApi.getVenues(client, area)
    }
  },
  Mutation: {
    createVenue: async (_, { input }, { dataSources, client }) => {
      try {
        const response = await dataSources.venuesApi.createVenue(client, input)

        return {
          code: 200,
          success: true,
          message: "Venue successfully create!",
          listing: response
        }
      } catch (error) {
        console.error(error)
        return {
          code: 500,
          success: false,
          message: `Something went wrong`
        }
      }
    }
  }
}