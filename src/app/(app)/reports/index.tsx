import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { exportMultipleSheetsToExcel } from '../../utils/excelUtils';

function ReportCard({ emoji, title, subtitle, onPress }: {
  emoji: string; title: string; subtitle: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{[
        styles.reportCard,
        { backgroundColor: Colors.background, borderColor: Colors.border }
      ]}
    >
      <View style={[
        styles.emojiContainer,
        { backgroundColor: Colors.primaryLight }
      ]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardTitle, { color: Colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.cardSubtitle, { color: Colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <Text style={[styles.arrow, { color: Colors.textLight }]}>›</Text>
    </TouchableOpacity>
  );
}

export default function ReportsIndexScreen() {
  const router = useRouter();

  const handleExportAllReports = async () => {
    try {
      // Export attendance and payroll data to a single Excel file
      const sheetData = [
        {
          name: 'Attendance',
          data: [
            { Date: '2026-04-01', Employee: 'Rahul Sharma', Status: 'Present', Hours: '8:00' },
            { Date: '2026-04-02', Employee: 'Priya Patel', Status: 'Present', Hours: '7:45' },
            { Date: '2026-04-03', Employee: 'Amit Kumar', Status: 'Absent', Hours: '0:00' },
            { Date: '2026-04-04', Employee: 'Suresh Singh', Status: 'Present', Hours: '8:30' },
            { Date: '2026-04-05', Employee: 'Neha Gupta', Status: 'Late', Hours: '7:15' },
          ]
        },
        {
          name: 'Payroll',
          data: [
            { Month: 'April 2026', Gross: '6,50,000', Deductions: '70,000', Net: '5,80,000' },
            { Month: 'March 2026', Gross: '6,45,000', Deductions: '68,000', Net: '5,77,000' },
            { Month: 'February 2026', Gross: '6,40,000', Deductions: '65,000', Net: '5,75,000' },
          ]
        }
      ];

      await exportMultipleSheetsToExcel(sheetData);
    } catch (error) {
      console.error('Error exporting all reports:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Header with Export Button */}
      <View style={[
        styles.header,
        { backgroundColor: Colors.primary }
      ]}>
        <View>
          <Text style={styles.headerTitle}>Reports</Text>
          <Text style={styles.headerSubtitle}>Attendance & Payroll insights</Text>
        </View>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExportAllReports}
        >
          <Text style={styles.exportButtonText}>📊 Export All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },
  contentContainer: {
    padding: 16,
    marginTop: 8,
  },
  reportCard: {
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emojiContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
  },
  exportButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exportButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});