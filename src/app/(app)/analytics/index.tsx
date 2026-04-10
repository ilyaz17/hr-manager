import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface KPI {
  id: string;
  title: string;
  value: string | number;
  change: number;
  unit: string;
  icon: string;
  color: string;
  description: string;
}

interface ChartData {
  month: string;
  value: number;
}

const kpis: KPI[] = [
  {
    id: '1',
    title: 'Total Employees',
    value: 156,
    change: 12,
    unit: '',
    icon: '👥',
    color: '#10B981',
    description: 'Active employees in the company',
  },
  {
    id: '2',
    title: 'Attendance Rate',
    value: 94,
    change: 3,
    unit: '%',
    icon: '✅',
    color: '#3B82F6',
    description: 'Average daily attendance',
  },
  {
    id: '3',
    title: 'Leave Utilization',
    value: 78,
    change: -5,
    unit: '%',
    icon: '🌴',
    color: '#F59E0B',
    description: 'Days taken vs available',
  },
  {
    id: '4',
    title: 'Turnover Rate',
    value: 8.5,
    change: -2.1,
    unit: '%',
    icon: '🔄',
    color: '#EF4444',
    description: 'Monthly employee turnover',
  },
  {
    id: '5',
    title: 'Training Completion',
    value: 91,
    change: 8,
    unit: '%',
    icon: '📚',
    color: '#8B5CF6',
    description: 'Employees completing training',
  },
  {
    id: '6',
    title: 'Employee Satisfaction',
    value: 4.2,
    change: 0.3,
    unit: '/5',
    icon: '⭐',
    color: '#EC4899',
    description: 'Average rating from surveys',
  },
];

const attendanceData: ChartData[] = [
  { month: 'Jan', value: 92 },
  { month: 'Feb', value: 94 },
  { month: 'Mar', value: 91 },
  { month: 'Apr', value: 95 },
  { month: 'May', value: 93 },
  { month: 'Jun', value: 94 },
];

const leaveData: ChartData[] = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 68 },
  { month: 'Apr', value: 75 },
  { month: 'May', value: 78 },
  { month: 'Jun', value: 80 },
];

const leavePortal = () => {
  router.push('/leave');
};

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'leave'>('overview');

  const leavePortal = () => {
    router.push('/leave');
  };

  const renderKPI = (kpi: KPI) => (
    <View key={kpi.id} style={{ backgroundColor: Colors.card, padding: 16, borderRadius: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: `${kpi.color}20`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: kpi.color, fontSize: 20 }}>{kpi.icon}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: kpi.change >= 0 ? '#10B98120' : '#EF444420',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}
        >
          <Text
            style={{
              color: kpi.change >= 0 ? '#10B981' : '#EF4444',
              fontSize: 10,
              fontWeight: '600',
            }}
          >
            {kpi.change >= 0 ? '+' : ''}{kpi.change}
          </Text>
          <Text style={{ color: kpi.change >= 0 ? '#10B981' : '#EF4444', fontSize: 10, marginLeft: 2 }}>
            %
          </Text>
        </View>
      </View>
      <Text style={{ color: Colors.text70, fontSize: 12 }}>{kpi.title}</Text>
      <Text style={{ color: Colors.text, fontSize: 28, fontWeight: 'bold', marginTop: 4 }}>
        {kpi.value}
        {kpi.unit && <Text style={{ fontSize: 16, fontWeight: 'normal' }}>{kpi.unit}</Text>}
      </Text>
      <Text style={{ color: Colors.text70, fontSize: 10, marginTop: 4 }}>{kpi.description}</Text>
    </View>
  );

  const drawSimpleBarChart = (data: ChartData[], color: string, title: string) => (
    <View style={{ backgroundColor: Colors.card, padding: 20, borderRadius: 16 }}>
      <Text style={{ color: Colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>{title}</Text>
      <View style={{ height: 200, justifyContent: 'flex-end', gap: 16 }}>
        {data.map((item, idx) => {
          const maxValue = Math.max(...data.map((d) => d.value));
          const height = (item.value / maxValue) * 150;
          return (
            <View key={idx} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Text style={{ color: Colors.text70, fontSize: 11, width: 30 }}>{item.month}</Text>
                <Text style={{ color: Colors.text, fontSize: 11, width: 40, textAlign: 'right' }}>
                  {item.value}
                </Text>
              </View>
              <View
                style={{
                  height: 12,
                  backgroundColor: '#e5e7eb',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    backgroundColor: color,
                    width: `${(item.value / maxValue) * 100}%`,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, padding: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <TouchableOpacity onPress={leavePortal}>
          <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 14 }}>Analytics Dashboard</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            HR Analytics
          </Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={{ padding: 20, backgroundColor: Colors.background }}>
        <View style={{ flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 8, padding: 4 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('overview')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'overview' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'overview' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('attendance')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'attendance' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'attendance' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Attendance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('leave')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'leave' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'leave' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Leave
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overview KPIs */}
      {activeTab === 'overview' && (
        <View style={{ padding: 20, backgroundColor: Colors.background, gap: 12, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text }}>Key Performance Indicators</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {kpis.map((kpi) => (
              <View key={kpi.id} style={{ width: '48%' }}>
                {renderKPI(kpi)}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Attendance Chart */}
      {activeTab === 'attendance' && (
        <View style={{ padding: 20, backgroundColor: Colors.background, marginBottom: 20 }}>
          {drawSimpleBarChart(attendanceData, '#3B82F6', 'Attendance Rate (Last 6 Months)')}
        </View>
      )}

      {/* Leave Chart */}
      {activeTab === 'leave' && (
        <View style={{ padding: 20, backgroundColor: Colors.background, marginBottom: 20 }}>
          {drawSimpleBarChart(leaveData, '#F59E0B', 'Leave Utilization (Last 6 Months)')}
        </View>
      )}

      {/* Quick Stats */}
      <View style={{ padding: 20, gap: 12 }}>
        <View style={{ backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: Colors.text70, fontSize: 12 }}>Days Off This Month</Text>
              <Text style={{ color: Colors.text, fontSize: 24, fontWeight: 'bold' }}>45</Text>
            </View>
            <View
              style={{
                backgroundColor: '#10B98120',
                padding: 12,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#10B981', fontSize: 24 }}>📅</Text>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: Colors.text70, fontSize: 12 }}>Training Completed</Text>
              <Text style={{ color: Colors.text, fontSize: 24, fontWeight: 'bold' }}>89</Text>
            </View>
            <View
              style={{
                backgroundColor: '#8B5CF620',
                padding: 12,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#8B5CF6', fontSize: 24 }}>📚</Text>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: Colors.text70, fontSize: 12 }}>Pending Reviews</Text>
              <Text style={{ color: Colors.text, fontSize: 24, fontWeight: 'bold' }}>23</Text>
            </View>
            <View
              style={{
                backgroundColor: '#F59E0B20',
                padding: 12,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#F59E0B', fontSize: 24 }}>⭐</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Export Button */}
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
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>📊 Export Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}