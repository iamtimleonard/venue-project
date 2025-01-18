import { venuesApi } from "./venues-api"
import { google } from "googleapis"

export type DataSourceContext = {
  sheets: ReturnType<typeof google.sheets>
  dataSources: {
    venuesApi: typeof venuesApi
  }
}