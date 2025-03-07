import { Venue } from './api/graphql/types';

const Points: React.FC<{
  points: (Venue & { latitude: number; longitude: number })[];
  openVenues: number[];
  focusedVenue?: number;
  projection: any;
}> = ({ points, projection, openVenues, focusedVenue }) =>
  points.map((venue) => {
    const fill = openVenues.includes(venue.id) ? 'red' : 'black';
    return (
      <circle
        cx={projection([venue.longitude, venue.latitude])[0]}
        cy={projection([venue.longitude, venue.latitude])[1]}
        key={venue.id}
        r={venue.id === focusedVenue ? 6 : 3}
        fill={fill}
      >
        <title>{venue.name}</title>
      </circle>
    );
  });

export default Points;
