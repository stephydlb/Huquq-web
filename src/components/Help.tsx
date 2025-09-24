import { useTranslation } from 'react-i18next';

const Help = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('help.title')}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Help component - Coming soon</p>
      </div>
    </div>
  );
};

export default Help;
