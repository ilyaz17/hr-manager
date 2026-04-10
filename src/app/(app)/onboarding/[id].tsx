import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  completedAt?: string;
}

interface OnboardingData {
  employeeName: string;
  department: string;
  joinDate: string;
  position: string;
  checklist: ChecklistItem[];
}

const checklistItems: ChecklistItem[] = [
  { id: '1', task: 'Complete employment contract', completed: true, completedAt: '2026-04-01' },
  { id: '2', task: 'Set up email account', completed: true, completedAt: '2026-04-01' },
  { id: '3', task: 'Set up payroll account', completed: true, completedAt: '2026-04-01' },
  { id: '4', task: 'Complete HR orientation', completed: false, completedAt: undefined },
  { id: '5', task: 'Complete security training', completed: false, completedAt: undefined },
  { id: '6', task: 'Complete compliance training', completed: false, completedAt: undefined },
  { id: '7', task: 'Set up bank account integration', completed: false, completedAt: undefined },
  { id: '8', task: 'Review company policies', completed: false, completedAt: undefined },
];

const onboardingData: OnboardingData = {
  employeeName: 'John Doe',
  department: 'Engineering',
  joinDate: '2026-04-01',
  position: 'Senior Developer',
  checklist: checklistItems,
};

export default function OnboardingDetail() {
  const { employeeId } = useLocalSearchParams();

  const pendingItems = onboardingData.checklist.filter((item) => !item.completed);
  const progress = ((onboardingData.checklist.length - pendingItems.length) / onboardingData.checklist.length) * 100;

  const toggleItem = (id: string) => {
    const updatedItems = onboardingData.checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed, completedAt: !item.completed ? new Date().toISOString() : undefined } : item
    );
    // In a real app, this would update the database
    console.log('Updated checklist:', updatedItems);
  };

  const leavePortal = () => {
    router.push('/leave');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, padding: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <TouchableOpacity onPress={leavePortal}>
          <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 14 }}>Employee Onboarding</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            {onboardingData.employeeName}
          </Text>
          <Text style={{ color: '#fff', opacity: 0.9, marginTop: 4 }}>
            {onboardingData.department} • {onboardingData.position}
          </Text>
        </View>
      </View>

      {/* Progress Card */}
      <View style={{ padding: 20, backgroundColor: Colors.background }}>
        <View style={{ backgroundColor: '#10B98120', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#10B981' }}>
          <Text style={{ fontSize: 12, color: '#10B981', fontWeight: 'bold', marginBottom: 4 }}>
            ONBOARDING PROGRESS
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#10B981' }}>
              {Math.round(progress)}%
            </Text>
            <View style={{ flex: 1, height: 8, backgroundColor: '#10B98110', borderRadius: 4 }}>
              <View
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#10B981',
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
          <Text style={{ fontSize: 12, color: '#10B98170', marginTop: 4 }}>
            {onboardingData.checklist.length - pendingItems.length} of {onboardingData.checklist.length} tasks completed
          </Text>
        </View>
      </View>

      {/* Employee Info */}
      <View style={{ padding: 20, backgroundColor: Colors.card }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Employee Information
        </Text>
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: Colors.text70 }}>Department</Text>
            <Text style={{ color: Colors.text, fontWeight: '500' }}>{onboardingData.department}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: Colors.text70 }}>Position</Text>
            <Text style={{ color: Colors.text, fontWeight: '500' }}>{onboardingData.position}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: Colors.text70 }}>Join Date</Text>
            <Text style={{ color: Colors.text, fontWeight: '500' }}>{onboardingData.joinDate}</Text>
          </View>
        </View>
      </View>

      {/* Checklist */}
      <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Onboarding Checklist
        </Text>
        <View style={{ gap: 12 }}>
          {onboardingData.checklist.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleItem(item.id)}
              style={{
                backgroundColor: item.completed ? '#10B98110' : '#f3f4f6',
                padding: 16,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: item.completed ? '#10B981' : '#d1d5db',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.completed && <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: item.completed ? '#10B98170' : '#6b7280',
                    fontSize: 16,
                    textDecorationLine: item.completed ? 'line-through' : 'none',
                  }}
                >
                  {item.task}
                </Text>
                {item.completedAt && <Text style={{ fontSize: 11, color: '#10B98150', marginTop: 2 }}>Completed: {item.completedAt.split('T')[0]}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={{ padding: 20, gap: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
            Request Leave
          </Text>
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
          <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>
            Contact HR Support
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}