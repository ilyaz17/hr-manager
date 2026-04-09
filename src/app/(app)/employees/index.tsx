import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useEmployees, Employee } from '../../../hooks/useEmployees';

export default function EmployeeListScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { employees, deleteEmployee } = useEmployees();

  const handleDelete = (emp: Employee) => {
    Alert.alert(
      'Delete Employee',
      `Remove ${emp.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEmployee(emp.id),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-900">Hello, {user?.username}</Text>
        <TouchableOpacity onPress={logout}>
          <Text className="text-sm text-red-500 font-medium">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          <View className="items-center mt-24">
            <Text className="text-gray-400 text-base">No employees yet.</Text>
            <Text className="text-gray-400 text-sm">Tap + to add one.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                <Text className="text-sm text-blue-600">{item.role}</Text>
                <Text className="text-xs text-gray-500 mt-1">{item.department}</Text>
                <Text className="text-xs text-gray-400">{item.email}</Text>
              </View>
              <View className="flex-row gap-3 ml-4">
                <TouchableOpacity
                  className="bg-blue-50 px-3 py-1.5 rounded-lg"
                  onPress={() => router.push(`/(app)/employees/${item.id}`)}
                >
                  <Text className="text-xs text-blue-600 font-medium">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-50 px-3 py-1.5 rounded-lg"
                  onPress={() => handleDelete(item)}
                >
                  <Text className="text-xs text-red-500 font-medium">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/(app)/employees/add')}
      >
        <Text className="text-white text-3xl leading-none">+</Text>
      </TouchableOpacity>
    </View>
  );
}
