import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

const attendanceData: AttendanceRecord[] = [
  { id: '1', date: '2026-04-09', checkIn: '09:00 AM', checkOut: '06:00 PM', duration: '9 hours', status: 'present' },
  { id: '2', date: '2026-04-10', checkIn: '09:15 AM', checkOut: '06:00 PM', duration: '8h 45m', status: 'late' },
  { id: '3', date: '2026-04-11', checkIn: '08:30 AM', checkOut: '05:30 PM', duration: '9 hours', status: 'present' },
  { id: '4', date: '2026-04-12', checkIn: '09:00 AM', checkOut: '02:00 PM', duration: '5 hours', status: 'half-day' },
  { id: '5', date: '2026-04-13', checkIn: '09:00 AM', checkOut: '06:00 PM', duration: '9 hours', status: 'present' },
];

export default function AttendanceScreen() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const toggleClock = () => {
    if (!isClockedIn) {
      // Clock in
      Alert.alert('Success', 'You have clocked in at 09:00 AM');
      setIsClockedIn(true);
    } else {
      // Clock out
      Alert.alert('Success', 'You have clocked out at 06:00 PM');
      setIsClockedIn(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10B981';
      case 'absent': return '#EF4444';
      case 'late': return '#F59E0B';
      case 'half-day': return '#6366F1';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'half-day': return 'Half Day';
      default: return status;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: 24 }}>
        Attendance
      </Text>

      <View style={{ backgroundColor: Colors.card, borderRadius: 12, padding: 24, marginBottom: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 }}>
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={{ fontSize: 18, color: Colors.textSecondary, marginBottom: 16 }}>
          {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: isClockedIn ? '#EF4444' : '#10B981',
            borderRadius: 12,
            padding: 16,
            width: 150,
            alignItems: 'center',
            marginBottom: 12,
          }}
          onPress={toggleClock}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.white }}>
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 14, color: Colors.textSecondary }}>
          {isClockedIn ? 'You are currently clocked in' : 'Click to clock in'}
        </Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12 }}>
        Recent Attendance
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {attendanceData.map((record) => (
          <View
            key={record.id}
            style={{
              backgroundColor: Colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 }}>
                {record.date}
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View>
                  <Text style={{ fontSize: 12, color: Colors.textSecondary }}>Check In</Text>
                  <Text style={{ fontSize: 14, color: Colors.textPrimary }}>{record.checkIn}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: Colors.textSecondary }}>Check Out</Text>
                  <Text style={{ fontSize: 14, color: Colors.textPrimary }}>{record.checkOut}</Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 12, color: Colors.textSecondary }}>{record.duration}</Text>
              <View
                style={{
                  backgroundColor: `${getStatusColor(record.status)}15`,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  marginTop: 4,
                }}
              >
                <Text style={{ color: getStatusColor(record.status), fontSize: 12, fontWeight: '600' }}>
                  {getStatusText(record.status)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}