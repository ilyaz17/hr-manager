import { ScrollView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useEmployees } from '../../../hooks/useEmployees';
import { useAttendance } from '../../../hooks/useAttendance';
import { usePayroll } from '../../../hooks/usePayroll';
import { StatCard } from '../../../components/ui/StatCard';
import { Colors } from '../../../constants/colors';

function QuickAction({ emoji, label, color, onPress }: { emoji: string; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1, alignItems: 'center', backgroundColor: Colors.white,
        borderRadius: Colors.radius, padding: 16, margin: 4,
        borderWidth: 1, borderColor: Colors.border,
      }}
    >
      <Text style={{ fontSize: 26, marginBottom: 6 }}>{emoji}</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color, textAlign: 'center' }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { employees } = useEmployees();
  const { records: attendance } = useAttendance();
  const { records: payroll } = usePayroll();

  const today = new Date().toISOString().split('T')[0];
  const todayPresent = attendance.filter((r) => r.date === today && r.status === 'Present').length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthPayroll = payroll.filter((r) => r.month === currentMonth).length;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={{
        backgroundColor: Colors.primary,
        paddingTop: 54, paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>Welcome back,</Text>
            <Text style={{ color: Colors.white, fontSize: 22, fontWeight: '800', marginTop: 2 }}>{user?.username}</Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
            }}
          >
            <Text style={{ color: Colors.white, fontSize: 13, fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>Overview</Text>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <StatCard label="Total Employees" value={employees.length} color={Colors.primary} bgColor={Colors.primaryLight} />
          <StatCard label="Present Today" value={todayPresent} color="#388E3C" bgColor="#E8F5E9" />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatCard label="Attendance Records" value={attendance.length} color="#0288D1" bgColor="#E1F5FE" />
          <StatCard label="Payroll This Month" value={monthPayroll} color="#7B1FA2" bgColor="#F3E5F5" />
        </View>

        {/* Quick Actions */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>Quick Actions</Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <QuickAction emoji="➕" label="Add Employee" color={Colors.primary} onPress={() => router.push('/(app)/employees/add')} />
          <QuickAction emoji="👥" label="View Employees" color={Colors.primary} onPress={() => router.push('/(app)/employees')} />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          <QuickAction emoji="🗓️" label="Attendance Report" color="#0288D1" onPress={() => router.push('/(app)/reports/attendance')} />
          <QuickAction emoji="💰" label="Payroll Report" color="#7B1FA2" onPress={() => router.push('/(app)/reports/payroll')} />
        </View>

        {/* Recent Employees */}
        {employees.length > 0 && (
          <>
            <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>Recent Employees</Text>
            {employees.slice(-3).reverse().map((emp) => (
              <TouchableOpacity
                key={emp.id}
                onPress={() => router.push(`/(app)/employees/${emp.id}`)}
                style={{
                  backgroundColor: Colors.white, borderRadius: Colors.radius,
                  padding: 14, marginBottom: 8, flexDirection: 'row',
                  alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
                }}
              >
                <View style={{
                  width: 42, height: 42, borderRadius: 21,
                  backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12,
                }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.primary }}>
                    {emp.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: Colors.textPrimary, fontSize: 15 }}>{emp.name}</Text>
                  <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>{emp.designation} · {emp.department}</Text>
                </View>
                <Text style={{ color: Colors.textLight, fontSize: 18 }}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
