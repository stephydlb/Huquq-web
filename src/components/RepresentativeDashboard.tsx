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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
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
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPassword, setNewClientPassword] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [clientPayments, setClientPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/my-clients?repId=${currentUserId}`)
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

  const fetchClientDetails = (clientId: string) => {
    // Fetch payments
    fetch(`/client-payments/${currentUserId}/${clientId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch client payments');
        }
        return res.json();
      })
      .then((data) => {
        setClientPayments(data);
      })
      .catch((err) => {
        setError(err.message);
        setSnackbarOpen(true);
      });

    // TODO: Fetch transactions and plans similarly
    // For now, they are not implemented
  };

  const handleClientAction = (clientId: string) => {
    setSelectedClientId(clientId);
    setTabIndex(0);
    fetchClientDetails(clientId);
  };

  const handleAddClient = () => {
    if (!newClientName || !newClientEmail || !newClientPassword) {
      setError('Name, Email, and Password are required');
      setSnackbarOpen(true);
      return;
    }

    fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newClientName,
        email: newClientEmail,
        password: newClientPassword,
        role: 'client',
        representativeId: currentUserId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 409) {
            throw new Error('Client already exists');
          }
          throw new Error('Failed to add client');
        }
        return res.json();
      })
      .then((data) => {
        setClients((prev) => [...prev, { id: data.userId, name: newClientName, email: newClientEmail }]);
        setAddDialogOpen(false);
        setNewClientName('');
        setNewClientEmail('');
        setNewClientPassword('');
      })
      .catch((err) => {
        setError(err.message);
        setSnackbarOpen(true);
      });
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
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setAddDialogOpen(true)}>
          Add New Client
        </Button>
      </Box>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={newClientEmail}
            onChange={(e) => setNewClientEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={newClientPassword}
            onChange={(e) => setNewClientPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddClient}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedClientId} onClose={() => setSelectedClientId(null)} maxWidth="md" fullWidth>
        <DialogTitle>Manage Client</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={(_e, newValue) => setTabIndex(newValue)}>
              <Tab label="Payments" />
              <Tab label="Transactions" />
              <Tab label="Planning" />
            </Tabs>
          </Box>
          <Box sx={{ p: 2 }}>
            {tabIndex === 0 && (
              <Box>
                <Typography variant="h6">Payments</Typography>
                {clientPayments.length === 0 ? (
                  <Typography>No payments found.</Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Amount</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clientPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.amount}</TableCell>
                            <TableCell>{payment.description || 'N/A'}</TableCell>
                            <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                            <TableCell>{payment.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}
            {tabIndex === 1 && (
              <Box>
                <Typography variant="h6">Transactions</Typography>
                <Typography>Transactions data not available yet.</Typography>
              </Box>
            )}
            {tabIndex === 2 && (
              <Box>
                <Typography variant="h6">Planning</Typography>
                <Typography>Planning data not available yet.</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedClientId(null)}>Close</Button>
        </DialogActions>
      </Dialog>

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
