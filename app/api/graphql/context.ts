import { google } from "googleapis"

export type DataSourceContext = {
  sheets: ReturnType<typeof google.sheets>
}