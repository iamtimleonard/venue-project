import { MongoClient } from "mongodb";
import { CreateVenueInput, Venue } from "./types";

const getVenues = (client: MongoClient, area: string) => client.db("metro_music").collection<Venue>("venues").find({ area }, { projection: { _id: 0 }}).toArray()

const createVenue = (client: MongoClient, venue: CreateVenueInput) => client.db("metro_music").collection("venues").insertOne(venue)

export const venuesApi = {
  getVenues,
  createVenue
}