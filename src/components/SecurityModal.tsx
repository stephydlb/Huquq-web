import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Lock } from 'lucide-react';

interface SecurityModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SecurityModal = ({ onClose, onSuccess }: SecurityModalProps) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, accept any 4-digit PIN
    if (pin.length === 4 && /^\d{4}$/.test(pin)) {
      onSuccess();
    } else {
      setError('Veuillez entrer un code PIN valide (4 chiffres)');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Authentification requise</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="0000"
              maxLength={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityModal;
