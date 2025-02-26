'use client';

import { ChangeEvent, ReactNode, Reducer, useReducer, useState } from 'react';
import { Venue } from './api/graphql/types';
import Map from './Map';
import styles from './page.module.css';
import TableView from './Table';

type VenueState = {
  areaVenues: Venue[];
  filteredVenues: Venue[];
  filter: {
    genre?: string;
    date: string;
    area: string;
  };
};

const reducer: Reducer<
  VenueState,
  {
    payload: { filter: { genre?: string; date: string; area: string }; areaVenues: Venue[] };
    type: 'filter:update' | 'area:update';
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
      return { ...state, filter: newFilter, filteredVenues };
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
      return { areaVenues: newVenues, filteredVenues, filter: newFilter };
    }
  }
};

export default function Page() {
  const [venues, dispatch] = useReducer(reducer, {
    areaVenues: [],
    filteredVenues: [],
    filter: { genre: '', area: '', date: '2025' },
  });
  const [geoData, setGeoData] = useState(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [view, setView] = useState<string>('list');

  const handleAreaChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'area:update', payload: { filter: { ...venues.filter, area: e.target.value }, areaVenues: [] } });
    const [geoJson, venueRes] = await Promise.all([
      fetch(`/${e.target.value}.geojson`).then((res) => res.json()),
      fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
                capacity
              }
            }
          `,
        }),
      }).then((res) => res.json()),
    ]);
    setGeoData(geoJson);
    const newVenues = venueRes.data.venues;
    setGenres(
      newVenues.reduce((acc: string[], venue: Venue) => {
        return acc.concat(venue.genres.filter((genre) => !acc.includes(genre)));
      }, [])
    );
    dispatch({
      type: 'area:update',
      payload: { filter: { ...venues.filter, area: e.target.value }, areaVenues: newVenues },
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

  return (
    <main className={styles.main}>
      <div className={styles.filter}>
        <select value={venues.filter.area} onChange={handleAreaChange}>
          <option value="">-- Please Choose An Area --</option>
          {/* <option value="New York City">New York City</option> */}
          <option value="Philadelphia">Philadelphia</option>
        </select>
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
          <option value="">-- Please Choose A Genre --</option>
          {genres.map((genre, idx) => (
            <option value={genre} key={idx}>
              {genre}
            </option>
          ))}
        </select>
        <fieldset>
          <legend>Select a view:</legend>

          <div>
            <input
              type="radio"
              id="list"
              name="drone"
              value="list"
              checked={view === 'list'}
              onChange={() => setView('list')}
            />
            <label htmlFor="list">List</label>
          </div>

          <div>
            <input
              type="radio"
              id="map"
              name="drone"
              value="map"
              checked={view === 'map'}
              onChange={() => setView('map')}
            />
            <label htmlFor="map">Map</label>
          </div>
        </fieldset>
      </div>
      <div className={styles.chart}>
        {!geoData ? null : view === 'list' ? (
          <TableView venues={venues.filteredVenues} />
        ) : view === 'map' ? (
          <Map
            data={geoData}
            points={venues.filteredVenues.map((venue) => ({
              ...venue,
              latitude: venue.location[0],
              longitude: venue.location[1],
            }))}
          />
        ) : null}
      </div>
    </main>
  );
}
