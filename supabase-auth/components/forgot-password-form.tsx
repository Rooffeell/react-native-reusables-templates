import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import * as React from 'react';
import { View } from 'react-native';

export function ForgotPasswordForm() {
  const { email: emailParam = '' } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = React.useState(emailParam);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'kollektflow://reset-password',
      });

      if (error) throw error;

      router.push(`/(auth)/reset-password?email=${email}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Forgot password?</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter your email to receive a password reset code
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onChangeText={setEmail}
                onSubmitEditing={onSubmit}
                returnKeyType="send"
                editable={!isLoading}
              />
              {error ? (
                <Text className="text-sm font-medium text-destructive">{error}</Text>
              ) : null}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Sending...' : 'Reset your password'}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
