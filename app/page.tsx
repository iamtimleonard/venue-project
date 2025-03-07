'use client';

import { ChangeEvent, Reducer, useEffect, useReducer, useState } from 'react';
import { Venue } from './api/graphql/types';
import Map from './Map';
import styles from './page.module.css';
import TableView from './Table';

type VenueState = {
  areaVenues: Venue[];
  filteredVenues: Venue[];
  openVenues: number[];
  focusedVenue?: number;
  filter: {
    genre?: string;
    date: string;
    area: string;
  };
};

const reducer: Reducer<
  VenueState,
  {
    payload: {
      filter: { genre?: string; date: string; area: string };
      areaVenues: Venue[];
      selectedVenues?: Venue[];
      focusedVenue?: Venue;
    };
    type: 'filter:update' | 'area:update' | 'selected:update';
  }
> = (state, action) => {
  switch (action.type) {
    case 'filter:update': {
      const newFilter = action.payload.filter;
      const filteredVenues = state.areaVenues.filter((venue) => {
        return (
          (newFilter.genre ? venue.genres.includes(newFilter.genre) : true) &&
          venue.dateOpen <= newFilter.date &&
          (venue.dateClosed ? venue.dateClosed >= newFilter.date : true)
        );
      });
      const openVenues = state.areaVenues
        .filter(
          (venue) => venue.dateOpen <= newFilter.date && (venue.dateClosed ? venue.dateClosed >= newFilter.date : true)
        )
        .map((venue) => venue.id);

      return { ...state, filter: newFilter, filteredVenues, openVenues };
    }

    case 'area:update': {
      const newVenues = action.payload.areaVenues;
      const newFilter = {
        genre: '',
        date: new Date().getFullYear().toString(),
        area: action.payload.filter.area,
      };
      const filteredVenues = newVenues.filter((venue) => {
        return (
          (newFilter.genre ? venue.genres.includes(newFilter.genre) : true) &&
          venue.dateOpen <= newFilter.date &&
          (venue.dateClosed ? venue.dateClosed >= newFilter.date : true)
        );
      });
      const openVenues = newVenues
        .filter(
          (venue) => venue.dateOpen <= newFilter.date && (venue.dateClosed ? venue.dateClosed >= newFilter.date : true)
        )
        .map((venue) => venue.id);
      const closedVenues = newVenues
        .filter(
          (venue) => venue.dateOpen >= newFilter.date && (venue.dateClosed ? venue.dateClosed <= newFilter.date : true)
        )
        .map((venue) => venue.id);
      console.log({ openVenues, closedVenues });
      return { areaVenues: newVenues, filteredVenues, filter: newFilter, openVenues, closedVenues };
    }

    case 'selected:update': {
      return { ...state, filter: action.payload.filter, focusedVenue: action.payload.focusedVenue.id };
    }
  }
};

export default function Page() {
  const [venues, dispatch] = useReducer(reducer, {
    areaVenues: [],
    filteredVenues: [],
    openVenues: [],
    filter: { genre: '', area: 'Philadelphia', date: '2025' },
  });
  const [geoData, setGeoData] = useState(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const onRowSelection = (focusedVenue: Venue) => {
    dispatch({
      type: 'selected:update',
      payload: { filter: { ...venues.filter }, focusedVenue, areaVenues: venues.areaVenues },
    });
  };

  const handleDateChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { areaVenues, filter } = venues;
    dispatch({
      type: 'filter:update',
      payload: {
        areaVenues,
        filter: {
          ...filter,
          date: target.value,
        },
      },
    });
  };

  const handleGenreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { areaVenues, filter } = venues;
    dispatch({
      type: 'filter:update',
      payload: {
        areaVenues,
        filter: {
          ...filter,
          genre: e.target.value,
        },
      },
    });
  };

  useEffect(() => {
    Promise.all([
      fetch(`/Philadelphia.geojson`).then((res) => res.json()),
      fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              venues(area: "Philadelphia") {
                id
                name
                location
                genres
                dateOpen
                dateClosed
                capacity
              }
            }
          `,
        }),
      }).then((res) => res.json()),
    ]).then(([geoJson, venueRes]) => {
      setGeoData(geoJson);
      const newVenues = venueRes.data.venues;
      setGenres(
        newVenues.reduce((acc: string[], venue: Venue) => {
          return acc.concat(venue.genres.filter((genre) => !acc.includes(genre)));
        }, [])
      );
      dispatch({
        type: 'area:update',
        payload: { filter: { ...venues.filter, area: 'Philadelphia' }, areaVenues: newVenues },
      });
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <h1>Loading</h1>;

  return (
    <main className={styles.main}>
      <div className={styles.filter}>
        <label htmlFor="open-date">Choose a date ({venues.filter.date}):</label>
        <input
          id="open-date"
          type="range"
          value={venues.filter.date}
          step={1}
          min={1900}
          max={new Date().getFullYear().toString()}
          onChange={handleDateChange}
        />
        <select value={venues.filter.genre} onChange={handleGenreChange}>
          <option value="">-- Filter by Genre --</option>
          {genres.map((genre, idx) => (
            <option value={genre} key={idx}>
              {genre}
            </option>
          ))}
        </select>
        <TableView venues={venues.areaVenues} onRowSelection={onRowSelection} />
      </div>
      <div className={styles.chart}>
        <Map
          data={geoData}
          points={venues.areaVenues.map((venue) => ({
            ...venue,
            latitude: venue.location[0],
            longitude: venue.location[1],
          }))}
          openVenues={venues.openVenues}
          focusedVenue={venues.focusedVenue}
        />
      </div>
    </main>
  );
}
