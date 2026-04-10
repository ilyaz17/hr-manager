import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface Goal {
  id: string;
  title: string;
  objective: string;
  category: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
  progress: number;
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface Milestone {
  id: string;
  goalId: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'delayed';
}

const goals: Goal[] = [
  {
    id: '1',
    title: 'Complete Project Alpha',
    objective: 'Launch the new e-commerce platform by Q2 2026',
    category: 'Work Projects',
    status: 'in-progress',
    progress: 65,
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Learn TypeScript Deep Dive',
    objective: 'Master advanced TypeScript patterns and best practices',
    category: 'Skills',
    status: 'in-progress',
    progress: 40,
    startDate: '2026-01-15',
    endDate: '2026-06-15',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Improve Code Quality',
    objective: 'Achieve 95% code coverage with comprehensive test suites',
    category: 'Quality',
    status: 'not-started',
    progress: 10,
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    priority: 'high',
  },
  {
    id: '4',
    title: 'Lead a Team Sprint',
    objective: 'Successfully lead a cross-functional sprint for 3 consecutive sprints',
    category: 'Leadership',
    status: 'completed',
    progress: 100,
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    priority: 'medium',
  },
];

const milestones: Milestone[] = [
  {
    id: '1',
    goalId: '1',
    description: 'Complete requirements analysis',
    dueDate: '2026-03-15',
    status: 'completed',
  },
  {
    id: '2',
    goalId: '1',
    description: 'Set up CI/CD pipeline',
    dueDate: '2026-04-01',
    status: 'completed',
  },
  {
    id: '3',
    goalId: '1',
    description: 'Develop core features (70%)',
    dueDate: '2026-05-15',
    status: 'completed',
  },
  {
    id: '4',
    goalId: '1',
    description: 'Conduct user testing',
    dueDate: '2026-06-10',
    status: 'pending',
  },
  {
    id: '5',
    goalId: '1',
    description: 'Final deployment',
    dueDate: '2026-06-30',
    status: 'pending',
  },
  {
    id: '6',
    goalId: '2',
    description: 'Complete intermediate course',
    dueDate: '2026-03-30',
    status: 'completed',
  },
  {
    id: '7',
    goalId: '2',
    description: 'Build practice projects',
    dueDate: '2026-05-15',
    status: 'in-progress',
  },
];

const statusColors = {
  'not-started': '#9CA3AF',
  'in-progress': '#3B82F6',
  completed: '#10B981',
  cancelled: '#EF4444',
};

const priorityColors = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
};

export default function GoalsScreen() {
  const [activeTab, setActiveTab] = useState<'goals' | 'milestones'>('goals');

  const activeGoals = goals.filter((goal) => goal.status !== 'cancelled');

  const inProgressGoals = goals.filter((goal) => goal.status === 'in-progress');
  const completedGoals = goals.filter((goal) => goal.status === 'completed');
  const notStartedGoals = goals.filter((goal) => goal.status === 'not-started');

  const leavePortal = () => {
    router.push('/leave');
  };

  const handleUpdateProgress = (goalId: string) => {
    Alert.alert('Update Progress', 'In a real app, this would open a modal to update goal progress.');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, padding: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <TouchableOpacity onPress={leavePortal}>
          <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 14 }}>OKR & Goals Tracking</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            Set & Track Goals
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={{ padding: 20, backgroundColor: Colors.background, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#3B82F6', fontSize: 28, fontWeight: 'bold' }}>{inProgressGoals.length}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>In Progress</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#10B981', fontSize: 28, fontWeight: 'bold' }}>{completedGoals.length}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Completed</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#9CA3AF', fontSize: 28, fontWeight: 'bold' }}>{notStartedGoals.length}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Not Started</Text>
          </View>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={{ padding: 20, backgroundColor: Colors.card }}>
        <View style={{ flexDirection: 'row', backgroundColor: Colors.background, borderRadius: 8, padding: 4 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('goals')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'goals' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'goals' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Objectives
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('milestones')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'milestones' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'milestones' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Milestones
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Goals */}
      {activeTab === 'goals' && (
        <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
            Active Objectives ({activeGoals.length})
          </Text>
          <View style={{ gap: 12 }}>
            {activeGoals.map((goal) => (
              <View key={goal.id} style={{ backgroundColor: Colors.background, padding: 16, borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 16 }}>
                    {goal.title}
                  </Text>
                  <View
                    style={{
                      backgroundColor: `${statusColors[goal.status]}20`,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: statusColors[goal.status], fontSize: 11, fontWeight: '600', textTransform: 'uppercase' }}>
                      {goal.status.replace('-', ' ')}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: Colors.text70, fontSize: 12, marginBottom: 12, lineHeight: 18 }}>
                  {goal.objective}
                </Text>
                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.text70, fontSize: 11 }}>{goal.startDate} → {goal.endDate}</Text>
                    <Text style={{ color: Colors.text, fontSize: 12, fontWeight: '600' }}>{goal.progress}%</Text>
                  </View>
                  <View style={{ height: 6, backgroundColor: '#e5e7eb', borderRadius: 3 }}>
                    <View
                      style={{
                        width: `${goal.progress}%`,
                        height: '100%',
                        backgroundColor: goal.status === 'completed' ? '#10B981' : '#3B82F6',
                        borderRadius: 3,
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
                    <View
                      style={{
                        backgroundColor: `${priorityColors[goal.priority]}20`,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: priorityColors[goal.priority], fontSize: 10, fontWeight: '600' }}>
                        {goal.priority.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={{ color: Colors.text70, fontSize: 11 }}>{goal.category}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Milestones */}
      {activeTab === 'milestones' && (
        <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
            Recent Milestones
          </Text>
          <View style={{ gap: 12 }}>
            {milestones.map((milestone) => {
              const goal = goals.find((g) => g.id === milestone.goalId);
              return (
                <View
                  key={milestone.id}
                  style={{
                    backgroundColor: Colors.background,
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>
                    {goal?.title}
                  </Text>
                  <Text style={{ color: Colors.text, fontSize: 13, marginTop: 4 }}>
                    {milestone.description}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text style={{ color: Colors.text70, fontSize: 11 }}>{milestone.dueDate}</Text>
                    <View
                      style={{
                        backgroundColor: milestone.status === 'completed' ? '#10B98120' : milestone.status === 'delayed' ? '#F59E0B20' : '#9CA3AF20',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: milestone.status === 'completed' ? '#10B981' : milestone.status === 'delayed' ? '#F59E0B' : '#9CA3AF',
                          fontSize: 10,
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {milestone.status}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Add Button */}
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
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>➕</Text>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>New Objective</Text>
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
          <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>📊 View Analytics</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}