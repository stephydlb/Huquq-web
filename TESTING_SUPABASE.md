# Manual Testing Instructions for Supabase Integration

This document provides manual test steps to verify the Supabase integration in the Huquq-web application.

## Prerequisites
- The development server is running (`npm run dev`).
- You have access to the Supabase project dashboard to verify data.
- The app is accessible in the browser (e.g., http://localhost:5173).

## Database Setup
Before testing, you need to create the required tables in your Supabase project. Go to the SQL Editor in your Supabase dashboard and run the following SQL:

```sql
-- Create app_data table
CREATE TABLE app_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for app_data
CREATE POLICY "Users can view their own app data" ON app_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own app data" ON app_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own app data" ON app_data FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
```

## Test Areas

### 1. User Authentication
- Verify that users can log in and log out successfully.
- Check that user data is stored in localStorage after login.
- Confirm that the app shows the correct UI based on authentication state.

### 2. Client Management (RepresentativeDashboard)
- Navigate to the Representative Dashboard page (e.g., `/representative-dashboard`).
- Verify that the list of clients assigned to the current representative loads correctly.
- Add a new client using the "Add New Client" button:
  - Fill in Name, Email, and Password fields.
  - Submit and verify the client appears in the list.
  - Check for error messages on duplicate clients or missing fields.
- Select a client and verify that the Payments tab loads payment data.
- Check that Transactions and Planning tabs show placeholder messages.

### 3. Payments Data
- Verify that payment data for clients is fetched and displayed correctly.
- Confirm that payment details such as amount, description, date, and status are shown.

### 4. Error Handling
- Test error scenarios such as network failure or invalid data.
- Confirm that error messages appear as snackbars and are user-friendly.

### 5. Navigation and Routing
- Verify that navigation links work correctly and route to the expected pages.
- Confirm that the logo displays correctly in the navigation bar.

## Additional Notes
- Check browser console for any runtime errors or warnings.
- Verify that environment variables for Supabase URL and Anon Key are set correctly.

---

Please follow these steps and report any issues or unexpected behavior. If you want, I can also help you write automated test scripts for these features.
