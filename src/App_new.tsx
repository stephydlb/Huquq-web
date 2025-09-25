import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { StorageService } from './services/StorageService';
import type { AppData, UserSettings } from './types';

// Components
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
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  useEffect(() => {
    // Load data from storage
    const loadedAppData = StorageService.loadAppData();
    const loadedSettings = StorageService.loadUserSettings();

    if (loadedAppData) {
      setAppData(loadedAppData);
    } else {
      // Initialize with default data
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
      StorageService.saveAppData(defaultData);
    }

    if (loadedSettings) {
      setSettings(loadedSettings);
    } else if (loadedAppData?.settings) {
      setSettings(loadedAppData.settings);
    }

    setIsLoading(false);

    // Check if authentication is required
    const finalSettings = loadedSettings || loadedAppData?.settings;
    if (finalSettings?.security.pinEnabled) {
      setShowSecurityModal(true);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const updateAppData = (newData: AppData) => {
    setAppData(newData);
    StorageService.saveAppData(newData);
  };

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    StorageService.saveUserSettings(newSettings);

    if (appData) {
      const updatedData = { ...appData, settings: newSettings };
      updateAppData(updatedData);
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
      </ThemeProvider>
    );
  }

  if (!appData || !settings) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SecurityModal
          open={true}
          onClose={() => {}}
          onSuccess={() => setIsAuthenticated(true)}
          settings={settings}
          updateSettings={updateSettings}
          mode="auth"
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Navigation />

          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    appData={appData}
                    updateAppData={updateAppData}
                    settings={settings}
                  />
                }
              />
              <Route
                path="/transactions"
                element={
                  <Transactions
                    appData={appData}
                    updateAppData={updateAppData}
                    settings={settings}
                  />
                }
              />
              <Route
                path="/calculator"
                element={
                  <Calculator
                    appData={appData}
                    updateAppData={updateAppData}
                    settings={settings}
                  />
                }
              />
              <Route
                path="/payments"
                element={
                  <Payments
                    appData={appData}
                    updateAppData={updateAppData}
                    settings={settings}
                  />
                }
              />
              <Route
                path="/planning"
                element={
                  <Planning
                    appData={appData}
                    updateAppData={updateAppData}
                    settings={settings}
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    settings={settings}
                    updateSettings={updateSettings}
                    appData={appData}
                  />
                }
              />
              <Route
                path="/help"
                element={<Help />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
