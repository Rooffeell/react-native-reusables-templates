import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { Link } from 'expo-router';
import * as React from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

export function SignInForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function onSubmit() {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Navigate to your app's main screen after successful login
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Sign in to Kollekt Flow</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter your email and password to log in
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />
            </View>

            <View className="gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                secureTextEntry
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>

            {error ? (
              <Text className="text-sm font-medium text-destructive">{error}</Text>
            ) : null}

            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Signing in...' : 'Continue'}</Text>
            </Button>
          </View>

          <Text className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/(auth)/sign-up" className="text-sm underline underline-offset-4">
              Sign up
            </Link>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
