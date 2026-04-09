import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="employees/index" options={{ title: 'Employees' }} />
      <Stack.Screen name="employees/add" options={{ title: 'Add Employee' }} />
      <Stack.Screen name="employees/[id]" options={{ title: 'Edit Employee' }} />
    </Stack>
  );
}
