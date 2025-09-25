import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Chip,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { AppData, UserSettings } from '../types';

interface SettingsProps {
  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  appData: AppData;
}

const Settings = ({ settings, updateSettings, appData }: SettingsProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [newCategory, setNewCategory] = useState('');

  const handleInputChange = (field: keyof UserSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (path: string[], value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const handleSave = () => {
    updateSettings(formData);
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.essentialCategories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        essentialCategories: [...prev.essentialCategories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      essentialCategories: prev.essentialCategories.filter(c => c !== category)
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('settings.title', 'Paramètres')}
      </Typography>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('settings.general', 'Général')}
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('settings.language', 'Langue')}</InputLabel>
              <Select
                value={formData.language}
                label={t('settings.language', 'Langue')}
                onChange={(e) => handleInputChange('language', e.target.value)}
              >
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('settings.currency', 'Devise')}</InputLabel>
              <Select
                value={formData.currency}
                label={t('settings.currency', 'Devise')}
                onChange={(e) => handleInputChange('currency', e.target.value)}
              >
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('settings.goldUnit', 'Unité or')}</InputLabel>
              <Select
                value={formData.goldUnit}
                label={t('settings.goldUnit', 'Unité or')}
                onChange={(e) => handleInputChange('goldUnit', e.target.value)}
              >
                <MenuItem value="mithqal">Mithqāl</MenuItem>
                <MenuItem value="gram">Gramme</MenuItem>
                <MenuItem value="tola">Tola</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={t('settings.mithqalToGram', 'Conversion mithqāl vers gramme')}
              type="number"
              value={formData.mithqalToGram}
              onChange={(e) => handleInputChange('mithqalToGram', parseFloat(e.target.value))}
              inputProps={{ step: 0.01 }}
            />
          </Paper>
        </Grid>

        {/* Essential Categories */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('settings.essentialCategories', 'Catégories essentielles')}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label={t('settings.addCategory', 'Ajouter une catégorie')}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={addCategory} disabled={!newCategory.trim()}>
                      <AddIcon />
                    </IconButton>
                  )
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.essentialCategories.map(category => (
                <Chip
                  key={category}
                  label={category}
                  onDelete={() => removeCategory(category)}
                  deleteIcon={<DeleteIcon />}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('settings.notifications', 'Notifications')}
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications.enabled}
                  onChange={(e) => handleNestedChange(['notifications', 'enabled'], e.target.checked)}
                />
              }
              label={t('settings.notificationsEnabled', 'Notifications activées')}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications.paymentReminders}
                  onChange={(e) => handleNestedChange(['notifications', 'paymentReminders'], e.target.checked)}
                  disabled={!formData.notifications.enabled}
                />
              }
              label={t('settings.paymentReminders', 'Rappels de paiement')}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications.goldPriceAlerts}
                  onChange={(e) => handleNestedChange(['notifications', 'goldPriceAlerts'], e.target.checked)}
                  disabled={!formData.notifications.enabled}
                />
              }
              label={t('settings.goldPriceAlerts', 'Alertes prix or')}
              sx={{ mb: 2 }}
            />

            {formData.notifications.goldPriceAlerts && (
              <TextField
                fullWidth
                label={t('settings.goldPriceThreshold', 'Seuil alerte prix or (€/g)')}
                type="number"
                value={formData.notifications.goldPriceThreshold || ''}
                onChange={(e) => handleNestedChange(['notifications', 'goldPriceThreshold'], parseFloat(e.target.value) || undefined)}
                inputProps={{ step: 0.01 }}
              />
            )}
          </Paper>
        </Grid>

        {/* Security */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('settings.security', 'Sécurité')}
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.security.pinEnabled}
                  onChange={(e) => handleNestedChange(['security', 'pinEnabled'], e.target.checked)}
                />
              }
              label={t('settings.pinEnabled', 'Code PIN activé')}
              sx={{ mb: 2 }}
            />

            {formData.security.pinEnabled && (
              <TextField
                fullWidth
                label={t('settings.pin', 'Code PIN')}
                type="password"
                value={formData.security.pin || ''}
                onChange={(e) => handleNestedChange(['security', 'pin'], e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={formData.security.biometricEnabled}
                  onChange={(e) => handleNestedChange(['security', 'biometricEnabled'], e.target.checked)}
                />
              }
              label={t('settings.biometricEnabled', 'Biométrie activée')}
            />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSave}>
          {t('settings.save', 'Enregistrer')}
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
