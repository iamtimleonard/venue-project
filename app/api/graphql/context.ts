import { MongoClient } from "mongodb"
import { venuesApi } from "./venues-api"

export type DataSourceContext = {
  client: MongoClient
  dataSources: {
    venuesApi: typeof venuesApi
  }
}