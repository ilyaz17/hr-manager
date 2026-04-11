import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StatusBar, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEmployees, Employee } from '../../../hooks/useEmployees';
import { Colors } from '../../../constants/colors';

export default function EmployeeListScreen() {
  const router = useRouter();
  const { employees, deleteEmployee } = useEmployees();
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const departments = ['All', 'Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];
  const employmentTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Intern'];

  const filtered = employees.filter(
    (e) => {
      const matchesSearch = 
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.designation.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'All' || e.department === selectedDepartment;
      const matchesEmploymentType = selectedEmploymentType === 'All' || e.employmentType === selectedEmploymentType;
      
      return matchesSearch && matchesDepartment && matchesEmploymentType;
    }
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ color: Colors.white, fontSize: 22, fontWeight: '800', flex: 1 }}>Employees</Text>
          <TouchableOpacity 
            onPress={() => setShowFilters(!showFilters)}
            style={{ padding: 8 }}
          >
            <Text style={{ color: Colors.white, fontSize: 18 }}>🔍</Text>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
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
        
        {/* Active Filters Summary */}
        {(selectedDepartment !== 'All' || selectedEmploymentType !== 'All' || search !== '') && (
          <View style={{ 
            flexDirection: 'row', alignItems: 'center', marginTop: 8,
            backgroundColor: Colors.primaryLight, borderRadius: Colors.radius,
            paddingHorizontal: 8, paddingVertical: 4
          }}>
            <Text style={{ color: Colors.primary, fontSize: 12, marginRight: 6 }}>
              {selectedDepartment !== 'All' && `${selectedDepartment} `}
              {selectedEmploymentType !== 'All' && `${selectedEmploymentType} `}
              {search !== '' && `Search: "${search}"`}
            </Text>
            <TouchableOpacity onPress={() => { setSearch(''); setSelectedDepartment('All'); setSelectedEmploymentType('All'); }}>
              <Text style={{ color: Colors.primary, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Filters Modal */}
      <Modal visible={showFilters} animationType="slide">
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <View style={{
            backgroundColor: Colors.primary, paddingTop: 54,
            paddingBottom: 16, paddingHorizontal: 20,
          }}>
            <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '600', marginBottom: 16 }}>
              Filter Employees
            </Text>
            
            <Text style={{ color: Colors.white, fontSize: 14, marginBottom: 8 }}>Department</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {departments.map(dept => (
                <TouchableOpacity
                  key={dept}
                  onPress={() => setSelectedDepartment(dept)}
                  style={{
                    backgroundColor: selectedDepartment === dept ? Colors.white : Colors.primaryDark,
                    paddingHorizontal: 12, paddingVertical: 8,
                    borderRadius: 20, marginRight: 8
                  }}
                >
                  <Text style={{ color: selectedDepartment === dept ? Colors.primary : Colors.white }}>
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={{ color: Colors.white, fontSize: 14, marginBottom: 8 }}>Employment Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {employmentTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedEmploymentType(type)}
                  style={{
                    backgroundColor: selectedEmploymentType === type ? Colors.white : Colors.primaryDark,
                    paddingHorizontal: 12, paddingVertical: 8,
                    borderRadius: 20, marginRight: 8
                  }}
                >
                  <Text style={{ color: selectedEmploymentType === type ? Colors.primary : Colors.white }}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              style={{
                backgroundColor: Colors.primary, borderRadius: Colors.radius,
                paddingVertical: 14, alignItems: 'center'
              }}
            >
              <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '600' }}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>👥</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 15, fontWeight: '600' }}>
              {filtered.length === 0 ? 'No employees found' : 'No employees match your filters'}
            </Text>
            <Text style={{ color: Colors.textLight, fontSize: 13, marginTop: 4 }}>
              {filtered.length === 0 ? 'Tap + to add your first employee' : 'Try adjusting your filters'}
            </Text>
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
                <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '600' }}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={{
                  flex: 1, backgroundColor: Colors.secondaryLight,
                  borderRadius: 8, paddingVertical: 8, alignItems: 'center',
                }}
              >
                <Text style={{ color: Colors.secondary, fontSize: 14, fontWeight: '600' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}