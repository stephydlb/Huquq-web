import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Grid
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { AppData, UserSettings, Transaction } from '../types';

interface TransactionsProps {
  appData: AppData;
  updateAppData: (data: AppData) => void;
  settings: UserSettings;
}

const Transactions = ({ appData, updateAppData, settings }: TransactionsProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    isEssential: false
  });

  const handleOpen = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description,
        category: transaction.category,
        date: transaction.date.toISOString().split('T')[0],
        isEssential: transaction.isEssential
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'income',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        isEssential: false
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransaction(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const transaction: Transaction = {
      id: editingTransaction?.id || crypto.randomUUID(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: new Date(formData.date),
      isEssential: formData.isEssential
    };

    const updatedTransactions = editingTransaction
      ? appData.transactions.map(t => t.id === transaction.id ? transaction : t)
      : [...appData.transactions, transaction];

    updateAppData({
      ...appData,
      transactions: updatedTransactions
    });

    handleClose();
  };

  const handleDelete = (id: string) => {
    updateAppData({
      ...appData,
      transactions: appData.transactions.filter(t => t.id !== id)
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: settings.currency
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('transactions.title', 'Transactions')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          {t('transactions.addTransaction', 'Ajouter transaction')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('transactions.type', 'Type')}</TableCell>
              <TableCell>{t('transactions.description', 'Description')}</TableCell>
              <TableCell>{t('transactions.category', 'Catégorie')}</TableCell>
              <TableCell>{t('transactions.amount', 'Montant')}</TableCell>
              <TableCell>{t('transactions.date', 'Date')}</TableCell>
              <TableCell>{t('transactions.essential', 'Essentiel')}</TableCell>
              <TableCell>{t('common.actions', 'Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appData.transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Chip
                    label={transaction.type === 'income' ? t('transaction.income', 'Revenu') : t('transaction.expense', 'Dépense')}
                    color={transaction.type === 'income' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                <TableCell>
                  {transaction.isEssential && (
                    <Chip label={t('transactions.essential', 'Essentiel')} size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(transaction)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(transaction.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransaction ? t('transactions.editTransaction', 'Modifier transaction') : t('transactions.addTransaction', 'Ajouter transaction')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('transactions.type', 'Type')}</InputLabel>
                <Select
                  value={formData.type}
                  label={t('transactions.type', 'Type')}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <MenuItem value="income">{t('transaction.income', 'Revenu')}</MenuItem>
                  <MenuItem value="expense">{t('transaction.expense', 'Dépense')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('transactions.amount', 'Montant')}
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('transactions.date', 'Date')}
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('transactions.description', 'Description')}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('transactions.category', 'Catégorie')}</InputLabel>
                <Select
                  value={formData.category}
                  label={t('transactions.category', 'Catégorie')}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  {settings.essentialCategories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                  <MenuItem value="Autre">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isEssential}
                    onChange={(e) => handleInputChange('isEssential', e.target.checked)}
                  />
                }
                label={t('transactions.essential', 'Essentiel')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel', 'Annuler')}</Button>
          <Button onClick={handleSave} variant="contained">
            {t('common.save', 'Enregistrer')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;
