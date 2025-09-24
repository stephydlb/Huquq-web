import { useTranslation } from 'react-i18next';
import type { AppData, UserSettings } from '../types';

interface SettingsProps {
  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  appData: AppData;
}

const Settings = ({ settings, updateSettings, appData }: SettingsProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Settings component - Coming soon</p>
      </div>
    </div>
  );
};

export default Settings;
