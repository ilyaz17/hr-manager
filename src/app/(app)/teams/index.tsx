import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  location: string;
  color: string;
}

interface Team {
  id: string;
  departmentId: string;
  name: string;
  lead: string;
  memberCount: number;
  isActive: boolean;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  team: string;
  avatar: string;
}

const departments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    manager: 'John Anderson',
    employeeCount: 24,
    location: 'New York',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Marketing',
    manager: 'Sarah Williams',
    employeeCount: 18,
    location: 'London',
    color: '#F59E0B',
  },
  {
    id: '3',
    name: 'Sales',
    manager: 'Mike Johnson',
    employeeCount: 32,
    location: 'San Francisco',
    color: '#10B981',
  },
  {
    id: '4',
    name: 'HR',
    manager: 'Emily Davis',
    employeeCount: 8,
    location: 'New York',
    color: '#8B5CF6',
  },
  {
    id: '5',
    name: 'Finance',
    manager: 'David Brown',
    employeeCount: 12,
    location: 'New York',
    color: '#EF4444',
  },
];

const teams: Team[] = [
  {
    id: '1',
    departmentId: '1',
    name: 'Frontend Team',
    lead: 'Alex Turner',
    memberCount: 10,
    isActive: true,
  },
  {
    id: '2',
    departmentId: '1',
    name: 'Backend Team',
    lead: 'Chris Martin',
    memberCount: 8,
    isActive: true,
  },
  {
    id: '3',
    departmentId: '1',
    name: 'DevOps Team',
    lead: 'Tom Wilson',
    memberCount: 6,
    isActive: true,
  },
  {
    id: '4',
    departmentId: '2',
    name: 'Digital Marketing',
    lead: 'Lisa Anderson',
    memberCount: 8,
    isActive: true,
  },
  {
    id: '5',
    departmentId: '2',
    name: 'Content Team',
    lead: 'Nick Moore',
    memberCount: 6,
    isActive: true,
  },
];

const employees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Senior Developer',
    department: 'Engineering',
    team: 'Frontend Team',
    avatar: 'JD',
  },
  {
    id: '2',
    name: 'Jane Smith',
    position: 'UX Designer',
    department: 'Engineering',
    team: 'Frontend Team',
    avatar: 'JS',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    position: 'Product Manager',
    department: 'Marketing',
    team: 'Digital Marketing',
    avatar: 'BW',
  },
  {
    id: '4',
    name: 'Alice Brown',
    position: 'Marketing Specialist',
    department: 'Marketing',
    team: 'Digital Marketing',
    avatar: 'AB',
  },
  {
    id: '5',
    name: 'Charlie Davis',
    position: 'Sales Executive',
    department: 'Sales',
    team: 'Enterprise Sales',
    avatar: 'CD',
  },
];

export default function TeamStructureScreen() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const leavePortal = () => {
    router.push('/leave');
  };

  const handleDepartmentTap = (dept: Department) => {
    setSelectedDepartment(dept);
    setShowEmployeeModal(true);
  };

  const handleTeamTap = (team: Team) => {
    // In a real app, show team details
    Alert.alert('Team Details', `${team.name} - ${team.memberCount} members`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, padding: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <TouchableOpacity onPress={leavePortal}>
          <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 14 }}>Team Structure</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            Departments & Teams
          </Text>
        </View>
      </View>

      {/* Departments Grid */}
      <View style={{ padding: 20, backgroundColor: Colors.background }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Departments
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {departments.map((dept) => (
            <TouchableOpacity
              key={dept.id}
              onPress={() => handleDepartmentTap(dept)}
              style={{
                backgroundColor: Colors.card,
                padding: 20,
                borderRadius: 16,
                width: 160,
                alignItems: 'center',
                gap: 12,
                borderLeftWidth: 4,
                borderLeftColor: dept.color,
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: `${dept.color}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 24 }}>{dept.name.charAt(0)}</Text>
              </View>
              <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 15 }}>{dept.name}</Text>
              <Text style={{ color: Colors.text70, fontSize: 12 }}>{dept.employeeCount} Employees</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Teams List */}
      <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Teams Overview
        </Text>
        <View style={{ gap: 12 }}>
          {teams.map((team) => {
            const dept = departments.find((d) => d.id === team.departmentId);
            return (
              <TouchableOpacity
                key={team.id}
                onPress={() => handleTeamTap(team)}
                style={{
                  backgroundColor: Colors.background,
                  padding: 16,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: `${dept?.color || '#6b7280'}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: dept?.color || '#6b7280', fontSize: 18, fontWeight: 'bold' }}>
                    {team.name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 15 }}>{team.name}</Text>
                  <Text style={{ color: Colors.text70, fontSize: 12 }}>
                    {dept?.name} • Lead: {team.lead}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: '#10B981', fontSize: 16, fontWeight: 'bold' }}>{team.memberCount}</Text>
                  <Text style={{ color: Colors.text70, fontSize: 11 }}>Members</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Organization Chart Preview */}
      <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Organization Chart
        </Text>
        <View style={{ backgroundColor: Colors.background, padding: 16, borderRadius: 12, alignItems: 'center' }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#10B98120',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ color: '#10B981', fontSize: 24, fontWeight: 'bold' }}>CEO</Text>
          </View>
          <Text style={{ color: '#10B981', fontSize: 14, fontWeight: '600', marginBottom: 20 }}>
            CEO Office
          </Text>
          <View style={{ gap: 8, marginBottom: 12 }}>
            {departments.slice(0, 3).map((dept, idx) => (
              <View key={dept.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${dept.color}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: dept.color, fontSize: 16, fontWeight: 'bold' }}>{dept.name.charAt(0)}</Text>
                </View>
                <Text style={{ color: Colors.text, fontSize: 14 }}>{dept.name}</Text>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>({dept.employeeCount})</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={{ padding: 20, gap: 12 }}>
        <View style={{ backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
          <Text style={{ color: Colors.text70, fontSize: 12 }}>Total Employees</Text>
          <Text style={{ color: Colors.text, fontSize: 32, fontWeight: 'bold' }}>156</Text>
        </View>
        <View style={{ backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
          <Text style={{ color: Colors.text70, fontSize: 12 }}>Total Departments</Text>
          <Text style={{ color: Colors.text, fontSize: 32, fontWeight: 'bold' }}>{departments.length}</Text>
        </View>
        <View style={{ backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
          <Text style={{ color: Colors.text70, fontSize: 12 }}>Total Teams</Text>
          <Text style={{ color: Colors.text, fontSize: 32, fontWeight: 'bold' }}>{teams.length}</Text>
        </View>
      </View>

      {/* Add Team Button */}
      <View style={{ padding: 20 }}>
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
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>➕ Add New Team</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}