import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Calculate as CalculateIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const Welcome = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const features = [
    {
      icon: DashboardIcon,
      title: t('welcome.features.dashboard.title'),
      description: t('welcome.features.dashboard.description'),
    },
    {
      icon: ReceiptIcon,
      title: t('welcome.features.transactions.title'),
      description: t('welcome.features.transactions.description'),
    },
    {
      icon: CalculateIcon,
      title: t('welcome.features.calculator.title'),
      description: t('welcome.features.calculator.description'),
    },
    {
      icon: CreditCardIcon,
      title: t('welcome.features.payments.title'),
      description: t('welcome.features.payments.description'),
    },
    {
      icon: CalendarIcon,
      title: t('welcome.features.planning.title'),
      description: t('welcome.features.planning.description'),
    },
    {
      icon: SettingsIcon,
      title: t('welcome.features.settings.title'),
      description: t('welcome.features.settings.description'),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            component="img"
            src="/logo/Logo Huququllah - Étoile 9 pointes Monoline.jpg"
            alt="Huququllah Logo"
            sx={{
              width: 80,
              height: 80,
              borderRadius: 3,
              objectFit: 'contain',
              mx: 'auto',
              mb: 3,
            }}
          >
          </Box>
          <Typography variant="h2" component="h1" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Ḥuqúqu’lláh Assistant
          </Typography>
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
            {t('welcome.subtitle')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 600, mx: 'auto' }}>
            {t('welcome.description')}
          </Typography>

          <Button
            component={Link}
            to="/"
            variant="outlined"
            size="large"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
              px: 4,
              py: 1.5,
              borderRadius: 3,
            }}
          >
            {t('welcome.getStarted')}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Icon sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Welcome;
