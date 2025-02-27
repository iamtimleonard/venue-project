import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Venue } from './api/graphql/types';

type TableProps = {
  venues: Venue[];
};

const TableView: React.FC<TableProps> = ({ venues }) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Open</TableCell>
              <TableCell>Close</TableCell>
              <TableCell>Genres</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell>{venue.name}</TableCell>
                <TableCell>{venue.dateOpen}</TableCell>
                <TableCell>{venue.dateClosed || ''}</TableCell>
                <TableCell>{venue.genres.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TableView;
