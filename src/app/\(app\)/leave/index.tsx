import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
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
}

const leaveData: Leave[] = [
  { id: '1', employeeName: 'John Doe', type: 'Annual Leave', startDate: '2026-04-15', endDate: '2026-04-19', status: 'approved', duration: '5 days' },
  { id: '2', employeeName: 'Jane Smith', type: 'Sick Leave', startDate: '2026-04-10', endDate: '2026-04-10', status: 'pending', duration: '1 day' },
  { id: '3', employeeName: 'Mike Johnson', type: 'Personal Leave', startDate: '2026-04-20', endDate: '2026-04-22', status: 'pending', duration: '3 days' },
  { id: '4', employeeName: 'Sarah Williams', type: 'Annual Leave', startDate: '2026-05-01', endDate: '2026-05-05', status: 'rejected', duration: '5 days' },
  { id: '5', employeeName: 'Tom Brown', type: 'Marriage Leave', startDate: '2026-04-28', endDate: '2026-04-30', status: 'approved', duration: '3 days' },
];

export default function LeaveListScreen() {
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
      <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 }}>
        Leave Requests
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={leaveData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.card,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => router.push(`/leave/${item.id}`)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 }}>
                  {item.employeeName}
                </Text>
                <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 2 }}>
                  {item.type}
                </Text>
                <Text style={{ fontSize: 12, color: Colors.textTertiary }}>
                  {item.startDate} to {item.endDate}
                </Text>
                <Text style={{ fontSize: 12, color: Colors.textTertiary }}>
                  {item.duration}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: `${getStatusColor(item.status)}15`,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: getStatusColor(item.status), fontSize: 12, fontWeight: '600' }}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: Colors.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
        }}
        onPress={() => router.push('/leave/add')}
      >
        <Text style={{ fontSize: 24, color: Colors.white }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}