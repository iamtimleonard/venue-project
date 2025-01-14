"use client"

import { ChangeEvent, Reducer, useEffect, useReducer, useState } from "react";
import { Venue } from "./api/graphql/types";
import dynamic from "next/dynamic";

type VenueState = {
  areaVenues: Venue[]
  filteredVenues: Venue[]
  filter: {
    genre?: string
    date: string
    area: string
  }
}

const Map = dynamic(() => import("./Map"), { ssr: false });



const reducer: Reducer<VenueState, { payload: { filter: { genre?: string, date:string, area: string }; areaVenues: Venue[] }, type: 'filter:update' | 'area:update' }> = (state, action) => {
  switch (action.type) {
    case 'filter:update': {
      const newFilter = action.payload.filter
      const filteredVenues = state.areaVenues.filter((venue) => {
        return newFilter.genre ? venue.genres.includes(newFilter.genre) : true
          && (venue.dateOpen <= newFilter.date
          && (venue.dateClosed ? venue.dateClosed >= newFilter.date : true))
      })
      return { ...state, filter: newFilter, filteredVenues }
    }

    case 'area:update': {
      const newVenues = action.payload.areaVenues
      const newFilter = {
        genre: '',
        date: new Date().toISOString().split('T', 1)[0],
        area: action.payload.filter.area
      }
      return { areaVenues: newVenues, filteredVenues: newVenues, filter: newFilter, }
    }
  }
}

export default function Page() {
  const [venues, dispatch] = useReducer(reducer, { areaVenues: [], filteredVenues: [], filter: { genre: '', area: '', date: new Date().toISOString().split('T', 1)[0] } })
  const [geoData, setGeoData] = useState(null)

  useEffect(() => {
    fetch('/philadelphia.geojson').then((res) => res.json()).then((res) => setGeoData(res))
  },[]);

  const [genres, setGenres] = useState<string[]>([])

  const handleAreaChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const { data } = await fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            venues(area: "${e.target.value}") {
              id
              name
              location
              genres
              dateOpen
              dateClosed
            }
          }
        `,
      }),
    }).then((res) => res.json())
    const newVenues = data.venues
    setGenres(newVenues.reduce((acc: string[], venue: Venue) => {
      return acc.concat(venue.genres)
    }, []))
    dispatch({ type: 'area:update', payload: { filter: { ...venues.filter, area: e.target.value }, areaVenues: newVenues } })
  }

  const handleDateChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    const { areaVenues, filter } = venues
    dispatch({
      type: 'filter:update',
      payload: {
        areaVenues,
        filter: {
          ...filter,
          date: target.value
        }
      }
    })
  }

  const handleGenreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { areaVenues, filter } = venues
    dispatch({
      type: 'filter:update',
      payload: {
        areaVenues,
        filter: {
          ...filter,
          genre: e.target.value
        }
      }
    })
  }

  return (<>
    <div>
      <select value={venues.filter.area} onChange={handleAreaChange}>
        <option value=''>-- Please Choose An Area --</option>
        <option value="New York City">New York City</option>
        <option value="Philadelphia">Philadelphia</option>
      </select>
      <label htmlFor="open-date">Choose a date:</label>
      <input id="open-date" type="date" value={venues.filter.date} min="1900-01-01" max="2030-01-01" onChange={handleDateChange} />
      <select value={venues.filter.genre} onChange={handleGenreChange}>
        <option value="">-- Please Choose A Genre --</option>
        {genres.map((genre, idx) => <option value={genre} key={idx}>{genre}</option>)}
      </select>
    </div>
    <div>
      <p>All venues in {venues.filter.area}:</p>
      <ul>
        {venues.areaVenues.map((venue, idx) => <li key={idx}>{venue.name}</li>)}
      </ul>
      <p>Filtered venues:</p>
      <ul>
        {venues.filteredVenues.map((venue, idx) => <li key={idx}>{venue.name}</li>)}
      </ul>
    </div>
    {geoData ? <Map data={geoData} points={venues.filteredVenues.map((venue) => ({...venue, latitude: venue.location[0], longitude: venue.location[1]}))} /> : null}
  </>)
}