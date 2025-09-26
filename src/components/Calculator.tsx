import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppData, UserSettings, SurplusCalculation, GoldPrice } from '../types';
import { CalculationService } from '../services/CalculationService';
import { GoldPriceService } from '../services/GoldPriceService';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Grid
} from '@mui/material';

interface CalculatorProps {
  appData: AppData;
  updateAppData: (data: AppData) => void;
  settings: UserSettings;
}

const Calculator = ({ appData, updateAppData, settings }: CalculatorProps) => {
  const { t } = useTranslation();
  type PeriodType = 'month' | 'quarter' | 'year' | 'custom';
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calculation, setCalculation] = useState<SurplusCalculation | null>(null);
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      const price = await GoldPriceService.fetchGoldPrice(settings.currency);
      setGoldPrice(price);
    };
    fetchGoldPrice();
  }, [settings.currency]);

  const calculateSurplus = async () => {
    setLoading(true);
    try {
      let period: { start: Date; end: Date };

      if (periodType === 'custom') {
        if (!startDate || !endDate) {
          alert(t('common.error'));
          setLoading(false);
          return;
        }
        period = {
          start: new Date(startDate),
          end: new Date(endDate)
        };
      } else {
        period = CalculationService.getCurrentPeriod(periodType);
      }

      const result = CalculationService.calculateSurplus(
        appData.transactions,
        period.start,
        period.end,
        settings.essentialCategories
      );

      // Update remaining amount based on payments
      const updatedCalculation = CalculationService.updateRemainingAmount(
        result,
        appData.payments
      );

      setCalculation(updatedCalculation);

      // Update appData with last calculation
      updateAppData({
        ...appData,
        lastCalculation: updatedCalculation
      });
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: settings.currency
    }).format(amount);
  };

  const formatGold = (amount: number) => {
    if (!goldPrice) return 'N/A';
    const goldAmount = CalculationService.convertToGold(amount, goldPrice, settings.mithqalToGram);
    return `${goldAmount.toFixed(2)} ${t('calculator.mithqal')}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('calculator.title')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('calculator.period')}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{t('calculator.period')}</InputLabel>
              <Select
                value={periodType}
                label={t('calculator.period')}
                onChange={(e) => setPeriodType(e.target.value as PeriodType)}
              >
                <MenuItem value="month">{t('calculator.currentMonth')}</MenuItem>
                <MenuItem value="quarter">{t('calculator.currentQuarter')}</MenuItem>
                <MenuItem value="year">{t('calculator.currentYear')}</MenuItem>
                <MenuItem value="custom">{t('calculator.customPeriod')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {periodType === 'custom' && (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('calculator.startDate')}
                  value={startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('calculator.endDate')}
                  value={endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
        </Grid>

        <Button
          variant="contained"
          onClick={calculateSurplus}
          disabled={loading}
          fullWidth
        >
          {loading ? t('common.loading') : t('calculator.calculate')}
        </Button>
      </Paper>

      {calculation && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('calculator.results')}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('calculator.totalIncome')}
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(calculation.totalIncome)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('calculator.totalExpenses')}
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(calculation.totalExpenses)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('calculator.essentialExpenses')}
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(calculation.essentialExpenses)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('calculator.surplus')}
                  </Typography>
                  <Typography variant="h5" color={calculation.surplus >= 0 ? 'success.main' : 'error.main'}>
                    {formatCurrency(calculation.surplus)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('calculator.huquqAmount')}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatCurrency(calculation.huquqAmount)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('calculator.goldEquivalent')}: {formatGold(calculation.huquqAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('calculator.remainingAmount')}
                  </Typography>
                  <Typography variant="h5" color={calculation.remainingAmount > 0 ? 'warning.main' : 'success.main'}>
                    {formatCurrency(calculation.remainingAmount)}
                  </Typography>
                  {calculation.remainingAmount > 0 && (
                    <Typography variant="body2" color="textSecondary">
                      {t('calculator.goldEquivalent')}: {formatGold(calculation.remainingAmount)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {goldPrice && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {t('dashboard.goldPrice')}: {formatCurrency(goldPrice.price)} / gram ({goldPrice.source})
            </Alert>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Calculator;
