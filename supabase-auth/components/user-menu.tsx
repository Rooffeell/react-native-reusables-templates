import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import type { TriggerRef } from '@rn-primitives/popover';
import { LogOutIcon, SettingsIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export function UserMenu() {
  const [userEmail, setUserEmail] = React.useState<string>('');
  const popoverTriggerRef = React.useRef<TriggerRef>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  async function onSignOut() {
    popoverTriggerRef.current?.close();
    await supabase.auth.signOut();
  }

  return (
    <Popover>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button variant="ghost" size="icon" className="size-8 rounded-full">
          <UserAvatar />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="w-80 p-0">
        <View className="gap-3 border-b border-border p-3">
          <View className="flex-row items-center gap-3">
            <UserAvatar className="size-10" />
            <View className="flex-1">
              <Text className="font-medium leading-5">
                {userEmail || 'User'}
              </Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-3 py-0.5">
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                // TODO: Navigate to account settings screen
              }}>
              <Icon as={SettingsIcon} className="size-4" />
              <Text>Manage Account</Text>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onPress={onSignOut}>
              <Icon as={LogOutIcon} className="size-4" />
              <Text>Sign Out</Text>
            </Button>
          </View>
        </View>
      </PopoverContent>
    </Popover>
  );
}

function UserAvatar(props: Omit<React.ComponentProps<typeof Avatar>, 'alt'>) {
  const [userEmail, setUserEmail] = React.useState<string>('');

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const { initials, userName } = React.useMemo(() => {
    const userName = userEmail || 'Unknown';
    const initials = userName
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase();

    return { initials, userName };
  }, [userEmail]);

  return (
    <Avatar alt={`${userName}'s avatar`} {...props}>
      <AvatarFallback>
        <Text>{initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}
