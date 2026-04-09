import { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Modal, ScrollView, Alert, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEmployees } from '../../../hooks/useEmployees';
import { useAttendance, AttendanceStatus } from '../../../hooks/useAttendance';
import { Colors } from '../../../constants/colors';

const STATUS_COLORS: Record<AttendanceStatus, { bg: string; text: string }> = {
  Present: { bg: '#E8F5E9', text: '#388E3C' },
  Absent: { bg: '#FFEBEE', text: '#D32F2F' },
  'Half Day': { bg: '#FFF8E1', text: '#F57F17' },
  Leave: { bg: '#E3F2FD', text: '#1565C0' },
};

const STATUSES: AttendanceStatus[] = ['Present', 'Absent', 'Half Day', 'Leave'];

export default function AttendanceReportScreen() {
  const router = useRouter();
  const { employees } = useEmployees();
  const { records, addRecord, getSummary } = useAttendance();
  const [modal, setModal] = useState(false);
  const [selEmp, setSelEmp] = useState('');
  const [selStatus, setSelStatus] = useState<AttendanceStatus>('Present');
  const [hours, setHours] = useState('8');
  const today = new Date().toISOString().split('T')[0];

  const handleMark = () => {
    if (!selEmp) { Alert.alert('Select an employee'); return; }
    const emp = employees.find((e) => e.id === selEmp);
    if (!emp) return;
    addRecord({ employeeId: emp.id, employeeName: emp.name, date: today, status: selStatus, hoursWorked: hours });
    setModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Text style={{ color: Colors.white, fontSize: 22 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: Colors.white, fontSize: 20, fontWeight: '800' }}>Attendance</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModal(true)}
          style={{ backgroundColor: Colors.secondary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}
        >
          <Text style={{ color: Colors.primaryDark, fontWeight: '700', fontSize: 13 }}>+ Mark</Text>
        </TouchableOpacity>
      </View>

      {/* Summary cards */}
      {employees.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
          {employees.map((emp) => {
            const s = getSummary(emp.id);
            return (
              <View key={emp.id} style={{
                backgroundColor: Colors.white, borderRadius: Colors.radius,
                padding: 14, marginRight: 10, minWidth: 150,
                borderWidth: 1, borderColor: Colors.border,
              }}>
                <Text style={{ fontWeight: '700', color: Colors.textPrimary, fontSize: 14 }}>{emp.name}</Text>
                <Text style={{ color: Colors.textSecondary, fontSize: 11, marginBottom: 8 }}>{emp.designation}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                  <View style={{ backgroundColor: '#E8F5E9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: '#388E3C', fontSize: 11, fontWeight: '600' }}>P {s.present}</Text>
                  </View>
                  <View style={{ backgroundColor: '#FFEBEE', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: '#D32F2F', fontSize: 11, fontWeight: '600' }}>A {s.absent}</Text>
                  </View>
                  <View style={{ backgroundColor: '#FFF8E1', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: '#F57F17', fontSize: 11, fontWeight: '600' }}>H {s.halfDay}</Text>
                  </View>
                  <View style={{ backgroundColor: '#E3F2FD', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: '#1565C0', fontSize: 11, fontWeight: '600' }}>L {s.leave}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Records list */}
      <FlatList
        data={[...records].reverse()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 36, marginBottom: 10 }}>🗓️</Text>
            <Text style={{ color: Colors.textSecondary, fontWeight: '600' }}>No attendance records yet</Text>
            <Text style={{ color: Colors.textLight, fontSize: 13, marginTop: 4 }}>Tap + Mark to add today's attendance</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: Colors.white, borderRadius: Colors.radius,
            padding: 14, marginBottom: 8, flexDirection: 'row',
            alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: Colors.textPrimary, fontSize: 14 }}>{item.employeeName}</Text>
              <Text style={{ color: Colors.textSecondary, fontSize: 12, marginTop: 2 }}>{item.date} · {item.hoursWorked}h</Text>
            </View>
            <View style={{
              backgroundColor: STATUS_COLORS[item.status].bg,
              borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
            }}>
              <Text style={{ color: STATUS_COLORS[item.status].text, fontWeight: '700', fontSize: 12 }}>{item.status}</Text>
            </View>
          </View>
        )}
      />

      {/* Mark Attendance Modal */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 }}>Mark Attendance — {today}</Text>

            <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' }}>Select Employee</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {employees.map((emp) => (
                <TouchableOpacity
                  key={emp.id}
                  onPress={() => setSelEmp(emp.id)}
                  style={{
                    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
                    backgroundColor: selEmp === emp.id ? Colors.primary : Colors.background,
                    borderWidth: 1, borderColor: selEmp === emp.id ? Colors.primary : Colors.border,
                  }}
                >
                  <Text style={{ color: selEmp === emp.id ? Colors.white : Colors.textPrimary, fontWeight: '600', fontSize: 13 }}>{emp.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' }}>Status</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {STATUSES.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSelStatus(s)}
                  style={{
                    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
                    backgroundColor: selStatus === s ? STATUS_COLORS[s].bg : Colors.background,
                    borderWidth: 1.5, borderColor: selStatus === s ? STATUS_COLORS[s].text : Colors.border,
                  }}
                >
                  <Text style={{ color: selStatus === s ? STATUS_COLORS[s].text : Colors.textSecondary, fontWeight: '600', fontSize: 13 }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{ flex: 1, borderRadius: Colors.radius, borderWidth: 1.5, borderColor: Colors.border, paddingVertical: 13, alignItems: 'center' }}
              >
                <Text style={{ color: Colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleMark}
                style={{ flex: 1, borderRadius: Colors.radius, backgroundColor: Colors.primary, paddingVertical: 13, alignItems: 'center' }}
              >
                <Text style={{ color: Colors.white, fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
