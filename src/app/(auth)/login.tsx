import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter username and password.');
      return;
    }
    setSubmitting(true);
    const ok = await login(username, password);
    setSubmitting(false);
    if (ok) {
      router.replace('/(app)/employees');
    } else {
      Alert.alert('Login Failed', 'Invalid credentials.');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">HR Manager</Text>
        <Text className="text-base text-gray-500 mb-8">Sign in to continue</Text>

        <Text className="text-sm font-medium text-gray-700 mb-1">Username</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 mb-4 bg-gray-50"
          placeholder="Enter username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 mb-6 bg-gray-50"
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="bg-blue-600 rounded-xl py-4 items-center"
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
