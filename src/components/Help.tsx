import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AccountBalance as AccountBalanceIcon,
  Calculate as CalculateIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Email as EmailIcon,
  Web as WebIcon
} from '@mui/icons-material';

const Help = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | false>('getting-started');

  const handleChange = (panel: string) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const features = [
    {
      icon: <AccountBalanceIcon />,
      title: t('help.features.transactions.title', 'Gestion des Transactions'),
      description: t('help.features.transactions.description', 'Enregistrez vos revenus et dépenses pour suivre votre situation financière.')
    },
    {
      icon: <CalculateIcon />,
      title: t('help.features.calculator.title', 'Calculateur Ḥuqúqu\'lláh'),
      description: t('help.features.calculator.description', 'Calculez automatiquement votre surplus et le montant dû selon les principes bahá\'ís.')
    },
    {
      icon: <ScheduleIcon />,
      title: t('help.features.planning.title', 'Planification des Paiements'),
      description: t('help.features.planning.description', 'Créez des plans de paiement échelonnés pour organiser vos contributions.')
    },
    {
      icon: <PaymentIcon />,
      title: t('help.features.payments.title', 'Suivi des Paiements'),
      description: t('help.features.payments.description', 'Enregistrez vos paiements effectués et générez des reçus PDF.')
    },
    {
      icon: <SettingsIcon />,
      title: t('help.features.settings.title', 'Paramètres Personnalisés'),
      description: t('help.features.settings.description', 'Configurez la devise, langue, catégories et paramètres de sécurité.')
    }
  ];

  const faqs = [
    {
      question: t('help.faq.surplus.question', 'Qu\'est-ce que le surplus dans le contexte du Ḥuqúqu\'lláh ?'),
      answer: t('help.faq.surplus.answer', 'Le surplus représente la différence entre vos revenus et vos dépenses essentielles. Selon les enseignements bahá\'ís, 19% de ce surplus doit être versé au Ḥuqúqu\'lláh.')
    },
    {
      question: t('help.faq.essential.question', 'Quelles sont les dépenses essentielles ?'),
      answer: t('help.faq.essential.answer', 'Les dépenses essentielles incluent le logement, la nourriture, la santé, l\'éducation et les transports. Vous pouvez personnaliser ces catégories dans les paramètres.')
    },
    {
      question: t('help.faq.gold.question', 'Pourquoi l\'or est-il mentionné dans les paiements ?'),
      answer: t('help.faq.gold.answer', 'Traditionnellement, le Ḥuqúqu\'lláh pouvait être payé en or. L\'application vous permet de suivre les paiements en or physique et de convertir les montants.')
    },
    {
      question: t('help.faq.frequency.question', 'À quelle fréquence dois-je calculer mon Ḥuqúqu\'lláh ?'),
      answer: t('help.faq.frequency.answer', 'Le Ḥuqúqu\'lláh doit être calculé annuellement, mais vous pouvez le faire plus fréquemment si vous le souhaitez. L\'application vous permet de calculer pour différentes périodes.')
    },
    {
      question: t('help.faq.privacy.question', 'Mes données sont-elles sécurisées ?'),
      answer: t('help.faq.privacy.answer', 'Toutes vos données sont stockées localement sur votre appareil. L\'application n\'envoie aucune information sur internet, garantissant votre confidentialité totale.')
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('help.title', 'Aide & Documentation')}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {t('help.subtitle', 'Guide complet pour utiliser Ḥuqúqu\'lláh Assistant')}
      </Typography>

      {/* Getting Started */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('help.gettingStarted', 'Premiers Pas')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('help.gettingStarted.description', 'Ḥuqúqu\'lláh Assistant est un outil conçu pour vous aider à calculer et gérer vos contributions au Ḥuqúqu\'lláh selon les principes bahá\'ís.')}
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('help.gettingStarted.note', 'Commencez par configurer vos paramètres personnels, puis enregistrez vos transactions pour calculer automatiquement votre surplus.')}
        </Alert>
      </Paper>

      {/* Features Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('help.features.title', 'Fonctionnalités Principales')}
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {feature.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Detailed Guide */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('help.guide.title', 'Guide d\'Utilisation Détaillé')}
        </Typography>

        <Accordion expanded={expanded === 'transactions'} onChange={handleChange('transactions')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{t('help.guide.transactions.title', 'Gestion des Transactions')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              {t('help.guide.transactions.description', 'Enregistrez tous vos revenus et dépenses pour maintenir un suivi précis de votre situation financière.')}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t('help.guide.transactions.step1', 'Allez dans l\'onglet "Transactions"')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.transactions.step2', 'Cliquez sur "Ajouter transaction"')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.transactions.step3', 'Remplissez le montant, la description et la catégorie')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.transactions.step4', 'Indiquez si c\'est une dépense essentielle')} />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'calculator'} onChange={handleChange('calculator')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{t('help.guide.calculator.title', 'Utilisation du Calculateur')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              {t('help.guide.calculator.description', 'Le calculateur analyse vos transactions pour déterminer automatiquement le montant dû au Ḥuqúqu\'lláh.')}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t('help.guide.calculator.step1', 'Sélectionnez la période (mois, trimestre, année)')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.calculator.step2', 'Le calculateur analyse automatiquement vos transactions')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.calculator.step3', 'Consultez le surplus et le montant de Ḥuqúqu\'lláh calculé')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.calculator.step4', 'Vérifiez l\'équivalent en or si souhaité')} />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'payments'} onChange={handleChange('payments')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{t('help.guide.payments.title', 'Enregistrement des Paiements')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              {t('help.guide.payments.description', 'Enregistrez vos paiements effectués et générez des reçus officiels.')}
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={t('help.guide.payments.step1', 'Allez dans l\'onglet "Paiements"')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.payments.step2', 'Cliquez sur "Ajouter paiement"')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.payments.step3', 'Sélectionnez la devise (EUR, USD ou Or)')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.payments.step4', 'Choisissez la méthode de paiement')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('help.guide.payments.step5', 'Un reçu PDF est automatiquement généré')} />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* FAQ */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('help.faq.title', 'Questions Fréquemment Posées')}
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Contact Information */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('help.contact.title', 'Contact & Support')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('help.contact.description', 'Pour obtenir de l\'aide supplémentaire ou signaler un problème :')}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">{t('help.contact.email', 'Email')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  stephkalubiaka@gmail.com
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WebIcon sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">{t('help.contact.website', 'Site Web')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  www.huququllah-assistant.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          {t('help.contact.resources', 'Ressources Additionnelles')}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<WebIcon />}
            component="a"
            href="https://www.bahai.org/"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            {t('help.contact.bahaiOrg', 'Site officiel de la Foi bahá\'íe')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<WebIcon />}
            component="a"
            href="https://www.bahai.org/beliefs/huqququllah"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            {t('help.contact.huququllah', 'Informations sur le Ḥuqúqu\'lláh')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<WebIcon />}
            component="a"
            href="https://www.bahai.fr/"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            {t('help.contact.community', 'Communauté bahá\'íe locale')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<WebIcon />}
            component="a"
            href="https://mediatheque.bahai.fr/"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            Médiathèque Bahá'íe
          </Button>
          <Button
            variant="outlined"
            startIcon={<WebIcon />}
            component="a"
            href="https://github.com/stephydlb"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            Mon compte GitHub
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Help;
