import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
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

export default function AddEmployeeScreen() {
  const router = useRouter();
  const { addEmployee } = useEmployees();
  const [form, setForm] = useState<EmployeeInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof EmployeeInput) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.designation.trim()) {
      Alert.alert('Required', 'Name and Designation are required.');
      return;
    }
    setSaving(true);
    addEmployee(form);
    setSaving(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: Colors.white, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: Colors.white, fontSize: 20, fontWeight: '800' }}>Add Employee</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <SectionHeader title="Personal Details" />
        <FormField label="Full Name *" value={form.name} onChangeText={set('name')} placeholder="e.g. John Smith" />
        <FormField label="Date of Birth" value={form.dob} onChangeText={set('dob')} placeholder="DD/MM/YYYY" />
        <FormField label="Gender" value={form.gender} onChangeText={set('gender')} placeholder="Male / Female / Other" />
        <FormField label="Phone" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="+91 XXXXX XXXXX" />
        <FormField label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" placeholder="john@example.com" />
        <FormField label="Address" value={form.address} onChangeText={set('address')} placeholder="Street, City, State" multiline numberOfLines={2} />

        <SectionHeader title="Work Details" />
        <FormField label="Employee ID" value={form.employeeId} onChangeText={set('employeeId')} placeholder="EMP-001" />
        <FormField label="Designation *" value={form.designation} onChangeText={set('designation')} placeholder="e.g. Software Engineer" />
        <FormField label="Department" value={form.department} onChangeText={set('department')} placeholder="e.g. Engineering" />
        <FormField label="Join Date" value={form.joinDate} onChangeText={set('joinDate')} placeholder="DD/MM/YYYY" />
        <FormField label="Employment Type" value={form.employmentType} onChangeText={set('employmentType')} placeholder="Full-time / Part-time / Contract" />

        <SectionHeader title="Salary Details" />
        <FormField label="Basic Salary" value={form.basicSalary} onChangeText={set('basicSalary')} keyboardType="numeric" placeholder="0.00" />
        <FormField label="Allowance" value={form.allowance} onChangeText={set('allowance')} keyboardType="numeric" placeholder="0.00" />
        <FormField label="Deduction" value={form.deduction} onChangeText={set('deduction')} keyboardType="numeric" placeholder="0.00" />
        <FormField label="Bank Name" value={form.bankName} onChangeText={set('bankName')} placeholder="e.g. State Bank of India" />
        <FormField label="Account Number" value={form.accountNumber} onChangeText={set('accountNumber')} keyboardType="numeric" placeholder="XXXXXXXXXXXX" />

        <PrimaryButton label="Add Employee" onPress={handleSave} loading={saving} />
        <PrimaryButton label="Cancel" onPress={() => router.back()} variant="outline" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
