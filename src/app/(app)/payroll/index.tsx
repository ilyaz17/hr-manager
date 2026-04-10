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
  totalEarnings: number;
  totalDeductions: number;
  totalBenefits: number;
  netPay: number;
  bonus: number;
  tax: number;
}

const payslips: Payslip[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    period: 'March 2026',
    payDate: '2026-04-05',
    grossPay: 12500,
    netPay: 9800,
    deductions: 2200,
    benefits: 500,
    status: 'paid',
  },
  {
    id: '2',
    employeeName: 'John Doe',
    period: 'February 2026',
    payDate: '2026-03-05',
    grossPay: 12500,
    netPay: 9750,
    deductions: 2300,
    benefits: 500,
    status: 'paid',
  },
  {
    id: '3',
    employeeName: 'John Doe',
    period: 'January 2026',
    payDate: '2026-02-05',
    grossPay: 12500,
    netPay: 9700,
    deductions: 2400,
    benefits: 500,
    status: 'paid',
  },
  {
    id: '4',
    employeeName: 'Jane Smith',
    period: 'March 2026',
    payDate: 'Pending',
    grossPay: 11500,
    netPay: null,
    deductions: 2000,
    benefits: 450,
    status: 'pending',
  },
  {
    id: '5',
    employeeName: 'Bob Wilson',
    period: 'March 2026',
    payDate: '2026-04-08',
    grossPay: 13200,
    netPay: 10350,
    deductions: 2500,
    benefits: 550,
    status: 'paid',
  },
];

const salaryRecords: SalaryRecord[] = [
  {
    id: '1',
    year: '2026',
    month: 'March',
    totalEarnings: 158000,
    totalDeductions: 35000,
    totalBenefits: 6000,
    netPay: 129000,
    bonus: 8500,
    tax: 12000,
  },
  {
    id: '2',
    year: '2026',
    month: 'February',
    totalEarnings: 155000,
    totalDeductions: 34000,
    totalBenefits: 6000,
    netPay: 127000,
    bonus: 8000,
    tax: 14000,
  },
  {
    id: '3',
    year: '2026',
    month: 'January',
    totalEarnings: 153000,
    totalDeductions: 33000,
    totalBenefits: 6000,
    netPay: 126000,
    bonus: 7500,
    tax: 13500,
  },
  {
    id: '4',
    year: '2025',
    month: 'December',
    totalEarnings: 148000,
    totalDeductions: 32000,
    totalBenefits: 6000,
    netPay: 122000,
    bonus: 10000,
    tax: 14000,
  },
];

const statusColors = {
  paid: '#10B981',
  pending: '#F59E0B',
  late: '#EF4444',
};

const leavePortal = () => {
  router.push('/leave');
};

export default function PayrollHistoryScreen() {
  const [activeTab, setActiveTab] = useState<'payslips' | 'salary-history'>('payslips');

  const paidPayslips = payslips.filter((p) => p.status === 'paid');
  const pendingPayslips = payslips.filter((p) => p.status === 'pending');

  const monthlyTotals = payslips.reduce((acc, payslip) => {
    const periodKey = payslip.period;
    if (!acc[periodKey]) {
      acc[periodKey] = 0;
    }
    acc[periodKey] += payslip.netPay;
    return acc;
  }, {} as Record<string, number>);

  const handleViewPayslip = (payslip: Payslip) => {
    Alert.alert(
      'Payslip Details',
      `Employee: ${payslip.employeeName}\n` +
        `Period: ${payslip.period}\n` +
        `Pay Date: ${payslip.payDate}\n` +
        `Gross Pay: $${payslip.grossPay}\n` +
        `Deductions: $${payslip.deductions}\n` +
        `Benefits: $${payslip.benefits}\n` +
        `Net Pay: $${payslip.netPay}`
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, padding: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <TouchableOpacity onPress={leavePortal}>
          <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 14 }}>Payroll Management</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            Payroll History
          </Text>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={{ padding: 20, backgroundColor: Colors.background, gap: 12, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#10B981', fontSize: 28, fontWeight: 'bold' }}>
              ${monthlyTotals['March 2026']?.toLocaleString() || 0}
            </Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>March Net Pay</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#3B82F6', fontSize: 28, fontWeight: 'bold' }}>
              {paidPayslips.length}
            </Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Paid Slips</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#F59E0B', fontSize: 28, fontWeight: 'bold' }}>
              {pendingPayslips.length}
            </Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ padding: 20, backgroundColor: Colors.card }}>
        <View style={{ flexDirection: 'row', backgroundColor: Colors.background, borderRadius: 8, padding: 4 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('payslips')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'payslips' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'payslips' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Payslip History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('salary-history')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'salary-history' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'salary-history' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Annual Summary
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payslip History */}
      {activeTab === 'payslips' && (
        <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
            Payslip History ({payslips.length})
          </Text>
          <View style={{ gap: 12 }}>
            {payslips.map((payslip) => (
              <TouchableOpacity
                key={payslip.id}
                onPress={() => handleViewPayslip(payslip)}
                style={{
                  backgroundColor: Colors.background,
                  padding: 16,
                  borderRadius: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>
                    {payslip.employeeName}
                  </Text>
                  <Text style={{ color: Colors.text70, fontSize: 11 }}>{payslip.period}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ color: '#10B981', fontSize: 18, fontWeight: 'bold' }}>
                    ${payslip.netPay?.toLocaleString() || '—'}
                  </Text>
                  <View
                    style={{
                      backgroundColor: `${statusColors[payslip.status]}20`,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: statusColors[payslip.status], fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>
                      {payslip.status}
                    </Text>
                  </View>
                  <Text style={{ color: Colors.text70, fontSize: 10 }}>{payslip.payDate}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Salary History Table */}
      {activeTab === 'salary-history' && (
        <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
            Salary Summary
          </Text>
          <View style={{ backgroundColor: Colors.background, borderRadius: 12, overflow: 'hidden' }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', backgroundColor: '#f9fafb', padding: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
              <Text style={{ flex: 1, color: Colors.text70, fontSize: 11, fontWeight: '600' }}>Month</Text>
              <Text style={{ flex: 1, color: Colors.text70, fontSize: 11, fontWeight: '600', textAlign: 'center' }}>Earnings</Text>
              <Text style={{ flex: 1, color: Colors.text70, fontSize: 11, fontWeight: '600', textAlign: 'center' }}>Deductions</Text>
              <Text style={{ flex: 1, color: Colors.text70, fontSize: 11, fontWeight: '600', textAlign: 'center' }}>Net Pay</Text>
            </View>
            {/* Rows */}
            {salaryRecords.map((record, idx) => (
              <View
                key={record.id}
                style={{
                  flexDirection: 'row',
                  padding: 12,
                  borderBottomWidth: idx === salaryRecords.length - 1 ? 0 : 1,
                  borderBottomColor: '#e5e7eb',
                }}
              >
                <Text style={{ flex: 1, color: Colors.text, fontSize: 12, fontWeight: '500' }}>
                  {record.year} {record.month}
                </Text>
                <Text style={{ flex: 1, color: Colors.text, fontSize: 12, textAlign: 'center', fontWeight: '500' }}>
                  ${record.totalEarnings.toLocaleString()}
                </Text>
                <Text style={{ flex: 1, color: Colors.text, fontSize: 12, textAlign: 'center', fontWeight: '500' }}>
                  ${(record.totalDeductions + record.tax).toLocaleString()}
                </Text>
                <Text style={{ flex: 1, color: '#10B981', fontSize: 12, textAlign: 'right', fontWeight: '600' }}>
                  ${record.netPay.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Payroll Actions */}
      <View style={{ padding: 20, gap: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>📤 Export All Payslips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.card,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#d1d5db',
          }}
        >
          <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>💰 View Payroll Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.card,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#d1d5db',
          }}
        >
          <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>📊 Payroll Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}