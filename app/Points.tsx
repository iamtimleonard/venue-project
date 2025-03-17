import { Venue } from './api/graphql/types';

const Points: React.FC<{
  points: (Venue & { latitude: number; longitude: number })[];
  openVenues: number[];
  focusedVenue?: number;
  projection: any;
  onRowSelection: any;
}> = ({ points, projection, openVenues, focusedVenue, onRowSelection }) => {
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
    soul: 'violet',
    indie: 'red',
  };
  return points.map((venue) => {
    const strokeWidth = (capacity = 500) => {
      if (!openVenues.includes(venue.id)) return 1;
      const minCapacity = 100;
      const maxCapacity = 100000;
      const maxStrokeWidth = 20;
      const minStrokeWidth = 1;
      return (
        ((capacity - minCapacity) / (maxCapacity - minCapacity)) * (maxStrokeWidth - minStrokeWidth) + minStrokeWidth
      );
    };

    return (
      <circle
        cx={projection([venue.longitude, venue.latitude])[0]}
        cy={projection([venue.longitude, venue.latitude])[1]}
        key={venue.id}
        r={venue.id === focusedVenue ? 6 : 3}
        fill={!openVenues.includes(venue.id) ? 'transparent' : colors[venue.genres[0] || 'black']}
        stroke={colors[venue.genres[0]] || 'black'}
        strokeWidth={strokeWidth(venue.capacity)}
        strokeOpacity={0.2}
        onClick={() => onRowSelection(venue)}
      >
        <title>{venue.name}</title>
      </circle>
    );
  });
};

export default Points;
