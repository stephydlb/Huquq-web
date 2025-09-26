import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  Paper,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Lock as LockIcon,
  Fingerprint as FingerprintIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import type { UserSettings } from '../types';

interface SecurityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  mode?: 'auth' | 'settings';
}

const SecurityModal = ({ open, onClose, onSuccess, settings, updateSettings, mode = 'auth' }: SecurityModalProps) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [settingsMode] = useState(mode === 'settings');
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    // Check for biometric support
    if (window.PublicKeyCredential) {
      navigator.credentials.get({ publicKey: { challenge: new Uint8Array(32) } } as any)
        .then(() => setBiometricSupported(true))
        .catch(() => setBiometricSupported(false));
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (settingsMode) {
      // Settings mode - setting up/changing PIN
      if (settings.security.pinEnabled) {
        // Changing existing PIN
        if (currentPin !== settings.security.pin) {
          setError(t('security.currentPinIncorrect', 'Code PIN actuel incorrect'));
          return;
        }
      }

      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        setError(t('security.pinInvalid', 'Le code PIN doit contenir 4 chiffres'));
        return;
      }

      if (pin !== confirmPin) {
        setError(t('security.pinMismatch', 'Les codes PIN ne correspondent pas'));
        return;
      }

      updateSettings({
        ...settings,
        security: {
          ...settings.security,
          pinEnabled: true,
          pin: pin
        }
      });

      setSnackbar({
        open: true,
        message: t('security.pinUpdated', 'Code PIN mis à jour avec succès'),
        severity: 'success'
      });

      setPin('');
      setConfirmPin('');
      setCurrentPin('');
      setError('');
    } else {
      // Auth mode - verifying PIN
      if (pin === settings.security.pin) {
        onSuccess();
        setPin('');
        setError('');
      } else {
        setError(t('security.pinIncorrect', 'Code PIN incorrect'));
      }
    }
  };

  const handleBiometricAuth = async () => {
    try {
      // Simulate biometric authentication
      // In a real implementation, this would use WebAuthn API
      setTimeout(() => {
        onSuccess();
        setSnackbar({
          open: true,
          message: t('security.biometricSuccess', 'Authentification biométrique réussie'),
          severity: 'success'
        });
      }, 1000);
    } catch (error) {
      setError(t('security.biometricFailed', 'Échec de l\'authentification biométrique'));
    }
  };

  const handleSecuritySettingChange = (setting: keyof UserSettings['security'], value: boolean) => {
    updateSettings({
      ...settings,
      security: {
        ...settings.security,
        [setting]: value
      }
    });

    setSnackbar({
      open: true,
      message: t('security.settingsUpdated', 'Paramètres de sécurité mis à jour'),
      severity: 'success'
    });
  };

  const handleDisablePin = () => {
    updateSettings({
      ...settings,
      security: {
        ...settings.security,
        pinEnabled: false,
        pin: ''
      }
    });

    setSnackbar({
      open: true,
      message: t('security.pinDisabled', 'Code PIN désactivé'),
      severity: 'success'
    });
  };

  const renderAuthMode = () => (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LockIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {t('security.authRequired', 'Authentification requise')}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t('security.enterPin', 'Entrez votre code PIN pour continuer')}
        </Typography>

        <Box component="form" onSubmit={handlePinSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            type="password"
            label={t('security.pin', 'Code PIN')}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="0000"
            inputProps={{ maxLength: 4 }}
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />

          {settings.security.biometricEnabled && biometricSupported && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('security.orUseBiometric', 'Ou utilisez l\'authentification biométrique')}
              </Typography>
              <IconButton
                onClick={handleBiometricAuth}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  p: 2
                }}
              >
                <FingerprintIcon fontSize="large" />
              </IconButton>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {t('common.cancel', 'Annuler')}
        </Button>
        <Button onClick={handlePinSubmit} variant="contained">
          {t('security.verify', 'Vérifier')}
        </Button>
      </DialogActions>
    </>
  );

  const renderSettingsMode = () => (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {t('security.settings', 'Paramètres de sécurité')}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* PIN Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('security.pinSettings', 'Paramètres du code PIN')}
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.pinEnabled}
                    onChange={(e) => handleSecuritySettingChange('pinEnabled', e.target.checked)}
                  />
                }
                label={t('security.enablePin', 'Activer le code PIN')}
              />

              {settings.security.pinEnabled && (
                <Box sx={{ mt: 2 }}>
                  {settings.security.pin && (
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        type="password"
                        label={t('security.currentPin', 'Code PIN actuel')}
                        value={currentPin}
                        onChange={(e) => setCurrentPin(e.target.value)}
                        inputProps={{ maxLength: 4 }}
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    type="password"
                    label={settings.security.pin ? t('security.newPin', 'Nouveau code PIN') : t('security.pin', 'Code PIN')}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="0000"
                    inputProps={{ maxLength: 4 }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    type="password"
                    label={t('security.confirmPin', 'Confirmer le code PIN')}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="0000"
                    inputProps={{ maxLength: 4 }}
                    sx={{ mb: 2 }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handlePinSubmit}
                      startIcon={<CheckCircleIcon />}
                    >
                      {settings.security.pin ? t('security.updatePin', 'Mettre à jour') : t('security.setPin', 'Définir')}
                    </Button>

                    {settings.security.pin && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDisablePin}
                        startIcon={<CancelIcon />}
                      >
                        {t('security.disablePin', 'Désactiver')}
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Biometric Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('security.biometricSettings', 'Authentification biométrique')}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <FingerprintIcon color={biometricSupported ? 'primary' : 'disabled'} />
                <Box>
                  <Typography variant="body1">
                    {t('security.biometricAuth', 'Authentification biométrique')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {biometricSupported
                      ? t('security.biometricSupported', 'Empreinte digitale ou reconnaissance faciale')
                      : t('security.biometricNotSupported', 'Non supporté sur cet appareil')
                    }
                  </Typography>
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.biometricEnabled}
                    onChange={(e) => handleSecuritySettingChange('biometricEnabled', e.target.checked)}
                    disabled={!biometricSupported}
                  />
                }
                label={t('security.enableBiometric', 'Activer l\'authentification biométrique')}
              />
            </Paper>
          </Grid>

          {/* Security Status */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('security.status', 'État de la sécurité')}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={settings.security.pinEnabled ? <CheckCircleIcon /> : <CancelIcon />}
                  label={settings.security.pinEnabled ? t('security.pinEnabled', 'PIN activé') : t('security.pinDisabled', 'PIN désactivé')}
                  color={settings.security.pinEnabled ? 'success' : 'default'}
                />

                <Chip
                  icon={settings.security.biometricEnabled && biometricSupported ? <CheckCircleIcon /> : <CancelIcon />}
                  label={
                    settings.security.biometricEnabled && biometricSupported
                      ? t('security.biometricEnabled', 'Biométrie activée')
                      : t('security.biometricDisabled', 'Biométrie désactivée')
                  }
                  color={settings.security.biometricEnabled && biometricSupported ? 'success' : 'default'}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {t('common.close', 'Fermer')}
        </Button>
      </DialogActions>
    </>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        {settingsMode ? renderSettingsMode() : renderAuthMode()}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SecurityModal;
