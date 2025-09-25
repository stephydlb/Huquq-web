# Configuration Google Drive Backup

## Prérequis
- Un compte Google
- Accès à Google Cloud Console

## Étapes de Configuration

### 1. Créer un Projet Google Cloud
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur "Select a project" > "New Project"
3. Nommez votre projet (ex: "Huquq Backup")
4. Cliquez "Create"

### 2. Activer l'API Google Drive
1. Dans le menu de gauche, allez dans "APIs & Services" > "Library"
2. Recherchez "Google Drive API"
3. Cliquez dessus et "Enable"

### 3. Créer les Identifiants OAuth
1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choisissez "Web application"
4. Nom : "Huquq Web App"
5. **Authorized JavaScript origins** :
   - Ajoutez : `http://localhost:5174` (pour développement)
   - Ajoutez : `https://votredomaine.com` (pour production)
6. **Authorized redirect URIs** :
   - Ajoutez : `http://localhost:5174` (pour développement)
   - Ajoutez : `https://votredomaine.com` (pour production)
7. Cliquez "Create"
8. **Copiez le Client ID** (format : `123456789-abc.apps.googleusercontent.com`)

### 4. Créer une API Key
1. Cliquez "Create Credentials" > "API Key"
2. Copiez la clé API (format : `AIzaSy...`)
3. (Optionnel) Restreignez l'API key à Google Drive API uniquement

### 5. Configurer l'Application
1. Ouvrez `src/services/GoogleDriveService.ts`
2. Remplacez :
   ```typescript
   static CLIENT_ID = 'VOTRE_CLIENT_ID_ICI';
   static API_KEY = 'VOTRE_API_KEY_ICI';
   ```

### 6. Tester la Fonctionnalité
1. Lancez l'application : `npm run dev`
2. Allez dans Paramètres > Sauvegarde et Restauration
3. Cliquez "Sauvegarder sur Google Drive"
4. Autorisez l'accès Google (première fois)
5. Vérifiez dans votre Google Drive (dossier "App Data") qu'un fichier `huquq-backup-YYYY-MM-DD.json` a été créé

## Sécurité
- Les données sont **chiffrées** avant l'upload
- L'accès est limité aux fichiers spécifiques à l'application (`drive.file` scope)
- Utilisez des credentials de test pour le développement

## Dépannage
- **Erreur 502** : Vérifiez que l'API Drive est activée et les credentials sont corrects
- **CSP violations** : La politique de sécurité est configurée dans `index.html`
- **Connexion refusée** : Vérifiez les origines autorisées dans Google Cloud Console

## Production
Pour la production, assurez-vous de :
- Remplacer localhost par votre domaine dans les origines autorisées
- Utiliser des variables d'environnement pour les credentials
- Configurer HTTPS obligatoire pour OAuth
