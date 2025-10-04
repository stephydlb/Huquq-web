import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface RepresentativeDashboardProps {
  currentUserId: string;
}

const RepresentativeDashboard = ({ currentUserId }: RepresentativeDashboardProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/my-clients?repId=${currentUserId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch clients');
        }
        return res.json();
      })
      .then((data) => {
        setClients(data);
      })
      .catch((err) => {
        setError(err.message);
        setSnackbarOpen(true);
      });
  }, [currentUserId]);

  const handleClientAction = (clientId: string) => {
    // Placeholder for managing client actions (e.g., view details, send message)
    alert(`Manage client with ID: ${clientId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Clients
      </Typography>
      {clients.length === 0 ? (
        <Typography>No clients assigned yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="clients table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" onClick={() => handleClientAction(client.id)}>
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RepresentativeDashboard;
