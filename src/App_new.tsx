import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { StorageService } from './services/StorageService';
import type { AppData, UserSettings } from './types';

// Lazy loaded components
const Dashboard = lazy(() => import('./components/Dashboard_new'));
const Transactions = lazy(() => import('./components/Transactions'));
const Calculator = lazy(() => import('./components/Calculator'));
const Payments = lazy(() => import('./components/Payments'));
const Planning = lazy(() => import('./components/Planning'));
const Settings = lazy(() => import('./components/Settings'));
const Help = lazy(() => import('./components/Help'));
const Navigation = lazy(() => import('./components/Navigation_new').then(module => ({ default: module.default })));

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

  useEffect(() => {
    // Load data from localStorage
    const loadData = () => {
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
    };

    loadData();
  }, []);

  const updateAppData = useCallback((newData: AppData) => {
    setAppData(newData);
    StorageService.saveAppData(newData);
  }, []);

  const updateSettings = useCallback((newSettings: UserSettings) => {
    setSettings(newSettings);
    StorageService.saveUserSettings(newSettings);

    if (appData) {
      const updatedData = { ...appData, settings: newSettings };
      updateAppData(updatedData);
    }
  }, [appData, updateAppData]);

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
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {t('common.loading')}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Suspense fallback={
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
          }>
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
          </Suspense>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
