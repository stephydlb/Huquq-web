# TODO: Add Representative Feature

## Backend Changes
- [x] Update database schema: add 'role' and 'representative_id' columns to users table
- [x] Create payments table
- [x] Update /register endpoint to accept role
- [x] Add /representatives endpoint to get list of representatives
- [x] Add /set-representative endpoint for clients to choose representative
- [x] Add /submit-payment endpoint
- [x] Add /client-payments endpoint for representatives to view clients' payments
- [x] Add /contact endpoint for sending messages to representatives

## Frontend Changes
- [x] Update Welcome.tsx registration form to include role selection
- [x] Update Settings.tsx to allow clients to select representative
- [ ] Add Contact component for messaging representatives
- [ ] Update App_new.tsx for new routes if needed

## Testing
- [ ] Test backend endpoints
- [ ] Test frontend UI
- [ ] Ensure authentication and authorization
