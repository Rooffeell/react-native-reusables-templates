import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { TextInput, View } from 'react-native';

export function ResetPasswordForm() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const codeInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState({ code: '', password: '' });
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit() {
    if (!password) {
      setError({ code: '', password: 'Password is required' });
      return;
    }

    if (!code) {
      setError({ code: 'Verification code is required', password: '' });
      return;
    }

    setIsLoading(true);
    setError({ code: '', password: '' });

    try {
      // First verify the OTP
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });

      if (verifyError) throw verifyError;

      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      // Success - redirect to home
      router.replace('/');
    } catch (err) {
      if (err instanceof Error) {
        const isPasswordMessage = err.message.toLowerCase().includes('password');
        setError({ 
          code: isPasswordMessage ? '' : err.message, 
          password: isPasswordMessage ? err.message : '' 
        });
      } else {
        setError({ code: 'An error occurred. Please try again.', password: '' });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function onPasswordSubmitEditing() {
    codeInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Reset password</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the code sent to {email || 'your email'} and set a new password
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">New password</Label>
              </View>
              <Input
                id="password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={onPasswordSubmitEditing}
                editable={!isLoading}
              />
              {error.password ? (
                <Text className="text-sm font-medium text-destructive">{error.password}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <Input
                ref={codeInputRef}
                id="code"
                autoCapitalize="none"
                value={code}
                onChangeText={setCode}
                returnKeyType="send"
                keyboardType="numeric"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                onSubmitEditing={onSubmit}
                editable={!isLoading}
              />
              {error.code ? (
                <Text className="text-sm font-medium text-destructive">{error.code}</Text>
              ) : null}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Resetting...' : 'Reset Password'}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
