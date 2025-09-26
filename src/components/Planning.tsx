import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppData, PaymentPlan } from '../types';
import { CalculationService } from '../services/CalculationService';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';

interface PlanningProps {
  appData: AppData;
  updateAppData: (data: AppData) => void;
}

const Planning = ({ appData, updateAppData }: PlanningProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    totalAmount: '',
    currency: 'USD' as 'USD' | 'EUR' | 'GOLD',
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    numberOfPayments: '',
    startDate: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createPlan = () => {
    const totalAmount = parseFloat(formData.totalAmount);
    const numberOfPayments = parseInt(formData.numberOfPayments);
    const startDate = new Date(formData.startDate);

    if (isNaN(totalAmount) || isNaN(numberOfPayments) || !startDate) {
      alert(t('common.error'));
      return;
    }

    CalculationService.calculatePaymentPlan(
      totalAmount,
      formData.currency,
      formData.frequency,
      numberOfPayments,
      startDate
    );

    const newPlan: PaymentPlan = {
      id: Date.now().toString(),
      totalAmount,
      currency: formData.currency,
      frequency: formData.frequency,
      numberOfPayments,
      startDate,
      payments: [],
      completed: false
    };

    updateAppData({
      ...appData,
      paymentPlans: [...appData.paymentPlans, newPlan]
    });

    setFormData({
      totalAmount: '',
      currency: 'USD',
      frequency: 'monthly',
      numberOfPayments: '',
      startDate: ''
    });
    handleClose();
  };

  const markCompleted = (planId: string) => {
    const updatedPlans = appData.paymentPlans.map(plan =>
      plan.id === planId ? { ...plan, completed: true } : plan
    );
    updateAppData({
      ...appData,
      paymentPlans: updatedPlans
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('planning.title')}
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          {t('planning.createPlan')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {appData.paymentPlans.length === 0 ? (
          <Grid xs={12}>
            <Alert severity="info">
              {t('planning.existingPlans')}: {t('common.no')}
            </Alert>
          </Grid>
        ) : (
          appData.paymentPlans.map(plan => (
            <Grid xs={12} md={6} key={plan.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('planning.totalAmount')}: {formatCurrency(plan.totalAmount, plan.currency)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('planning.frequency')}: {t(`planning.${plan.frequency}`)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('planning.numberOfPayments')}: {plan.numberOfPayments}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('planning.startDate')}: {formatDate(plan.startDate)}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={plan.completed ? t('planning.completed') : t('planning.inProgress')}
                      color={plan.completed ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </CardContent>
                {!plan.completed && (
                  <CardActions>
                    <Button size="small" onClick={() => markCompleted(plan.id)}>
                      {t('planning.completed')}
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('planning.createPlan')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label={t('planning.totalAmount')}
                type="number"
                value={formData.totalAmount}
                onChange={(e) => handleInputChange('totalAmount', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('payments.currency')}</InputLabel>
                <Select
                  value={formData.currency}
                  label={t('payments.currency')}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GOLD">{t('calculator.goldEquivalent')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('planning.frequency')}</InputLabel>
                <Select
                  value={formData.frequency}
                  label={t('planning.frequency')}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                >
                  <MenuItem value="monthly">{t('planning.monthly')}</MenuItem>
                  <MenuItem value="quarterly">{t('planning.quarterly')}</MenuItem>
                  <MenuItem value="yearly">{t('planning.yearly')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('planning.numberOfPayments')}
                type="number"
                value={formData.numberOfPayments}
                onChange={(e) => handleInputChange('numberOfPayments', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('planning.startDate')}
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Button onClick={createPlan} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Planning;
