import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { StorageService } from './services/StorageService';
import type { AppData, UserSettings } from './types';

// Components
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard_new';
import Transactions from './components/Transactions';
import Calculator from './components/Calculator';
import Payments from './components/Payments';
import Planning from './components/Planning';
import Settings from './components/Settings';
import Help from './components/Help';
import Navigation from './components/Navigation_new';
import SecurityModal from './components/SecurityModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const { t } = useTranslation();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user) {
      setHasUser(true);
      setCurrentUser(user);
      const userId = user.id;

      // Load user-specific data
      const loadedAppData = StorageService.loadAppData(userId);
      const loadedSettings = StorageService.loadUserSettings(userId);

      if (loadedAppData) {
        setAppData(loadedAppData);
      } else {
        // Initialize with default data for this user
        const defaultData: AppData = {
          transactions: [],
          payments: [],
          paymentPlans: [],
          settings: {
            language: 'fr',
            currency: 'EUR',
            goldUnit: 'mithqal',
            mithqalToGram: 4.25,
            essentialCategories: ['Logement', 'Nourriture', 'Santé', 'Éducation', 'Transport'],
            notifications: {
              enabled: true,
              paymentReminders: true,
              goldPriceAlerts: false
            },
            security: {
              pinEnabled: false,
              biometricEnabled: false
            }
          }
        };
        setAppData(defaultData);
        StorageService.saveAppData(defaultData, userId);
      }

      if (loadedSettings) {
        setSettings(loadedSettings);
      } else if (loadedAppData?.settings) {
        setSettings(loadedAppData.settings);
      }

      // Check if PIN is required
      const finalSettings = loadedSettings || loadedAppData?.settings;
      if (finalSettings?.security.pinEnabled) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } else {
      // No user, show Welcome
      setHasUser(false);
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  const updateAppData = (newData: AppData) => {
    setAppData(newData);
    if (currentUser) {
      StorageService.saveAppData(newData, currentUser.id);
    }
  };

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    if (currentUser) {
      StorageService.saveUserSettings(newSettings, currentUser.id);
    }

    if (appData) {
      const updatedData = { ...appData, settings: newSettings };
      updateAppData(updatedData);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isLoading ? (
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {t('common.loading')}
              </Typography>
            </Box>
          </Box>
        ) : !hasUser ? (
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : !appData || !settings ? (
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="error">
                {t('common.error')}
              </Typography>
            </Box>
          </Box>
        ) : !isAuthenticated ? (
          <SecurityModal
            open={true}
            onClose={() => {}}
            onSuccess={() => setIsAuthenticated(true)}
            settings={settings}
            updateSettings={updateSettings}
            mode="auth"
          />
        ) : (
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navigation />

            <Routes>
              <Route
                path="/"
                element={
                  <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Dashboard
                      appData={appData}
                      updateAppData={updateAppData}
                      settings={settings}
                    />
                  </Container>
                }
              />
              <Route
                path="/transactions"
                element={
                  <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Transactions
                      appData={appData}
                      updateAppData={updateAppData}
                      settings={settings}
                    />
                  </Container>
                }
              />
              <Route
                path="/calculator"
                element={
                  <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Calculator
                      appData={appData}
                      updateAppData={updateAppData}
                      settings={settings}
                    />
                  </Container>
                }
              />
              <Route
                path="/payments"
                element={
                  <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Payments
                      appData={appData}
                      updateAppData={updateAppData}
                      settings={settings}
                    />
                  </Container>
                }
              />
              <Route
                path="/planning"
                element={
                  <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Planning
                      appData={appData}
                      updateAppData={updateAppData}
                    />
                  </Container>
                }
              />
              <Route
                path="/settings"
                element={
                  <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Settings
                      settings={settings}
                      updateSettings={updateSettings}
                    />
                  </Container>
                }
              />
              <Route
                path="/help"
                element={
                  <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Help />
                  </Container>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
