import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface Payslip {
  id: string;
  employeeName: string;
  period: string;
  payDate: string;
  grossPay: number;
  netPay: number;
  deductions: number;
  benefits: number;
  status: 'paid' | 'pending' | 'late';
}

interface SalaryRecord {
  id: string;
  year: string;
  month: string;
  totalEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  maxSalary: number;
  minSalary: number;
}

export default function PayrollScreen() {
  const [activeTab, setActiveTab] = useState<'payslips' | 'summary'>('payslips');
  const [payslips, setPayslips] = useState<Payslip[]>([
    {
      id: '1',
      employeeName: 'Rahul Sharma',
      period: 'March 2026',
      payDate: '2026-04-01',
      grossPay: 45000,
      netPay: 38700,
      deductions: 5000,
      benefits: 2000,
      status: 'paid',
    },
    {
      id: '2',
      employeeName: 'Priya Patel',
      period: 'March 2026',
      payDate: '2026-04-02',
      grossPay: 42000,
      netPay: 36000,
      deductions: 4600,
      benefits: 1400,
      status: 'paid',
    },
    {
      id: '3',
      employeeName: 'Amit Kumar',
      period: 'March 2026',
      payDate: '2026-04-03',
      grossPay: 55000,
      netPay: 47100,
      deductions: 5200,
      benefits: 2700,
      status: 'pending',
    },
  ]);

  const [salarySummary, setSalarySummary] = useState<SalaryRecord[]>([
    {
      id: '1',
      year: '2026',
      month: 'March',
      totalEmployees: 15,
      totalPayroll: 675000,
      averageSalary: 45000,
      maxSalary: 65000,
      minSalary: 35000,
    },
    {
      id: '2',
      year: '2026',
      month: 'February',
      totalEmployees: 15,
      totalPayroll: 672000,
      averageSalary: 44800,
      maxSalary: 64000,
      minSalary: 34800,
    },
    {
      id: '3',
      year: '2025',
      month: 'December',
      totalEmployees: 14,
      totalPayroll: 630000,
      averageSalary: 45000,
      maxSalary: 60000,
      minSalary: 35000,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return Colors.green;
      case 'pending': return Colors.orange;
      case 'late': return Colors.red;
      default: return Colors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'late': return 'Late';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return '₹' + value.toLocaleString('en-IN');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payroll Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Feature', 'Export functionality would open here')}
        >
          <Text style={styles.addButtonText}>📄 Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'payslips' && { borderBottomWidth: 2, borderColor: Colors.primary }]}
          onPress={() => setActiveTab('payslips')}
        >
          <Text style={[styles.tabText, activeTab === 'payslips' && { color: Colors.primary, fontWeight: '600' }]}>Payslips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'summary' && { borderBottomWidth: 2, borderColor: Colors.primary }]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, activeTab === 'summary' && { color: Colors.primary, fontWeight: '600' }]}>Summary</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {activeTab === 'payslips' ? (
          <>
            <Text style={styles.sectionTitle}>Payslip List</Text>
            {payslips.map((payslip) => (
              <View key={payslip.id} style={styles.payslipCard}>
                <View style={styles.payslipHeader}>
                  <Text style={styles.employeeName}>{payslip.employeeName}</Text>
                  <Text style={styles.period}>{payslip.period}</Text>
                </View>
                <View style={styles.payslipDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Pay Date:</Text>
                    <Text style={styles.detailValue}>{payslip.payDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Gross Pay:</Text>
                    <Text style={[styles.detailValue, styles.amountText, { color: Colors.green }]}>{formatCurrency(payslip.grossPay)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Deductions:</Text>
                    <Text style={[styles.detailValue, styles.amountText, { color: Colors.red }]}>{formatCurrency(payslip.deductions)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Benefits:</Text>
                    <Text style={[styles.detailValue, styles.amountText, { color: Colors.blue }]}>{formatCurrency(payslip.benefits)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Net Pay:</Text>
                    <Text style={[styles.detailValue, styles.amountText, { color: Colors.primary, fontWeight: 'bold' }]}>{formatCurrency(payslip.netPay)}</Text>
                  </View>
                </View>
                <View style={styles.payslipFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payslip.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(payslip.status)}</Text>
                  </View>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Salary Summary</Text>
            {salarySummary.map((summary) => (
              <View key={summary.id} style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>{summary.month} {summary.year}</Text>
                  <Text style={styles.totalPayroll}>{formatCurrency(summary.totalPayroll)}</Text>
                </View>
                <View style={styles.summaryStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Employees</Text>
                    <Text style={styles.statValue}>{summary.totalEmployees}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Average Salary</Text>
                    <Text style={styles.statValue}>{formatCurrency(summary.averageSalary)}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Max Salary</Text>
                    <Text style={styles.statValue}>{formatCurrency(summary.maxSalary)}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Min Salary</Text>
                    <Text style={styles.statValue}>{formatCurrency(summary.minSalary)}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsButtonText}>View Full Report</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: Colors.card,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  payslipCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  payslipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  period: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  payslipDetails: {
    gap: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.text,
  },
  amountText: {
    fontWeight: '600',
  },
  payslipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  viewButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalPayroll: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  summaryStats: {
    gap: 10,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  viewDetailsButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
};