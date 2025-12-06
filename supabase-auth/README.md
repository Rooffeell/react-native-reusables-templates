

# Supabase Auth - React Native Reusables

## Description

This is a React Native project built with Expo, Supabase Auth, and React Native Reusables. It provides a complete authentication flow with email verification.

## Getting Started

### 1. Create a Supabase Project

Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a new project.

### 2. Configure Email Auth

In your Supabase dashboard:
- Go to Authentication → Providers → Email
- Enable Email sign-in, sign-up, and email verification
- Turn on "Confirm email" to require email verification

### 3. Configure Email Template

Go to Authentication → Templates → Confirm Signup and use this template:

```html
<h2>Confirm your signup</h2>
<p>Use this code to verify your email:</p>
<p>This is your code: {{ .Token }}</p>
```

### 4. Set Up Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

### 5. Run the App

```bash
npm run dev
```

## Features

- Email and password authentication
- Email verification with OTP codes
- User profile management
- Protected routes
- Cross-platform support (iOS, Android, Web)

## Learn More

- [Supabase Documentation](https://supabase.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs)
