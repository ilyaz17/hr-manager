import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface Leave {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  duration: string;
  reason: string;
}

const leaveData: Leave = {
  id: '1',
  employeeName: 'John Doe',
  type: 'Annual Leave',
  startDate: '2026-04-15',
  endDate: '2026-04-19',
  status: 'pending',
  duration: '5 days',
  reason: 'Planning a family trip during the school holidays.',
};

export default function LeaveDetailScreen() {
  const params = useLocalSearchParams();
  const leaveId = params.id as string;
  const [leave, setLeave] = useState<Leave>(leaveData);

  const handleApprove = () => {
    setLeave({ ...leave, status: 'approved' });
    Alert.alert('Success', 'Leave request has been approved');
  };

  const handleReject = () => {
    setLeave({ ...leave, status: 'rejected' });
    Alert.alert('Success', 'Leave request has been rejected');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <Text style={{ fontSize: 24, color: Colors.textPrimary }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textPrimary }}>
          Leave Details
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: Colors.card, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 }}>
            {leave.employeeName}
          </Text>
          <View
            style={{
              backgroundColor: `${getStatusColor(leave.status)}15`,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              alignSelf: 'flex-start',
              marginBottom: 16,
            }}
          >
            <Text style={{ color: getStatusColor(leave.status), fontSize: 12, fontWeight: '600' }}>
              {getStatusText(leave.status)}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 4, fontWeight: '600' }}>
              Leave Type
            </Text>
            <Text style={{ fontSize: 16, color: Colors.textPrimary }}>
              {leave.type}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 4, fontWeight: '600' }}>
              Duration
            </Text>
            <Text style={{ fontSize: 16, color: Colors.textPrimary }}>
              {leave.duration}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 4, fontWeight: '600' }}>
              Start Date
            </Text>
            <Text style={{ fontSize: 16, color: Colors.textPrimary }}>
              {leave.startDate}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 4, fontWeight: '600' }}>
              End Date
            </Text>
            <Text style={{ fontSize: 16, color: Colors.textPrimary }}>
              {leave.endDate}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 4, fontWeight: '600' }}>
              Reason
            </Text>
            <Text style={{ fontSize: 16, color: Colors.textPrimary, lineHeight: 24 }}>
              {leave.reason}
            </Text>
          </View>
        </View>

        {leave.status === 'pending' && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors.primary,
                borderRadius: 8,
                padding: 16,
                alignItems: 'center',
              }}
              onPress={handleApprove}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.white }}>
                Approve
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors.card,
                borderRadius: 8,
                padding: 16,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#EF4444',
              }}
              onPress={handleReject}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textPrimary }}>
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}