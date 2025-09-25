import React from 'react';
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
} from '@mui/material';
import { Add as AddIcon, TrendingUp as TrendingUpIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import type { AppData, UserSettings } from '../types';

interface DashboardProps {
  appData: AppData;
  updateAppData: (newData: AppData) => void;
  settings: UserSettings;
}

const Dashboard = ({ appData, settings }: DashboardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Calculate balance due (simplified calculation)
  const totalIncome = appData.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = appData.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balanceDue = totalExpenses - totalIncome;

  // Next payment (find the earliest upcoming payment from all plans)
  const allPayments = appData.paymentPlans.flatMap(plan => plan.payments);
  const nextPayment = allPayments
    .filter(p => new Date(p.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Gold price (placeholder - would come from service)
  const goldPrice = 55.12; // Placeholder

  // Recent transactions
  const recentTransactions = appData.transactions
    .slice(-3)
    .reverse();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard.title', 'Huququ\'llah Assistant')}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {t('dashboard.subtitle', 'Solde dû, prochain paiement, prix or actuel')}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Card sx={{ minWidth: 200, flex: '1 1 auto' }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              {t('dashboard.balanceDue', 'Solde dû')}
            </Typography>
            <Typography variant="h5" component="div">
              {balanceDue.toFixed(2)} {settings.currency}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: '1 1 auto' }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              {t('dashboard.nextPayment', 'Prochain paiement')}
            </Typography>
            <Typography variant="h5" component="div">
              {nextPayment ? new Date(nextPayment.date).toLocaleDateString() : t('common.none', 'Aucun')}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: '1 1 auto' }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              {t('dashboard.goldPrice', 'Prix or actuel')}
            </Typography>
            <Typography variant="h5" component="div">
              {goldPrice.toFixed(2)} €/g
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('dashboard.quickActions', 'Actions rapides')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/transactions')}>
            {t('dashboard.addIncome', 'Ajouter revenu')}
          </Button>
          <Button variant="contained" startIcon={<TrendingUpIcon />} onClick={() => navigate('/transactions')}>
            {t('dashboard.addExpense', 'Ajouter dépense')}
          </Button>
          <Button variant="outlined" startIcon={<ScheduleIcon />} onClick={() => navigate('/planning')}>
            {t('dashboard.schedulePayment', 'Planifier paiement')}
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('dashboard.recentTransactions', 'Dernières transactions')}
          </Typography>
          <List>
            {recentTransactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                <ListItem>
                  <ListItemText
                    primary={`${transaction.type === 'income' ? t('transaction.income', 'Revenu') : t('transaction.expense', 'Dépense')}: ${transaction.description}`}
                    secondary={`${transaction.amount.toFixed(2)} ${settings.currency}`}
                  />
                </ListItem>
                {index < recentTransactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
