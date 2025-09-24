import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Coins,
  Plus,
  ArrowRight
} from 'lucide-react';
import type { AppData, UserSettings, SurplusCalculation } from '../types';
import { CalculationService } from '../services/CalculationService';
import { GoldPriceService } from '../services/GoldPriceService';

interface DashboardProps {
  appData: AppData;
  updateAppData: (data: AppData) => void;
  settings: UserSettings;
}

const Dashboard = ({ appData, updateAppData, settings }: DashboardProps) => {
  const { t } = useTranslation();
  const [currentPeriod, setCurrentPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [calculation, setCalculation] = useState<SurplusCalculation | null>(null);
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Calculate surplus for current period
      const period = CalculationService.getCurrentPeriod(currentPeriod);
      const newCalculation = CalculationService.calculateSurplus(
        appData.transactions,
        period.start,
        period.end,
        settings.essentialCategories
      );

      // Update remaining amount based on payments
      const updatedCalculation = CalculationService.updateRemainingAmount(
        newCalculation,
        appData.payments
      );

      setCalculation(updatedCalculation);

      // Load gold price
      try {
        const priceData = await GoldPriceService.fetchGoldPrice(settings.currency);
        if (priceData) {
          setGoldPrice(priceData.price);
        }
      } catch (error) {
        console.error('Failed to load gold price:', error);
      }

      setIsLoading(false);
    };

    loadData();
  }, [appData.transactions, appData.payments, settings, currentPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  const getRecentTransactions = () => {
    return appData.transactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  };

  const getNextPayment = () => {
    const nextPlan = appData.paymentPlans.find(plan => !plan.completed);
    if (!nextPlan || nextPlan.payments.length === 0) return null;

    const nextPayment = nextPlan.payments
      .filter(p => p.date > new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

    return nextPayment;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentTransactions = getRecentTransactions();
  const nextPayment = getNextPayment();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-1">{t('dashboard.welcome')}</p>
        </div>
        <div className="flex space-x-2">
          {(['month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setCurrentPeriod(period)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPeriod === period
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`calculator.current${period.charAt(0).toUpperCase() + period.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.surplus')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {calculation ? formatCurrency(calculation.surplus) : '0,00 €'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.huquq')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {calculation ? formatCurrency(calculation.huquqAmount) : '0,00 €'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.remaining')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {calculation ? formatCurrency(calculation.remainingAmount) : '0,00 €'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.goldPrice')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {goldPrice ? `${goldPrice.toFixed(2)} €/g` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Plus className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Ajouter une transaction</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Plus className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Enregistrer un paiement</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Plus className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Créer un plan de paiement</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('dashboard.recentTransactions')}
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Voir tout
            </button>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.date.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {t('dashboard.noTransactions')}
            </p>
          )}
        </div>

        {/* Next Payment */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('dashboard.nextPayment')}
            </h2>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          {nextPayment ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant:</span>
                <span className="font-medium">{formatCurrency(nextPayment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {nextPayment.date.toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Méthode:</span>
                <span className="font-medium">
                  {nextPayment.method === 'cash' ? 'Espèces' :
                   nextPayment.method === 'bank' ? 'Virement' : 'Or'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucun paiement prévu
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
