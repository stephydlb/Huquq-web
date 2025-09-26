import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
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

function App() {
  const { t } = useTranslation();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!appData || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{t('common.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navigation />

        <main className="container mx-auto px-4 py-8">
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
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    settings={settings}
                    updateSettings={updateSettings}
                  />
                }
              />
            <Route
              path="/help"
              element={<Help />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {showSecurityModal && (
          <SecurityModal
            open={showSecurityModal}
            settings={settings}
            updateSettings={updateSettings}
            onClose={() => setShowSecurityModal(false)}
            onSuccess={() => setShowSecurityModal(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
