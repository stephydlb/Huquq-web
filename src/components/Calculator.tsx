import { useTranslation } from 'react-i18next';
import type { AppData, UserSettings } from '../types';

interface CalculatorProps {
  appData: AppData;
  updateAppData: (data: AppData) => void;
  settings: UserSettings;
}

const Calculator = ({ appData, updateAppData, settings }: CalculatorProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('calculator.title')}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Calculator component - Coming soon</p>
      </div>
    </div>
  );
};

export default Calculator;
