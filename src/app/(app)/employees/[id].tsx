import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEmployees, EmployeeInput } from '../../../hooks/useEmployees';
import { FormField } from '../../../components/ui/FormField';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { Colors } from '../../../constants/colors';

const EMPTY: EmployeeInput = {
  name: '', dob: '', gender: '', phone: '', email: '', address: '',
  employeeId: '', designation: '', department: '', joinDate: '', employmentType: '',
  basicSalary: '', allowance: '', deduction: '', bankName: '', accountNumber: '',
};

export default function EditEmployeeScreen() {
  const router = useRouter();
  // Bug 9 fix: coerce id to string — useLocalSearchParams can return string | string[]
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [form, setForm] = useState<EmployeeInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const emp = getEmployee(id);
    if (emp) {
      const { id: _id, ...rest } = emp;
      setForm(rest);
    }
  }, [id]);

  const set = (key: keyof EmployeeInput) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.name.trim() || !form.designation.trim()) {
      Alert.alert('Required', 'Name and Designation are required.');
      return;
    }
    setSaving(true);
    updateEmployee(id, form);
    setSaving(false);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Delete Employee', `Remove ${form.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => { deleteEmployee(id); router.replace('/(app)/employees'); },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={{ backgroundColor: Colors.primary, paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Text style={{ color: Colors.white, fontSize: 22 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: Colors.white, fontSize: 20, fontWeight: '800' }}>Edit Employee</Text>
        </View>
        <TouchableOpacity
          onPress={handleDelete}
          style={{ backgroundColor: 'rgba(244,67,54,0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}
        >
          <Text style={{ color: '#FFCDD2', fontWeight: '700', fontSize: 13 }}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Personal Details" />
        <FormField label="Full Name *" value={form.name} onChangeText={set('name')} />
        <FormField label="Date of Birth" value={form.dob} onChangeText={set('dob')} placeholder="DD/MM/YYYY" />
        <FormField label="Gender" value={form.gender} onChangeText={set('gender')} />
        <FormField label="Phone" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
        <FormField label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" />
        <FormField label="Address" value={form.address} onChangeText={set('address')} multiline numberOfLines={2} />

        <SectionHeader title="Work Details" />
        <FormField label="Employee ID" value={form.employeeId} onChangeText={set('employeeId')} />
        <FormField label="Designation *" value={form.designation} onChangeText={set('designation')} />
        <FormField label="Department" value={form.department} onChangeText={set('department')} />
        <FormField label="Join Date" value={form.joinDate} onChangeText={set('joinDate')} placeholder="DD/MM/YYYY" />
        <FormField label="Employment Type" value={form.employmentType} onChangeText={set('employmentType')} />

        <SectionHeader title="Salary Details" />
        <FormField label="Basic Salary" value={form.basicSalary} onChangeText={set('basicSalary')} keyboardType="numeric" />
        <FormField label="Allowance" value={form.allowance} onChangeText={set('allowance')} keyboardType="numeric" />
        <FormField label="Deduction" value={form.deduction} onChangeText={set('deduction')} keyboardType="numeric" />
        <FormField label="Bank Name" value={form.bankName} onChangeText={set('bankName')} />
        <FormField label="Account Number" value={form.accountNumber} onChangeText={set('accountNumber')} keyboardType="numeric" />

        <PrimaryButton label="Save Changes" onPress={handleSave} loading={saving} />
        <PrimaryButton label="Cancel" onPress={() => router.back()} variant="outline" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
