import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import type { AppData, UserSettings, GoldPrice } from '../types';
import { CalculationService } from '../services/CalculationService';
import { GoldPriceService } from '../services/GoldPriceService';

interface DashboardProps {
  appData: AppData;
  updateAppData: (newData: AppData) => void;
  settings: UserSettings;
}

const Dashboard = ({ appData, settings }: DashboardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoldPrice = async () => {
      try {
        const price = await GoldPriceService.fetchGoldPrice(settings.currency as 'USD' | 'EUR');
        setGoldPrice(price);
      } catch (error) {
        console.error('Failed to load gold price:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGoldPrice();
  }, [settings.currency]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const period = CalculationService.getCurrentPeriod();
  const surplusCalc = CalculationService.calculateSurplus(appData.transactions, period.start, period.end, settings.essentialCategories);
  const huquqAmount = surplusCalc.huquqAmount;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        {t('dashboard.title', 'Tableau de Bord')}
      </Typography>

      <Grid container spacing={3}>
        {/* Surplus Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">{t('dashboard.surplus', 'Surplus')}</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {surplusCalc.surplus.toFixed(2)} {settings.currency}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Huquq Amount Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{t('dashboard.huquq', 'Ḥuqúqu\'lláh Dû')}</Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {huquqAmount.toFixed(2)} {settings.currency}
              </Typography>
              {goldPrice && (
                <Typography variant="body2" color="text.secondary">
                  Équivalent or: {huquqAmount / goldPrice.price} g
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDownIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">{t('dashboard.recent', 'Transactions Récentes')}</Typography>
              </Box>
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {appData.transactions.slice(-5).reverse().map((tx) => (
                  <React.Fragment key={tx.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${tx.amount} ${settings.currency}`}
                        secondary={`${tx.description} - ${tx.date}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              {appData.transactions.length === 0 && (
                <Alert severity="info">
                  {t('dashboard.noTransactions', 'Aucune transaction enregistrée.')}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.quickActions', 'Actions Rapides')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/transactions')}
                >
                  {t('dashboard.addTransaction', 'Ajouter Transaction')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/calculator')}
                >
                  {t('dashboard.calculate', 'Calculer Ḥuqúqu\'lláh')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/payments')}
                >
                  {t('dashboard.recordPayment', 'Enregistrer Paiement')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

