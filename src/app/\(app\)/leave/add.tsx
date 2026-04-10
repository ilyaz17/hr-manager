import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface FormData {
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const leaveTypes = [
  'Annual Leave',
  'Sick Leave',
  'Personal Leave',
  'Marriage Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Unpaid Leave',
];

export default function LeaveAddScreen() {
  const [formData, setFormData] = useState<FormData>({
    employeeName: 'John Doe',
    type: 'Annual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });

  const handleSubmit = () => {
    if (!formData.reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for leave');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    // Add leave request logic here
    console.log('Leave request submitted:', formData);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: 24 }}>
          Request Leave
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 8, fontWeight: '600' }}>
            Employee Name
          </Text>
          <TextInput
            value={formData.employeeName}
            onChangeText={(text) => setFormData({ ...formData, employeeName: text })}
            style={{
              backgroundColor: Colors.card,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: Colors.textPrimary,
            }}
            placeholder="Enter employee name"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 8, fontWeight: '600' }}>
            Leave Type
          </Text>
          {leaveTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFormData({ ...formData, type })}
              style={{
                backgroundColor: formData.type === type ? `${Colors.primary}20` : Colors.card,
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
                borderLeftWidth: 4,
                borderLeftColor: formData.type === type ? Colors.primary : 'transparent',
              }}
            >
              <Text style={{ color: Colors.textPrimary, fontSize: 14 }}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 8, fontWeight: '600' }}>
            Start Date
          </Text>
          <TextInput
            value={formData.startDate}
            onChangeText={(text) => setFormData({ ...formData, startDate: text })}
            style={{
              backgroundColor: Colors.card,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: Colors.textPrimary,
            }}
            placeholder="YYYY-MM-DD"
            keyboardType="datetime"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 8, fontWeight: '600' }}>
            End Date
          </Text>
          <TextInput
            value={formData.endDate}
            onChangeText={(text) => setFormData({ ...formData, endDate: text })}
            style={{
              backgroundColor: Colors.card,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: Colors.textPrimary,
            }}
            placeholder="YYYY-MM-DD"
            keyboardType="datetime"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 8, fontWeight: '600' }}>
            Reason
          </Text>
          <TextInput
            value={formData.reason}
            onChangeText={(text) => setFormData({ ...formData, reason: text })}
            style={{
              backgroundColor: Colors.card,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: Colors.textPrimary,
              height: 100,
              textAlignVertical: 'top',
            }}
            placeholder="Please provide a reason for your leave request"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
          onPress={handleSubmit}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.white }}>
            Submit Leave Request
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}