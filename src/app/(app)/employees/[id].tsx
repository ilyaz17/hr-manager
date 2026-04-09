import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEmployees } from '../../../hooks/useEmployees';

const Field = ({
  label,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: any;
}) => (
  <View className="mb-4">
    <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
    <TextInput
      className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
      value={value}
      onChangeText={onChange}
      placeholder={label}
      keyboardType={keyboardType ?? 'default'}
    />
  </View>
);

export default function EditEmployeeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEmployee, updateEmployee } = useEmployees();
  const [form, setForm] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const emp = getEmployee(id);
    if (emp) {
      setForm({
        name: emp.name,
        role: emp.role,
        department: emp.department,
        email: emp.email,
        phone: emp.phone,
      });
    }
  }, [id]);

  const set = (key: string) => (val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) {
      Alert.alert('Error', 'Name and Role are required.');
      return;
    }
    await updateEmployee(id, form);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Field label="Full Name" value={form.name} onChange={set('name')} />
        <Field label="Role" value={form.role} onChange={set('role')} />
        <Field label="Department" value={form.department} onChange={set('department')} />
        <Field label="Email" value={form.email} onChange={set('email')} keyboardType="email-address" />
        <Field label="Phone" value={form.phone} onChange={set('phone')} keyboardType="phone-pad" />

        <TouchableOpacity
          className="bg-blue-600 rounded-xl py-4 items-center mt-2"
          onPress={handleSave}
        >
          <Text className="text-white font-semibold text-base">Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-xl py-4 items-center mt-2"
          onPress={() => router.back()}
        >
          <Text className="text-gray-500 text-base">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
