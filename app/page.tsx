'use client';

import { ChangeEvent, Reducer, useEffect, useReducer, useState } from 'react';
import { Venue } from './api/graphql/types';
import Map from './Map';
import styles from './page.module.css';
import TableView from './Table';
import SelectedVenue from './SelectedVenue';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';

type VenueState = {
  areaVenues: Venue[];
  filteredVenues: Venue[];
  openVenues: number[];
  focusedVenue?: number;
  filter: {
    genre?: string[];
    date: string;
    area: string;
  };
};

const reducer: Reducer<
  VenueState,
  {
    payload: {
      filter: { genre?: string[]; date: string; area: string };
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
        if (newFilter.genre && newFilter.genre.length) {
          for (let test of newFilter.genre) {
            if (venue.genres.includes(test)) return true;
          }
          return false;
        }
        return true;
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
        genre: [],
        date: new Date().getFullYear().toString(),
        area: action.payload.filter.area,
      };

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
      return { areaVenues: newVenues, filteredVenues: [...newVenues], filter: newFilter, openVenues, closedVenues };
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
    filter: { genre: [], area: 'Philadelphia', date: '2025' },
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

  const handleDateChange = (event: Event, value: number, thumb: number) => {
    const { areaVenues, filter } = venues;
    dispatch({
      type: 'filter:update',
      payload: {
        areaVenues,
        filter: {
          ...filter,
          date: `${value}`,
        },
      },
    });
  };

  const handleGenreChange = (e: SelectChangeEvent<string>) => {
    const { areaVenues, filter } = venues;
    dispatch({
      type: 'filter:update',
      payload: {
        areaVenues,
        filter: {
          ...filter,
          genre: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
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
      <Accordion>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
          <Typography>Venues List</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableView venues={venues.areaVenues} onRowSelection={onRowSelection} selectedVenueId={venues.focusedVenue} />
        </AccordionDetails>
      </Accordion>
      <FormControl margin="normal" sx={{ width: '50%', minWidth: '10rem', marginLeft: '25%' }}>
        <InputLabel>View active by year: {venues.filter.date}</InputLabel>
        <Slider
          aria-label="Year"
          valueLabelDisplay="auto"
          shiftStep={10}
          step={1}
          marks
          min={1900}
          max={new Date().getFullYear()}
          value={+venues.filter.date}
          onChange={handleDateChange}
          sx={{ margin: '2rem 0' }}
        />
        <Select
          labelId="by-genre"
          displayEmpty
          multiple
          value={venues.filter.genre as unknown as string}
          renderValue={(selected: any) => {
            if (selected.length === 0) {
              return <em>Filter by genre</em>;
            }
            return selected.join(', ');
          }}
          onChange={handleGenreChange}
        >
          {genres.map((genre, idx) => (
            <MenuItem value={genre} key={genre}>
              <Checkbox checked={venues.filter.genre.includes(genre)} />
              <ListItemText primary={genre} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper sx={{ display: 'flex', margin: '1rem' }}>
        <div style={{ width: '75%' }}>
          <Map
            data={geoData}
            points={venues.filteredVenues.map((venue) => ({
              ...venue,
              latitude: venue.location[0],
              longitude: venue.location[1],
            }))}
            openVenues={venues.openVenues}
            focusedVenue={venues.focusedVenue}
            onRowSelection={onRowSelection}
          />
        </div>
        <SelectedVenue selectedVenue={venues.areaVenues.find((venue) => venue.id === venues.focusedVenue)} />
      </Paper>
    </main>
  );
}
