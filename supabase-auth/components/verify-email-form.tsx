import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { type TextStyle, View } from 'react-native';

const RESEND_CODE_INTERVAL_SECONDS = 30;

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

export function VerifyEmailForm() {
  const { email = '', mode = 'signup' } = useLocalSearchParams<{ email?: string; mode?: string }>();
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { countdown, restartCountdown } = useCountdown(RESEND_CODE_INTERVAL_SECONDS);

  async function onSubmit() {
    if (!code) {
      setError('Verification code is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup', // ✅ Correct type for email/password sign-ups
      });

      if (error) throw error;

      // success — user will be logged in automatically
      // move to your app or dashboard if needed
      router.replace('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function onResendCode() {
    setError('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup', // ✅ Resends sign-up confirmation code
        email,
      });

      if (error) throw error;

      restartCountdown();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Verify your email</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the verification code sent to {email || 'your email'}
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">

            <View className="gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <Input
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

              {error ? (
                <Text className="text-sm font-medium text-destructive">{error}</Text>
              ) : null}

              <Button
                variant="link"
                size="sm"
                disabled={countdown > 0}
                onPress={onResendCode}
              >
                <Text className="text-center text-xs">
                  Didn&apos;t receive the code? Resend{' '}
                  {countdown > 0 ? (
                    <Text className="text-xs" style={TABULAR_NUMBERS_STYLE}>
                      ({countdown})
                    </Text>
                  ) : null}
                </Text>
              </Button>
            </View>

            <View className="gap-3">
              <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
                <Text>{isLoading ? 'Verifying...' : 'Continue'}</Text>
              </Button>

              <Button variant="link" className="mx-auto" onPress={router.back}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}
