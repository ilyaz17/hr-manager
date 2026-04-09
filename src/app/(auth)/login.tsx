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
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter username and password.');
      return;
    }
    setSubmitting(true);
    const ok = await login(username, password);
    setSubmitting(false);
    if (ok) {
      router.replace('/(app)/dashboard');
    } else {
      Alert.alert('Login Failed', 'Invalid credentials.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.primary }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Top branding */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <View style={{
          width: 72, height: 72, borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        }}>
          <Text style={{ fontSize: 32 }}>🏢</Text>
        </View>
        <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.white, marginBottom: 4 }}>HR Manager</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Manage your workforce efficiently</Text>
      </View>

      {/* Card */}
      <View style={{
        backgroundColor: Colors.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 28,
        paddingBottom: 40,
      }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 20 }}>Sign In</Text>

        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Username</Text>
        <TextInput
          style={{
            borderWidth: 1, borderColor: Colors.border, borderRadius: Colors.radius,
            paddingHorizontal: 14, paddingVertical: 13, fontSize: 15,
            color: Colors.textPrimary, backgroundColor: Colors.background, marginBottom: 14,
          }}
          placeholder="Enter username"
          placeholderTextColor={Colors.textLight}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</Text>
        <TextInput
          style={{
            borderWidth: 1, borderColor: Colors.border, borderRadius: Colors.radius,
            paddingHorizontal: 14, paddingVertical: 13, fontSize: 15,
            color: Colors.textPrimary, backgroundColor: Colors.background, marginBottom: 24,
          }}
          placeholder="Enter password"
          placeholderTextColor={Colors.textLight}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary, borderRadius: Colors.radius,
            paddingVertical: 15, alignItems: 'center',
          }}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 16 }}>Sign In</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
