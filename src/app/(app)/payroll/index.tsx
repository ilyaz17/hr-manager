import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { exportPayslipToExcel } from '../../utils/excelUtils';

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

  const handleExportPayslip = async (payslip: Payslip) => {
    try {
      // Prepare payslip data for export
      const payslipData = {
        employeeName: payslip.employeeName,
        employeeId: payslip.id,
        period: payslip.period,
        payDate: payslip.payDate,
        grossPay: payslip.grossPay,
        netPay: payslip.netPay,
        deductions: payslip.deductions,
        benefits: payslip.benefits,
        totalDeductions: payslip.deductions + payslip.benefits,
        totalSalary: payslip.grossPay - payslip.deductions - payslip.benefits,
        earnings: [
          { name: 'Basic Salary', amount: payslip.grossPay - payslip.deductions - payslip.benefits },
          { name: 'Allowances', amount: payslip.benefits },
        ],
        deductionsList: [
          { name: 'Provident Fund', amount: 4000 },
          { name: 'Tax Deduction', amount: 1000 },
          { name: 'Health Insurance', amount: null },
        ],
        grossSalary: payslip.grossPay,
        netSalary: payslip.netPay,
      };

      // Export to Excel
      await exportPayslipToExcel(payslipData, payslip.employeeName.replace(/\s+/g, '-'));
      Alert.alert('Success', 'Payslip exported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export payslip. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payroll Management</Text>
        <View style={styles.addButtonContainer}>
          <TouchableOpacity 
            style={[styles.addButton, styles.exportButton]}
            onPress={() => Alert.alert('Feature', 'Export to PDF would open here')}
          >
            <Text style={styles.addButtonText}>📄 PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.addButton, styles.exportButton]}
            onPress={() => Alert.alert('Feature', 'Export to Excel would open here')}
          >
            <Text style={styles.addButtonText}>📊 Excel</Text>
          </TouchableOpacity>
        </View>
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
        {activeTab === 'payslips' && payslips.map((payslip) => (
          <View key={payslip.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <Text style={[styles.employeeName, { color: colors.text }]}>{payslip.employeeName}</Text>
                <Text style={[styles.employeeDetails, { color: colors.secondaryText }]}>
                  Period: {payslip.period} | Pay Date: {payslip.payDate}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payslip.status) }]}>
                <Text style={styles.statusText}>{getStatusText(payslip.status)}</Text>
              </View>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>Gross Pay:</Text>
                <Text style={[styles.detailValue, { color: colors.primary }]}>
                  {formatCurrency(payslip.grossPay)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>Net Pay:</Text>
                <Text style={[styles.detailValue, { color: colors.primary }]}>
                  {formatCurrency(payslip.netPay)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>Deductions:</Text>
                <Text style={[styles.detailValue, { color: colors.red }]}>
                  {formatCurrency(payslip.deductions)}
                </Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                onPress={() => handleExportPayslip(payslip)}
              >
                <Text style={styles.actionButtonText}>📥 Download Payslip</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {activeTab === 'summary' && salarySummary.map((record) => (
          <View key={record.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.employeeName, { color: colors.text }]}>
                {record.month} {record.year}
              </Text>
              <TouchableOpacity style={[styles.viewAllButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.viewAllButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryGrid}>
              <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
                <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>Total Employees</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{record.totalEmployees}</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
                <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>Total Payroll</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(record.totalPayroll)}</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
                <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>Average Salary</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(record.averageSalary)}</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
                <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>Max Salary</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(record.maxSalary)}</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
                <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>Min Salary</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(record.minSalary)}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const colors = Colors;

const styles = {
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 10,
  },
  addButtonContainer: {
    flexDirection: 'row',
    gap: 10,
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
  exportButton: {
    backgroundColor: Colors.secondary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 15,
    marginRight: 30,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    color: '#606060',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  employeeDetails: {
    fontSize: 13,
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
  cardDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardActions: {
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  downloadButton: {
    backgroundColor: Colors.green,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 8,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewAllButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
};