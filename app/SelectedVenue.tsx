import { Card, CardContent, Typography } from '@mui/material';
import { Venue } from './api/graphql/types';

const SelectedVenue = ({ selectedVenue }: { selectedVenue?: Venue }) => {
  if (!selectedVenue) return <></>;
  return (
    <Card>
      <CardContent>
        <Typography>{selectedVenue.name}</Typography>
        <Typography>Open: {selectedVenue.dateOpen}</Typography>
        <Typography>Closed: {selectedVenue.dateClosed || 'N/A'}</Typography>
        <Typography>Capacity: {selectedVenue.capacity || 'N/A'}</Typography>
        <Typography>Genres: {selectedVenue.genres.join(', ')}</Typography>
      </CardContent>
    </Card>
  );
};

export default SelectedVenue;
