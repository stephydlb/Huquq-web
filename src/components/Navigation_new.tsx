import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Receipt,
  Calculator,
  CreditCard,
  Calendar,
  Settings,
  HelpCircle,
  Menu,
  X,
  Coins
} from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { path: '/transactions', icon: Receipt, label: t('nav.transactions') },
    { path: '/calculator', icon: Calculator, label: t('nav.calculator') },
    { path: '/payments', icon: CreditCard, label: t('nav.payments') },
    { path: '/planning', icon: Calendar, label: t('nav.planning') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
    { path: '/help', icon: HelpCircle, label: t('nav.help') },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div className="text-white">
              <span className="font-bold text-xl block leading-tight">
                Ḥuqúqu’lláh
              </span>
              <span className="text-blue-100 text-sm font-medium">
                Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white text-blue-700 shadow-lg transform scale-105'
                      : 'text-blue-100 hover:text-white hover:bg-white/10 hover:shadow-md'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-500/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-white text-blue-700 shadow-lg'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
