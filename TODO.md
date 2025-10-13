# TODO: Simplify Huquq Web App - Remove Backend and Auth

## Overview
Remove all Supabase backend functionality, user authentication, and account creation. Make the app a simple client-side application that can be deployed and used by anyone without authentication.

## Tasks
- [ ] Remove Supabase dependencies from package.json
- [ ] Delete Supabase-related files (supabaseClient.ts, SupabaseService.ts, AuthService.ts, AppDataService.ts, PaymentService.ts)
- [ ] Modify StorageService to use localStorage only (no Supabase)
- [ ] Update App_new.tsx to remove authentication logic and load data locally
- [ ] Update Welcome.tsx to remove auth forms and make it a simple landing page
- [ ] Remove RepresentativeDashboard from routes and components
- [ ] Update components to not require user data
- [ ] Remove supabase folder
- [ ] Update imports and dependencies
- [ ] Test the simplified app
