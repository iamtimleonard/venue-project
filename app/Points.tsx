import { Venue } from './api/graphql/types';

const Points: React.FC<{
  points: (Venue & { latitude: number; longitude: number })[];
  openVenues: number[];
  focusedVenue?: number;
  projection: any;
}> = ({ points, projection, openVenues, focusedVenue }) => {
  const colors = {
    jazz: 'blue',
    rock: 'red',
    classical: 'blue',
    EDM: 'purple',
    house: 'purple',
    DIY: 'green',
    rap: 'orange',
    punk: 'red',
    folk: 'yellow',
    'R&B': 'violet',
    indie: 'red',
  };
  return points.map((venue) => {
    return (
      <circle
        cx={projection([venue.longitude, venue.latitude])[0]}
        cy={projection([venue.longitude, venue.latitude])[1]}
        key={venue.id}
        r={venue.id === focusedVenue ? 6 : 3}
        fill={!openVenues.includes(venue.id) ? 'transparent' : colors[venue.genres[0] || 'black']}
        stroke={colors[venue.genres[0]] || 'black'}
      >
        <title>{venue.name}</title>
      </circle>
    );
  });
};

export default Points;
