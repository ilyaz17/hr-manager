import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useEmployees, Employee } from '../../../hooks/useEmployees';
import { Colors } from '../../../constants/colors';

export default function EmployeeListScreen() {
  const router = useRouter();
  const { employees, deleteEmployee } = useEmployees();
  const [search, setSearch] = useState('');

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (emp: Employee) => {
    Alert.alert('Delete Employee', `Remove ${emp.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEmployee(emp.id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={{
        backgroundColor: Colors.primary, paddingTop: 54,
        paddingBottom: 16, paddingHorizontal: 20,
      }}>
        <Text style={{ color: Colors.white, fontSize: 22, fontWeight: '800', marginBottom: 14 }}>Employees</Text>
        <TextInput
          style={{
            backgroundColor: Colors.white, borderRadius: Colors.radius,
            paddingHorizontal: 14, paddingVertical: 11,
            fontSize: 14, color: Colors.textPrimary,
          }}
          placeholder="Search by name, dept, designation..."
          placeholderTextColor={Colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>👥</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 15, fontWeight: '600' }}>No employees found</Text>
            <Text style={{ color: Colors.textLight, fontSize: 13, marginTop: 4 }}>Tap + to add your first employee</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: Colors.white, borderRadius: Colors.radius,
            padding: 14, marginBottom: 10,
            borderWidth: 1, borderColor: Colors.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 46, height: 46, borderRadius: 23,
                backgroundColor: Colors.primaryLight,
                alignItems: 'center', justifyContent: 'center', marginRight: 12,
              }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.primary }}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: Colors.textPrimary }}>{item.name}</Text>
                <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '600' }}>{item.designation}</Text>
                <Text style={{ fontSize: 12, color: Colors.textSecondary }}>{item.department} · {item.employmentType}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
              <TouchableOpacity
                onPress={() => router.push(`/(app)/employees/${item.id}`)}
                style={{
                  flex: 1, backgroundColor: Colors.primaryLight,
                  borderRadius: 8, paddingVertical: 8, alignItems: 'center',
                }}
              >
                <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 13 }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={{
                  flex: 1, backgroundColor: '#FFEBEE',
                  borderRadius: 8, paddingVertical: 8, alignItems: 'center',
                }}
              >
                <Text style={{ color: Colors.danger, fontWeight: '700', fontSize: 13 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push('/(app)/employees/add')}
        style={{
          position: 'absolute', bottom: 24, right: 20,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: Colors.primary,
          alignItems: 'center', justifyContent: 'center',
          shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
        }}
      >
        <Text style={{ color: Colors.white, fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
