import { Resolvers, Venue } from './types'

export const resolvers: Resolvers = {
  Query: {
    venues: async (_, { area }, { sheets }) => {
        const [fields, ...data]: string[][] = await sheets.spreadsheets.values.get({
          range: `${area}!A1:I83`,
          spreadsheetId: process.env.SHEET_ID
        }).then((res) => res.data.values).catch((err) => { 
          console.error(err)
          return []
        })
        const res = data.map((rawData: string[]) => fields.reduce((obj, prop, idx) => {
          const value = rawData[idx]
          try {
          if (prop === 'location') {
            obj[prop] = value.split(',').map((val) => +val)
          } else if (prop === 'genres') {
            obj[prop] = value.split(',').map((val) => val.trim())
          } else if (prop === 'id' || prop === 'capacity') {
            obj[prop] = +value
          } else {
            obj[prop] = value
          }
          } catch (err) {
            console.error(err)
          }
          return obj
        }, {} as Venue))
        return res
    }
  }
}