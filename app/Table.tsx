import { Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Venue } from './api/graphql/types';
import { useEffect, useState } from 'react';

type TableProps = {
  venues: Venue[];
  onRowSelection: (venues: Venue) => void;
  selectedVenueId?: number;
};

const TableView: React.FC<TableProps> = ({ venues, onRowSelection, selectedVenueId }) => {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', sortable: true, width: 500 },
    { field: 'dateOpen', headerName: 'Opened', sortable: true },
    { field: 'dateClosed', headerName: 'Closed' },
    { field: 'capacity', headerName: 'Capacity', sortable: true },
    { field: 'genres', valueFormatter: (value: string[]) => value.join(', ') },
  ];

  useEffect(() => {
    if (selectedVenueId !== undefined) {
      setSelectionModel([selectedVenueId]);
    }
  }, [selectedVenueId]);

  return (
    <Paper sx={{ width: 'auto', overflow: 'hidden' }}>
      <DataGrid
        columns={columns}
        rows={venues}
        onRowClick={(params) => onRowSelection(params.row)}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(newSelectionModel) => setSelectionModel(newSelectionModel)}
        sx={{ maxHeight: 440 }}
      />
    </Paper>
  );
};

export default TableView;
