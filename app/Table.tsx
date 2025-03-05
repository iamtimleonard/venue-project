import { Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Venue } from './api/graphql/types';

type TableProps = {
  venues: Venue[];
  onRowSelection: (venues: Venue[]) => void;
};

const TableView: React.FC<TableProps> = ({ venues, onRowSelection }) => {
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', sortable: true, width: 500 },
    { field: 'dateOpen', headerName: 'Opened', sortable: true },
    { field: 'dateClosed', headerName: 'Closed' },
    { field: 'capacity', headerName: 'Capacity', sortable: true },
    { field: 'genres', valueFormatter: (value: string[]) => value.join(', ') },
  ];
  return (
    <Paper sx={{ width: 'auto', overflow: 'hidden' }}>
      <DataGrid
        columns={columns}
        rows={venues}
        checkboxSelection
        onRowSelectionModelChange={(model, details) => onRowSelection(model.map((rowId) => details.api.getRow(rowId)))}
        sx={{ maxHeight: 440 }}
      />
    </Paper>
  );
};

export default TableView;
