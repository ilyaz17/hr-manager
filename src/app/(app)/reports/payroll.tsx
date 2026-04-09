import { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Modal, ScrollView, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEmployees } from '../../../hooks/useEmployees';
import { usePayroll } from '../../../hooks/usePayroll';
import { Colors } from '../../../constants/colors';

const MONTHS = [
  '2025-01','2025-02','2025-03','2025-04','2025-05','2025-06',
  '2025-07','2025-08','2025-09','2025-10','2025-11','2025-12',
  '2026-01','2026-02','2026-03','2026-04',
];

function currency(val: number) {
  return `\u20B9${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

export default function PayrollReportScreen() {
  const router = useRouter();
  const { employees } = useEmployees();
  const { records, generateFromEmployee } = usePayroll();
  const [modal, setModal] = useState(false);
  const [selMonth, setSelMonth] = useState(new Date().toISOString().slice(0, 7));
  const currentMonth = new Date().toISOString().slice(0, 7);

  const filtered = records.filter((r) => r.month === selMonth);
  const totalNet = filtered.reduce((acc, r) => acc + r.netSalary, 0);

  const handleGenerate = () => {
    employees.forEach((emp) => generateFromEmployee(emp, selMonth));
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
          <Text style={{ color: Colors.white, fontSize: 20, fontWeight: '800' }}>Payroll</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModal(true)}
          style={{ backgroundColor: Colors.secondary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}
        >
          <Text style={{ color: Colors.primaryDark, fontWeight: '700', fontSize: 13 }}>Generate</Text>
        </TouchableOpacity>
      </View>

      {/* Month selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}>
        {MONTHS.map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setSelMonth(m)}
            style={{
              borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
              backgroundColor: selMonth === m ? Colors.primary : Colors.white,
              borderWidth: 1, borderColor: selMonth === m ? Colors.primary : Colors.border,
            }}
          >
            <Text style={{ color: selMonth === m ? Colors.white : Colors.textSecondary, fontWeight: '600', fontSize: 13 }}>{m}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Summary bar */}
      {filtered.length > 0 && (
        <View style={{ marginHorizontal: 12, marginBottom: 8, backgroundColor: '#EDE7F6', borderRadius: Colors.radius, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#4527A0', fontWeight: '700', fontSize: 14 }}>{filtered.length} employees</Text>
          <Text style={{ color: '#4527A0', fontWeight: '800', fontSize: 15 }}>Total: {currency(totalNet)}</Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 36, marginBottom: 10 }}>💰</Text>
            <Text style={{ color: Colors.textSecondary, fontWeight: '600' }}>No payroll for {selMonth}</Text>
            <Text style={{ color: Colors.textLight, fontSize: 13, marginTop: 4 }}>Tap Generate to create payroll</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: Colors.white, borderRadius: Colors.radius,
            padding: 14, marginBottom: 8,
            borderWidth: 1, borderColor: Colors.border,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <View>
                <Text style={{ fontWeight: '700', color: Colors.textPrimary, fontSize: 15 }}>{item.employeeName}</Text>
                <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{item.designation}</Text>
              </View>
              <View style={{ backgroundColor: '#EDE7F6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                <Text style={{ color: '#4527A0', fontWeight: '800', fontSize: 14 }}>{currency(item.netSalary)}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: Colors.textLight, fontSize: 11, marginBottom: 2 }}>Basic</Text>
                <Text style={{ color: Colors.textPrimary, fontWeight: '600', fontSize: 13 }}>{currency(item.basicSalary)}</Text>
              </View>
              <View style={{ width: 1, backgroundColor: Colors.border }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: Colors.textLight, fontSize: 11, marginBottom: 2 }}>Allowance</Text>
                <Text style={{ color: '#388E3C', fontWeight: '600', fontSize: 13 }}>+{currency(item.allowance)}</Text>
              </View>
              <View style={{ width: 1, backgroundColor: Colors.border }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: Colors.textLight, fontSize: 11, marginBottom: 2 }}>Deduction</Text>
                <Text style={{ color: Colors.danger, fontWeight: '600', fontSize: 13 }}>-{currency(item.deduction)}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Generate Modal */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 }}>Generate Payroll</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 16 }}>This will create payroll records for all {employees.length} employees for the selected month.</Text>

            <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' }}>Select Month</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {MONTHS.map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setSelMonth(m)}
                  style={{
                    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
                    backgroundColor: selMonth === m ? Colors.primary : Colors.background,
                    borderWidth: 1, borderColor: selMonth === m ? Colors.primary : Colors.border,
                  }}
                >
                  <Text style={{ color: selMonth === m ? Colors.white : Colors.textSecondary, fontWeight: '600', fontSize: 13 }}>{m}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{ flex: 1, borderRadius: Colors.radius, borderWidth: 1.5, borderColor: Colors.border, paddingVertical: 13, alignItems: 'center' }}
              >
                <Text style={{ color: Colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGenerate}
                style={{ flex: 1, borderRadius: Colors.radius, backgroundColor: Colors.primary, paddingVertical: 13, alignItems: 'center' }}
              >
                <Text style={{ color: Colors.white, fontWeight: '700' }}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
