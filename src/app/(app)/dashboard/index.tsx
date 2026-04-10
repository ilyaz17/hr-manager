import { ScrollView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useEmployees } from '../../../hooks/useEmployees';
import { useAttendance } from '../../../hooks/useAttendance';
import { usePayroll } from '../../../hooks/usePayroll';
import { StatCard } from '../../../components/ui/StatCard';
import { InfoCard } from '../../../components/ui/InfoCard';
import { PieChart, Slice } from '../../../components/ui/PieChart';
import { Colors } from '../../../constants/colors';

// ── Static company info cards ──────────────────────────────────────────────
const COMPANY_CARDS = [
  {
    emoji: '🏢',
    label: 'Company',
    value: 'Acme Corp',
    sub: 'Est. 2018',
    color: Colors.primary,
    bgColor: Colors.primaryLight,
  },
  {
    emoji: '📍',
    label: 'Head Office',
    value: 'Mumbai',
    sub: 'Maharashtra, India',
    color: '#0288D1',
    bgColor: '#E1F5FE',
  },
  {
    emoji: '📅',
    label: 'Work Week',
    value: 'Mon – Fri',
    sub: '9 AM – 6 PM IST',
    color: '#7B1FA2',
    bgColor: '#F3E5F5',
  },
];

// ── Legend dot ────────────────────────────────────────────────────────────
function LegendDot({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 4 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginRight: 6 }} />
      <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
        {label}{' '}
        <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>{value}</Text>
      </Text>
    </View>
  );
}

// ── Quick action tile ─────────────────────────────────────────────────────
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

// ── Screen ────────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { employees } = useEmployees();
  const { records: attendance } = useAttendance();
  const { records: payroll } = usePayroll();

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7);

  // ── Attendance summary (all-time) ──────────────────────────────────────
  const totalPresent  = attendance.filter((r) => r.status === 'Present').length;
  const totalAbsent   = attendance.filter((r) => r.status === 'Absent').length;
  const totalHalfDay  = attendance.filter((r) => r.status === 'Half Day').length;
  const totalLeave    = attendance.filter((r) => r.status === 'Leave').length;
  const todayPresent  = attendance.filter((r) => r.date === today && r.status === 'Present').length;
  const monthPayroll  = payroll.filter((r) => r.month === currentMonth).length;
  const totalAttendance = totalPresent + totalAbsent + totalHalfDay + totalLeave;

  const pieSlices: Slice[] = [
    { value: totalPresent,  color: '#4CAF50', label: 'Present'  },
    { value: totalLeave,    color: '#42A5F5', label: 'Leave'    },
    { value: totalHalfDay,  color: '#FFA726', label: 'Half Day' },
    { value: totalAbsent,   color: '#EF5350', label: 'Absent'   },
  ];

  const attendancePct =
    totalAttendance > 0
      ? Math.round((totalPresent / totalAttendance) * 100)
      : 0;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Header ── */}
      <View style={{
        backgroundColor: Colors.primary,
        paddingTop: 54, paddingBottom: 24, paddingHorizontal: 20,
        borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>Welcome back,</Text>
            <Text style={{ color: Colors.white, fontSize: 22, fontWeight: '800', marginTop: 2 }}>
              {user?.username}
            </Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}
          >
            <Text style={{ color: Colors.white, fontSize: 13, fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>

        {/* ── 3 Static Info Cards ── */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>
          Company Info
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {COMPANY_CARDS.map((c) => (
            <InfoCard key={c.label} {...c} />
          ))}
        </View>

        {/* ── Live Stats ── */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>
          Overview
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <StatCard label="Total Employees"    value={employees.length}  color={Colors.primary} bgColor={Colors.primaryLight} />
          <StatCard label="Present Today"       value={todayPresent}      color="#388E3C"        bgColor="#E8F5E9" />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatCard label="Attendance Records"  value={attendance.length} color="#0288D1"        bgColor="#E1F5FE" />
          <StatCard label="Payroll This Month"  value={monthPayroll}      color="#7B1FA2"        bgColor="#F3E5F5" />
        </View>

        {/* ── Pie Chart: Overall Leave / Present ── */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
          Attendance Breakdown
        </Text>
        <View style={{
          backgroundColor: Colors.white, borderRadius: Colors.radius,
          padding: 20, marginBottom: 20,
          borderWidth: 1, borderColor: Colors.border,
        }}>
          {totalAttendance === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>📊</Text>
              <Text style={{ color: Colors.textSecondary, fontWeight: '600', fontSize: 14 }}>No attendance data yet</Text>
              <Text style={{ color: Colors.textLight, fontSize: 12, marginTop: 4 }}>Mark attendance from Reports → Attendance</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Donut chart */}
              <PieChart
                slices={pieSlices}
                size={160}
                hole={50}
                centerLabel={`${attendancePct}%`}
                centerSub="present"
              />

              {/* Legend */}
              <View style={{ flex: 1, paddingLeft: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 }}>
                  All-time ({totalAttendance} records)
                </Text>
                <LegendDot color="#4CAF50" label="Present"  value={totalPresent}  />
                <LegendDot color="#42A5F5" label="Leave"    value={totalLeave}    />
                <LegendDot color="#FFA726" label="Half Day" value={totalHalfDay}  />
                <LegendDot color="#EF5350" label="Absent"   value={totalAbsent}   />
              </View>
            </View>
          )}
        </View>

        {/* ── Quick Actions ── */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>
          Quick Actions
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <QuickAction emoji="➕" label="Add Employee"    color={Colors.primary} onPress={() => router.push('/(app)/employees/add')} />
          <QuickAction emoji="👥" label="View Employees"  color={Colors.primary} onPress={() => router.push('/(app)/employees')} />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          <QuickAction emoji="🗓️" label="Attendance"     color="#0288D1"        onPress={() => router.push('/(app)/reports/attendance')} />
          <QuickAction emoji="💰" label="Payroll"         color="#7B1FA2"        onPress={() => router.push('/(app)/reports/payroll')} />
        </View>

        {/* ── Recent Employees ── */}
        {employees.length > 0 && (
          <>
            <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Recent Employees
            </Text>
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
                  backgroundColor: Colors.primaryLight,
                  alignItems: 'center', justifyContent: 'center', marginRight: 12,
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
