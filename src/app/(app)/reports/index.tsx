import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/colors';

function ReportCard({ emoji, title, subtitle, onPress }: {
  emoji: string; title: string; subtitle: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: Colors.white, borderRadius: Colors.radius,
        padding: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: Colors.border,
      }}
    >
      <View style={{
        width: 52, height: 52, borderRadius: 14,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center', justifyContent: 'center', marginRight: 16,
      }}>
        <Text style={{ fontSize: 24 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textPrimary }}>{title}</Text>
        <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 2 }}>{subtitle}</Text>
      </View>
      <Text style={{ color: Colors.textLight, fontSize: 20 }}>›</Text>
    </TouchableOpacity>
  );
}

export default function ReportsIndexScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={{
        backgroundColor: Colors.primary, paddingTop: 54,
        paddingBottom: 20, paddingHorizontal: 20,
      }}>
        <Text style={{ color: Colors.white, fontSize: 22, fontWeight: '800' }}>Reports</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>Attendance & Payroll insights</Text>
      </View>
      <View style={{ padding: 16, marginTop: 8 }}>
        {/* Bug 10 fix: use literal emoji instead of escaped unicode */}
        <ReportCard
          emoji="🗓️"
          title="Attendance Report"
          subtitle="Daily attendance status per employee"
          onPress={() => router.push('/(app)/reports/attendance')}
        />
        <ReportCard
          emoji="💰"
          title="Payroll Report"
          subtitle="Monthly salary breakdown & net pay"
          onPress={() => router.push('/(app)/reports/payroll')}
        />
      </View>
    </View>
  );
}
