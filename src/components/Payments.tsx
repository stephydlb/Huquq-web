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
  Grid,
  InputAdornment,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import type { AppData, UserSettings, Payment } from '../types';
import { PdfService } from '../services/PdfService';

interface PaymentsProps {
  appData: AppData;
  updateAppData: (data: AppData) => void;
  settings: UserSettings;
}

const Payments = ({ appData, updateAppData, settings }: PaymentsProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'EUR' as 'USD' | 'EUR' | 'GOLD',
    goldAmount: '',
    method: 'cash' as 'cash' | 'bank' | 'gold',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleOpen = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        amount: payment.amount.toString(),
        currency: payment.currency,
        goldAmount: payment.goldAmount?.toString() || '',
        method: payment.method,
        date: payment.date.toISOString().split('T')[0],
        note: payment.note || ''
      });
    } else {
      setEditingPayment(null);
      setFormData({
        amount: '',
        currency: 'EUR',
        goldAmount: '',
        method: 'cash',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPayment(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const payment: Payment = {
      id: editingPayment?.id || crypto.randomUUID(),
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      goldAmount: formData.currency === 'GOLD' ? parseFloat(formData.goldAmount) : undefined,
      method: formData.method,
      date: new Date(formData.date),
      note: formData.note || undefined
    };

    try {
      // Generate PDF receipt
      const receiptUrl = await PdfService.generatePaymentReceipt(payment);
      payment.receipt = receiptUrl;

      const updatedPayments = editingPayment
        ? appData.payments.map(p => p.id === payment.id ? payment : p)
        : [...appData.payments, payment];

      updateAppData({
        ...appData,
        payments: updatedPayments
      });

      setSnackbar({
        open: true,
        message: editingPayment ? t('payments.paymentUpdated', 'Paiement mis à jour') : t('payments.paymentAdded', 'Paiement ajouté'),
        severity: 'success'
      });

      handleClose();
    } catch (error) {
      console.error('Error saving payment:', error);
      setSnackbar({
        open: true,
        message: t('payments.errorSaving', 'Erreur lors de la sauvegarde'),
        severity: 'error'
      });
    }
  };

  const handleDelete = (id: string) => {
    updateAppData({
      ...appData,
      payments: appData.payments.filter(p => p.id !== id)
    });
    setSnackbar({
      open: true,
      message: t('payments.paymentDeleted', 'Paiement supprimé'),
      severity: 'success'
    });
  };

  const handleDownloadReceipt = async (payment: Payment) => {
    try {
      if (payment.receipt) {
        PdfService.downloadFromBlobUrl(payment.receipt, `receipt-${payment.id}.pdf`);
      } else {
        // Generate new receipt if not exists
        const receiptUrl = await PdfService.generatePaymentReceipt(payment);
        PdfService.downloadFromBlobUrl(receiptUrl, `receipt-${payment.id}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setSnackbar({
        open: true,
        message: t('payments.errorDownloading', 'Erreur lors du téléchargement'),
        severity: 'error'
      });
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'GOLD' ? 'EUR' : currency
    }).format(amount);
  };

  const getMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: t('paymentMethod.cash', 'Espèces'),
      bank: t('paymentMethod.bank', 'Virement bancaire'),
      gold: t('paymentMethod.gold', 'Or physique')
    };
    return methods[method] || method;
  };

  const totalPaid = appData.payments
    .filter(p => p.currency !== 'GOLD')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalGoldPaid = appData.payments
    .filter(p => p.currency === 'GOLD')
    .reduce((sum, p) => sum + (p.goldAmount || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('payments.title', 'Paiements')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          {t('payments.addPayment', 'Ajouter paiement')}
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('payments.totalPaid', 'Total payé')}
            </Typography>
            <Typography variant="h4" color="primary">
              {formatCurrency(totalPaid, settings.currency)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('payments.totalGoldPaid', 'Or payé')}
            </Typography>
            <Typography variant="h4" color="secondary">
              {totalGoldPaid.toFixed(3)} {t('unit.mithqal', 'mithqāl')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Payments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('payments.date', 'Date')}</TableCell>
              <TableCell>{t('payments.amount', 'Montant')}</TableCell>
              <TableCell>{t('payments.method', 'Méthode')}</TableCell>
              <TableCell>{t('payments.note', 'Note')}</TableCell>
              <TableCell>{t('common.actions', 'Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appData.payments
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                <TableCell>
                  {payment.currency === 'GOLD'
                    ? `${payment.goldAmount?.toFixed(3)} ${t('unit.mithqal', 'mithqāl')}`
                    : formatCurrency(payment.amount, payment.currency)
                  }
                </TableCell>
                <TableCell>
                  <Chip label={getMethodLabel(payment.method)} size="small" />
                </TableCell>
                <TableCell>{payment.note || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDownloadReceipt(payment)} title={t('payments.downloadReceipt', 'Télécharger reçu')}>
                    <PdfIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpen(payment)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(payment.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Payment Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPayment ? t('payments.editPayment', 'Modifier paiement') : t('payments.addPayment', 'Ajouter paiement')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('payments.currency', 'Devise')}</InputLabel>
                <Select
                  value={formData.currency}
                  label={t('payments.currency', 'Devise')}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                >
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="GOLD">{t('currency.gold', 'Or')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={formData.currency === 'GOLD' ? t('payments.goldAmount', 'Quantité or') : t('payments.amount', 'Montant')}
                type="number"
                value={formData.currency === 'GOLD' ? formData.goldAmount : formData.amount}
                onChange={(e) => handleInputChange(formData.currency === 'GOLD' ? 'goldAmount' : 'amount', e.target.value)}
                InputProps={{
                  endAdornment: formData.currency === 'GOLD' ? (
                    <InputAdornment position="end">{t('unit.mithqal', 'mithqāl')}</InputAdornment>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('payments.method', 'Méthode')}</InputLabel>
                <Select
                  value={formData.method}
                  label={t('payments.method', 'Méthode')}
                  onChange={(e) => handleInputChange('method', e.target.value)}
                >
                  <MenuItem value="cash">{t('paymentMethod.cash', 'Espèces')}</MenuItem>
                  <MenuItem value="bank">{t('paymentMethod.bank', 'Virement bancaire')}</MenuItem>
                  <MenuItem value="gold">{t('paymentMethod.gold', 'Or physique')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('payments.date', 'Date')}
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('payments.note', 'Note')}
                multiline
                rows={2}
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Payments;
