import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Alert,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Calculate as CalculateIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  AccountBalance as CoinsIcon,
} from '@mui/icons-material';
import { StorageService } from '../services/StorageService';

const Welcome = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tab, setTab] = useState(0); // 0: register, 1: login
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
            sx={{
              width: 80,
              height: 80,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <CoinsIcon sx={{ fontSize: 40, color: 'white' }} />
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

          {/* Auth Form */}
          <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            <Tabs
              value={tab}
              onChange={(_, newValue) => {
                setTab(newValue);
                setMessage(null);
                setName('');
              }}
              sx={{
                mb: 2,
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
                '& .Mui-selected': { color: 'white' },
                '& .MuiTabs-indicator': { backgroundColor: 'white' },
              }}
              centered
            >
              <Tab label="S'inscrire" />
              <Tab label="Se connecter" />
            </Tabs>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2, '& .MuiInputBase-root': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' } }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            />
            {tab === 0 && (
              <TextField
                fullWidth
                label="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2, '& .MuiInputBase-root': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
                InputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              />
            )}
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2, '& .MuiInputBase-root': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' } }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={async () => {
                if (!email || !password || (tab === 0 && !name)) {
                  setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
                  return;
                }
                setLoading(true);
                try {
                  let user;
                  if (tab === 0) {
                    user = StorageService.registerUser(email, name, password);
                    if (!user) {
                      setMessage({ type: 'error', text: 'Email déjà utilisé' });
                      setLoading(false);
                      return;
                    }
                    setMessage({ type: 'success', text: 'Compte créé avec succès!' });
                  } else {
                    user = StorageService.loginUser(email, password);
                    if (!user) {
                      setMessage({ type: 'error', text: 'Email ou mot de passe incorrect' });
                      setLoading(false);
                      return;
                    }
                    setMessage({ type: 'success', text: 'Connexion réussie!' });
                  }
                  localStorage.setItem('user', JSON.stringify(user));
                  setTimeout(() => {
                    window.location.href = '/dashboard';
                  }, 1500);
                } catch (error) {
                  setMessage({ type: 'error', text: 'Erreur lors de l\'authentification' });
                }
                setLoading(false);
              }}
              disabled={loading || !email || !password || (tab === 0 && !name)}
              sx={{ mb: 2 }}
            >
              {loading ? (tab === 0 ? 'Création...' : 'Connexion...') : (tab === 0 ? 'Créer le compte' : 'Se connecter')}
            </Button>
            {message && (
              <Alert severity={message.type} sx={{ mt: 2 }}>
                {message.text}
              </Alert>
            )}
          </Box>

          <Button
            component={Link}
            to="/dashboard"
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
