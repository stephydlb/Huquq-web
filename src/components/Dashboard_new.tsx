import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Coins,
  Plus,
  ArrowRight,
  Target,
  PiggyBank,
  CreditCard
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
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('dashboard.welcome')}
        </p>
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
            {(['month', 'quarter', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setCurrentPeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPeriod === period
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t(`calculator.current${period.charAt(0).toUpperCase() + period.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-emerald-200 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700 mb-1">{t('dashboard.surplus')}</p>
              <p className="text-3xl font-bold text-emerald-900">
                {calculation ? formatCurrency(calculation.surplus) : '0,00 €'}
              </p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-full">
              <TrendingUp className="h-6 w-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">{t('dashboard.huquq')}</p>
              <p className="text-3xl font-bold text-blue-900">
                {calculation ? formatCurrency(calculation.huquqAmount) : '0,00 €'}
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <Target className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-lg border border-amber-200 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700 mb-1">{t('dashboard.remaining')}</p>
              <p className="text-3xl font-bold text-amber-900">
                {calculation ? formatCurrency(calculation.remainingAmount) : '0,00 €'}
              </p>
            </div>
            <div className="p-3 bg-amber-200 rounded-full">
              <PiggyBank className="h-6 w-6 text-amber-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 mb-1">{t('dashboard.goldPrice')}</p>
              <p className="text-3xl font-bold text-yellow-900">
                {goldPrice ? `${goldPrice.toFixed(2)} €/g` : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-full">
              <Coins className="h-6 w-6 text-yellow-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:shadow-md">
            <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-gray-700 font-medium group-hover:text-blue-700">Ajouter une transaction</span>
          </button>
          <button className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 hover:shadow-md">
            <div className="p-4 bg-emerald-100 rounded-full mb-4 group-hover:bg-emerald-200 transition-colors">
              <CreditCard className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-gray-700 font-medium group-hover:text-emerald-700">Enregistrer un paiement</span>
          </button>
          <button className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 hover:shadow-md">
            <div className="p-4 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-gray-700 font-medium group-hover:text-purple-700">Créer un plan de paiement</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('dashboard.recentTransactions')}
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center hover:underline">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
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
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                {t('dashboard.noTransactions')}
              </p>
            </div>
          )}
        </div>

        {/* Next Payment */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('dashboard.nextPayment')}
            </h2>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          {nextPayment ? (
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-gray-700 font-medium">Montant:</span>
                <span className="font-bold text-blue-900 text-lg">{formatCurrency(nextPayment.amount)}</span>
              </div>
              <div className="flex justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-gray-700 font-medium">Date:</span>
                <span className="font-bold text-blue-900">
                  {nextPayment.date.toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-gray-700 font-medium">Méthode:</span>
                <span className="font-bold text-blue-900">
                  {nextPayment.method === 'cash' ? 'Espèces' :
                   nextPayment.method === 'bank' ? 'Virement' : 'Or'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                Aucun paiement prévu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
