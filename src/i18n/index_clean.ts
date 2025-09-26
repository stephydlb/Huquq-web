import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      // Navigation
      'nav.dashboard': 'Tableau de bord',
      'nav.transactions': 'Transactions',
      'nav.calculator': 'Calculateur',
      'nav.payments': 'Paiements',
      'nav.planning': 'Planification',
      'nav.settings': 'Paramètres',
      'nav.help': 'Aide',

      // Dashboard
      'dashboard.title': 'Tableau de bord',
      'dashboard.welcome': 'Bienvenue dans Ḥuqúqu’lláh Assistant',
      'dashboard.surplus': 'Surplus actuel',
      'dashboard.huquq': 'Ḥuqúqu’lláh dû',
      'dashboard.remaining': 'Montant restant',
      'dashboard.nextPayment': 'Prochain paiement',
      'dashboard.goldPrice': 'Prix de l\'or actuel',
      'dashboard.recentTransactions': 'Transactions récentes',
      'dashboard.noTransactions': 'Aucune transaction récente',

      // Transactions
      'transactions.title': 'Transactions',
      'transactions.addIncome': 'Ajouter un revenu',
      'transactions.addExpense': 'Ajouter une dépense',
      'transactions.income': 'Revenus',
      'transactions.expenses': 'Dépenses',
      'transactions.all': 'Toutes',
      'transactions.essential': 'Essentielles',
      'transactions.nonEssential': 'Non-essentielles',
      'transactions.date': 'Date',
      'transactions.description': 'Description',
      'transactions.category': 'Catégorie',
      'transactions.amount': 'Montant',
      'transactions.actions': 'Actions',
      'transactions.edit': 'Modifier',
      'transactions.delete': 'Supprimer',
      'transactions.save': 'Enregistrer',
      'transactions.cancel': 'Annuler',

      // Calculator
      'calculator.title': 'Calculateur Ḥuqúqu’lláh',
      'calculator.period': 'Période',
      'calculator.currentMonth': 'Mois actuel',
      'calculator.currentQuarter': 'Trimestre actuel',
      'calculator.currentYear': 'Année actuelle',
      'calculator.customPeriod': 'Période personnalisée',
      'calculator.startDate': 'Date de début',
      'calculator.endDate': 'Date de fin',
      'calculator.calculate': 'Calculer',
      'calculator.results': 'Résultats',
      'calculator.totalIncome': 'Revenus totaux',
      'calculator.totalExpenses': 'Dépenses totales',
      'calculator.essentialExpenses': 'Dépenses essentielles',
      'calculator.surplus': 'Surplus',
      'calculator.huquqAmount': 'Ḥuqúqu’lláh (19%)',
      'calculator.remainingAmount': 'Montant restant',
      'calculator.goldEquivalent': 'Équivalent en or',
      'calculator.mithqal': 'mithqāl',

      // Payments
      'payments.title': 'Paiements',
      'payments.addPayment': 'Ajouter un paiement',
      'payments.paymentHistory': 'Historique des paiements',
      'payments.amount': 'Montant',
      'payments.currency': 'Devise',
      'payments.method': 'Méthode',
      'payments.date': 'Date',
      'payments.note': 'Note',
      'payments.receipt': 'Reçu',
      'payments.downloadReceipt': 'Télécharger le reçu',
      'payments.totalPaid': 'Total payé',
      'payments.remaining': 'Restant',

      // Planning
      'planning.title': 'Planification des paiements',
      'planning.createPlan': 'Créer un plan',
      'planning.existingPlans': 'Plans existants',
      'planning.totalAmount': 'Montant total',
      'planning.frequency': 'Fréquence',
      'planning.monthly': 'Mensuel',
      'planning.quarterly': 'Trimestriel',
      'planning.yearly': 'Annuel',
      'planning.numberOfPayments': 'Nombre de paiements',
      'planning.startDate': 'Date de début',
      'planning.installmentAmount': 'Montant par versement',
      'planning.nextPayment': 'Prochain paiement',
      'planning.completed': 'Terminé',
      'planning.inProgress': 'En cours',

      // Settings
      'settings.title': 'Paramètres',
      'settings.language': 'Langue',
      'settings.currency': 'Devise',
      'settings.goldUnit': 'Unité d\'or',
      'settings.mithqalConversion': 'Conversion mithqāl/gramme',
      'settings.essentialCategories': 'Catégories essentielles',
      'settings.notifications': 'Notifications',
      'settings.security': 'Sécurité',
      'settings.enablePin': 'Activer le code PIN',
      'settings.changePin': 'Changer le code PIN',
      'settings.enableBiometric': 'Activer la biométrie',
      'settings.dataManagement': 'Gestion des données',
      'settings.exportData': 'Exporter les données',
      'settings.importData': 'Importer les données',
      'settings.clearData': 'Effacer toutes les données',
      'settings.reset': 'Réinitialiser',

      // Common
      'common.yes': 'Oui',
      'common.no': 'Non',
      'common.ok': 'OK',
      'common.cancel': 'Annuler',
      'common.save': 'Enregistrer',
      'common.delete': 'Supprimer',
      'common.edit': 'Modifier',
      'common.add': 'Ajouter',
      'common.remove': 'Supprimer',
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.warning': 'Attention',
      'common.info': 'Information',

      // Messages
      'message.confirmDelete': 'Êtes-vous sûr de vouloir supprimer cet élément ?',
      'message.dataCleared': 'Toutes les données ont été effacées',
      'message.dataExported': 'Données exportées avec succès',
      'message.dataImported': 'Données importées avec succès',
      'message.settingsSaved': 'Paramètres enregistrés',
      'message.paymentAdded': 'Paiement ajouté avec succès',
      'message.transactionAdded': 'Transaction ajoutée avec succès',
      'message.planCreated': 'Plan de paiement créé avec succès',

      // Help
      'help.title': 'Aide et documentation',
      'help.about': 'À propos',
      'help.aboutText': 'Ḥuqúqu’lláh Assistant est une application conçue pour aider les bahá\'ís à calculer et gérer leurs obligations Ḥuqúqu’lláh de manière simple et sécurisée.',
      'help.howToUse': 'Comment utiliser',
      'help.faq': 'FAQ',
      'help.contact': 'Contact',
      'help.disclaimer': 'Avis de non-responsabilité',
      'help.disclaimerText': 'Cette application est un outil d\'aide et ne remplace pas les conseils d\'un expert financier ou d\'une autorité religieuse bahá\'íe.'
    }
  },
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.calculator': 'Calculator',
      'nav.payments': 'Payments',
      'nav.planning': 'Planning',
      'nav.settings': 'Settings',
      'nav.help': 'Help',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.welcome': 'Welcome to Ḥuqúqu’lláh Assistant',
      'dashboard.surplus': 'Current Surplus',
      'dashboard.huquq': 'Ḥuqúqu’lláh Due',
      'dashboard.remaining': 'Remaining Amount',
      'dashboard.nextPayment': 'Next Payment',
      'dashboard.goldPrice': 'Current Gold Price',
      'dashboard.recentTransactions': 'Recent Transactions',
      'dashboard.noTransactions': 'No recent transactions',

      // Common
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.ok': 'OK',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.add': 'Add',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.warning': 'Warning',
      'common.info': 'Information'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
