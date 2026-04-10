import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { exportPayslip, exportAttendanceData, exportPerformanceReviews, exportRecord } from '../../utils/export';
import { sendPayslipNotification, sendLeaveApprovalNotification, sendPerformanceReviewNotification } from '../../utils/useNotifications';

interface Payslip {
  id: string;
  employeeName: string;
  employeeId: string;
  period: string;
  payDate: string;
  grossPay: number;
  netPay: number;
  deductions: number;
  benefits: number;
  status: 'paid' | 'pending' | 'late';
}

export default function PayrollScreen() {
  const [activeTab, setActiveTab] = useState<'payslips' | 'summary'>('payslips');
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'both' | null>(null);

  const [payslips, setPayslips] = useState<Payslip[]>([
    {
      id: '1',
      employeeName: 'Rahul Sharma',
      employeeId: 'EMP001',
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
      employeeId: 'EMP002',
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
      employeeId: 'EMP003',
      period: 'March 2026',
      payDate: '2026-04-03',
      grossPay: 55000,
      netPay: 47100,
      deductions: 5200,
      benefits: 2700,
      status: 'pending',
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

  const exportModal = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={exportModalVisible}
      onRequestClose={() => setExportModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            {selectedPayslip?.employeeName}'s Payslip
          </Text>

          <Text style={styles.modalSubtitle}>
            Export as:
          </Text>

          <ScrollView style={styles.modalContent}>
            <TouchableOpacity
              style={[styles.exportOption, { backgroundColor: Colors.primary + '20' }]}
              onPress={() => {
                setExportFormat('pdf');
                handleConfirmExport();
              }}
            >
              <Text style={styles.exportIcon}>📄</Text>
              <View>
                <Text style={styles.exportTitle}>PDF Format</Text>
                <Text style={styles.exportDescription}>
                  Professional formatted report with pay breakdown
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.exportOption, { backgroundColor: Colors.success + '20' }]}
              onPress={() => {
                setExportFormat('excel');
                handleConfirmExport();
              }}
            >
              <Text style={styles.exportIcon}>📊</Text>
              <View>
                <Text style={styles.exportTitle}>Excel Format</Text>
                <Text style={styles.exportDescription}>
                  Spreadsheet format for data analysis
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.exportOption, { backgroundColor: Colors.primary + '30' }]}
              onPress={() => {
                setExportFormat('both');
                handleConfirmExport();
              }}
            >
              <Text style={styles.exportIcon}>📥</Text>
              <View>
                <Text style={styles.exportTitle}>Both Formats</Text>
                <Text style={styles.exportDescription}>
                  Download in both PDF and Excel formats
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity onPress={() => setExportModalVisible(false)}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const handleConfirmExport = async () => {
    if (!selectedPayslip || !exportFormat) {
      Alert.alert('Error', 'Please select format and pay period');
      return;
    }

    try {
      // Send notification about payslip generation
      await sendPayslipNotification(
        selectedPayslip.employeeName,
        selectedPayslip.period,
        selectedPayslip.id
      );

      // Perform export
      await exportPayslip(
        {
          ...selectedPayslip,
          employeeId: selectedPayslip.employeeId,
          deductions: [{ type: 'Provident Fund', amount: selectedPayslip.deductions }],
          benefits: [{ type: 'Allowances', amount: selectedPayslip.benefits }],
        },
        {
          fileName: selectedPayslip.employeeName.replace(/\s+/g, '_'),
          exportType: exportFormat,
          share: true,
        }
      );

      setExportModalVisible(false);
      setSelectedPayslip(null);
      setExportFormat(null);
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Error', 'Failed to export payslip');
    }
  };

  const exportPayslipToExcel = async (payslip: Payslip) => {
    try {
      await exportRecord('payslip', payslip, {
        fileName: payslip.employeeName.replace(/\s+/g, '_'),
        exportType: 'excel',
      });
      Alert.alert('Payslip Exported', 'Excel file created');
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export payslip');
    }
  };

  const handleLeave = (payslipId: string) => {
    // Navigate to leave screen
    router.push('/(app)/leave/index');
  };

  const handleClockIn = () => {
    // Navigate to attendance/clock-in
    Alert.alert('Clock In', 'Attendance time recorded');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {exportModal}

      <StatusBar />
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'payslips' && styles.activeTab]}
          onPress={() => setActiveTab('payslips')}
        >
          <Text style={[styles.tabText, activeTab === 'payslips' && styles.activeTabText]}>
            Payslips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
            Salary Summary
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'payslips' && (
          <View style={styles.payslipList}>
            {payslips.map((payslip) => (
              <TouchableOpacity
                key={payslip.id}
                style={[styles.payslipCard, { backgroundColor: Colors.background }]}
                onPress={() => {
                  setSelectedPayslip(payslip);
                  setExportModalVisible(true);
                }}
              >
                <View style={styles.payslipHeader}>
                  <View style={styles.employeeInfo}>
                    <View style={styles.employeeName}>
                      <Text style={styles.employeeName}>{payslip.employeeName}</Text>
                    </View>
                    <Text style={styles.employeeId}>ID: {payslip.employeeId}</Text>
                  </View>
                  <View style={styles.payslipStatus}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(payslip.status) },
                      ]}
                    >
                      <Text style={{ color: '#fff', fontWeight: '600' }}>
                        {getStatusText(payslip.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.payslipDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Period:</Text>
                    <Text style={styles.detailValue}>{payslip.period}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Pay Date:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(payslip.payDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.amountsContainer}>
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Gross Pay:</Text>
                    <Text style={styles.amountValue}>{formatCurrency(payslip.grossPay)}</Text>
                  </View>
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Deductions:</Text>
                    <Text style={[styles.amountValue, { color: Colors.danger }]}>
                      -{formatCurrency(payslip.deductions)}
                    </Text>
                  </View>
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Benefits:</Text>
                    <Text style={[styles.amountValue, { color: Colors.success }]}>
                      +{formatCurrency(payslip.benefits)}
                    </Text>
                  </View>
                  <View style={[styles.amountRow, styles.netPayRow]}>
                    <Text style={styles.amountLabel}>Net Pay:</Text>
                    <Text style={[styles.amountValue, styles.netPay]}>
                      {formatCurrency(payslip.netPay)}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      handleLeave(payslip.employeeId);
                    }}
                  >
                    <Text style={styles.actionButtonText}>View Payslip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.pdfButton]}
                    onPress={() => {
                      setSelectedPayslip(payslip);
                      setExportFormat('pdf');
                    }}
                  >
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>PDF Export</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.excelButton]}
                    onPress={() => {
                      exportPayslipToExcel(payslip);
                    }}
                  >
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>Excel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'summary' && (
          <View style={styles.summaryCardsContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Employees</Text>
              <Text style={styles.summaryNumber}>15</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Payroll</Text>
              <Text style={styles.summaryNumber}>₹ 675,000</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Average Salary</Text>
              <Text style={styles.summaryNumber}>₹ 45,000</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Highest Salary</Text>
              <Text style={styles.summaryNumber}>₹ 65,000</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 15,
  },
  modalContent: {
    maxHeight: 300,
    marginBottom: 20,
  },
  exportOption: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  exportIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  exportDescription: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  cancelButton: {
    textAlign: 'center',
    color: Colors.secondaryText,
    paddingVertical: 10,
    fontSize: 14,
  },
  statusBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  clockInButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clockInText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 5,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  payslipList: {
    flex: 1,
  },
  payslipCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  payslipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  payslipStatus: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  payslipDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailRow: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  amountsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  netPayRow: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  netPay: {
    fontSize: 18,
    color: Colors.success,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  pdfButton: {
    backgroundColor: Colors.primary,
  },
  excelButton: {
    backgroundColor: Colors.success,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
});
