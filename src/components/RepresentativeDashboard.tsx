import { useState, useEffect } from 'react';
import supabase from '../services/SupabaseService';
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
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('representativeId', currentUserId);

      if (error) {
        setError(error.message);
        setSnackbarOpen(true);
      } else {
        setClients(data || []);
      }
    };

    fetchClients();
  }, [currentUserId]);

  const fetchClientDetails = async (clientId: string) => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('clientId', clientId);

    if (error) {
      setError(error.message);
      setSnackbarOpen(true);
    } else {
      setClientPayments(data || []);
    }
  };

  const handleClientAction = (clientId: string) => {
    setSelectedClientId(clientId);
    setTabIndex(0);
    fetchClientDetails(clientId);
  };

  const handleAddClient = async () => {
    if (!newClientName || !newClientEmail || !newClientPassword) {
      setError('Name, Email, and Password are required');
      setSnackbarOpen(true);
      return;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: newClientEmail,
      password: newClientPassword,
      user_metadata: {
        name: newClientName,
        role: 'client',
        representativeId: currentUserId,
      },
    });

    if (error) {
      if (error.message.includes('duplicate key value')) {
        setError('Client already exists');
      } else {
        setError('Failed to add client');
      }
      setSnackbarOpen(true);
      return;
    }

    if (data) {
      const newClient = {
        id: data.user.id,
        name: newClientName,
        email: newClientEmail,
      };
      setClients((prev) => [...prev, newClient]);
      setAddDialogOpen(false);
      setNewClientName('');
      setNewClientEmail('');
      setNewClientPassword('');
    }
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
