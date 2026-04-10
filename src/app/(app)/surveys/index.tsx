import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'upcoming' | 'active' | 'closed';
  dueDate: string;
  totalQuestions: number;
  completedCount: number;
  averageRating: number;
  type: 'pulse' | 'annual' | 'retention';
}

interface FeedbackItem {
  id: string;
  surveyId: string;
  employeeName: string;
  rating: number;
  comment: string;
  submittedAt: string;
  tags: string[];
}

interface Question {
  id: string;
  text: string;
  type: 'rating' | 'multiple-choice' | 'text';
  options?: string[];
}

const surveys: Survey[] = [
  {
    id: '1',
    title: 'Employee Pulse Survey',
    description: 'Quick check-in on overall satisfaction',
    category: 'Pulse Survey',
    status: 'active',
    dueDate: '2026-04-15',
    totalQuestions: 5,
    completedCount: 45,
    averageRating: 4.2,
    type: 'pulse',
  },
  {
    id: '2',
    title: 'Annual Satisfaction Survey',
    description: 'Comprehensive review of employment experience',
    category: 'Annual Survey',
    status: 'upcoming',
    dueDate: '2026-04-30',
    totalQuestions: 25,
    completedCount: 0,
    averageRating: 0,
    type: 'annual',
  },
  {
    id: '3',
    title: 'Work Culture Feedback',
    description: 'How would you rate our team culture?',
    category: 'Culture',
    status: 'closed',
    dueDate: '2026-03-31',
    totalQuestions: 10,
    completedCount: 78,
    averageRating: 4.5,
    type: 'retention',
  },
  {
    id: '4',
    title: 'Leadership Effectiveness',
    description: 'Share feedback about your managers',
    category: 'Leadership',
    status: 'closed',
    dueDate: '2026-03-15',
    totalQuestions: 8,
    completedCount: 52,
    averageRating: 4.0,
    type: 'retention',
  },
];

const feedback: FeedbackItem[] = [
  {
    id: '1',
    surveyId: '1',
    employeeName: 'John Doe',
    rating: 5,
    comment: 'Great team environment! I enjoy working here.',
    submittedAt: '2026-04-10',
    tags: ['positive', 'culture'],
  },
  {
    id: '2',
    surveyId: '1',
    employeeName: 'Jane Smith',
    rating: 4,
    comment: 'Overall good experience. Would like more training opportunities.',
    submittedAt: '2026-04-10',
    tags: ['constructive', 'training'],
  },
  {
    id: '3',
    surveyId: '3',
    employeeName: 'Bob Wilson',
    rating: 5,
    comment: 'Inclusive and supportive work culture. Love it!',
    submittedAt: '2026-03-28',
    tags: ['positive', 'inclusion'],
  },
];

const activeSurveys = surveys.filter((s) => s.status === 'active' || s.status === 'upcoming');

export default function SurveyScreen() {
  const [activeTab, setActiveTab] = useState<'surveys' | 'feedback'>('surveys');

  const completedSurveys = surveys.filter((s) => s.status === 'closed');

  const pulseSurveys = surveys.filter((s) => s.type === 'pulse');
  const annualSurveys = surveys.filter((s) => s.type === 'annual');
  const retentionSurveys = surveys.filter((s) => s.type === 'retention');

  const leavePortal = () => {
    router.push('/leave');
  };

  const handleSurveyStart = (survey: Survey) => {
    Alert.alert('Starting Survey', `Starting: ${survey.title}\n${survey.totalQuestions} questions`);
  };

  const handleSurveyResults = (survey: Survey) => {
    Alert.alert('Survey Results', `Results for: ${survey.title}\nAvg Rating: ${survey.averageRating}/5\nCompleted: ${survey.completedCount}/${survey.totalQuestions}`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, padding: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <TouchableOpacity onPress={leavePortal}>
          <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 14 }}>Employee Feedback</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            Surveys & Feedback
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={{ padding: 20, backgroundColor: Colors.background, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#F59E0B', fontSize: 28, fontWeight: 'bold' }}>{activeSurveys.length}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Active</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#10B981', fontSize: 28, fontWeight: 'bold' }}>{completedSurveys.length}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Completed</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#3B82F6', fontSize: 28, fontWeight: 'bold' }}>{surveys.reduce((acc, s) => acc + s.averageRating, 0) / surveys.length}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Avg Rating</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ padding: 20, backgroundColor: Colors.card }}>
        <View style={{ flexDirection: 'row', backgroundColor: Colors.background, borderRadius: 8, padding: 4 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('surveys')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'surveys' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'surveys' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Surveys
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('feedback')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'feedback' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'feedback' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Feedback
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Surveys */}
      {activeTab === 'surveys' && (
        <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
            Active Surveys ({activeSurveys.length})
          </Text>
          <View style={{ gap: 12 }}>
            {activeSurveys.map((survey) => {
              const progress = (survey.completedCount / survey.totalQuestions) * 100;
              return (
                <View key={survey.id} style={{ backgroundColor: Colors.background, padding: 16, borderRadius: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 15 }}>{survey.title}</Text>
                    <View
                      style={{
                        backgroundColor: `${survey.status === 'upcoming' ? '#F59E0B20' : '#10B98120'}`,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: survey.status === 'upcoming' ? '#F59E0B' : '#10B981',
                          fontSize: 10,
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {survey.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: Colors.text70, fontSize: 12, marginBottom: 12, lineHeight: 16 }}>
                    {survey.description}
                  </Text>
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: Colors.text70, fontSize: 11 }}>
                        Due: {survey.dueDate}
                      </Text>
                      <Text style={{ color: '#3B82F6', fontSize: 11, fontWeight: '600' }}>
                        {survey.completedCount}/{survey.totalQuestions} questions
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 4, marginBottom: 8 }}>
                      <View style={{ flex: 1, height: 6, backgroundColor: '#e5e7eb', borderRadius: 3 }}>
                        <View
                          style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: '#3B82F6',
                            borderRadius: 3,
                          }}
                        />
                      </View>
                      <Text style={{ color: '#3B82F6', fontSize: 11, fontWeight: '600', minWidth: 30 }}>
                        {Math.round(progress)}%
                      </Text>
                    </View>
                    <Text style={{ color: Colors.text70, fontSize: 11 }}>
                      Avg Rating: {survey.averageRating > 0 ? `${survey.averageRating}/5` : 'N/A'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                    <TouchableOpacity
                      onPress={() => handleSurveyStart(survey)}
                      style={{
                        flex: 1,
                        backgroundColor: '#3B82F6',
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Take Survey</Text>
                    </TouchableOpacity>
                    {survey.status === 'closed' && (
                      <TouchableOpacity
                        onPress={() => handleSurveyResults(survey)}
                        style={{
                          flex: 1,
                          backgroundColor: Colors.background,
                          padding: 12,
                          borderRadius: 8,
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: '#d1d5db',
                        }}
                      >
                        <Text style={{ color: Colors.text, fontSize: 13, fontWeight: '600' }}>View Results</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Recent Feedback */}
      {activeTab === 'feedback' && (
        <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
            Recent Feedback
          </Text>
          <View style={{ gap: 12 }}>
            {feedback.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: Colors.background,
                  padding: 16,
                  borderRadius: 12,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>{item.employeeName}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ color: '#F59E0B', fontSize: 16 }}>★</Text>
                    <Text style={{ color: '#F59E0B', fontSize: 14, fontWeight: 'bold' }}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={{ color: Colors.text, fontSize: 13, marginBottom: 8, lineHeight: 18 }}>
                  {item.comment}
                </Text>
                <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                  {item.tags.map((tag) => (
                    <View
                      key={tag}
                      style={{
                        backgroundColor: `${tag === 'positive' ? '#10B98120' : '#3B82F620'}`,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: tag === 'positive' ? '#10B981' : '#3B82F6', fontSize: 10, fontWeight: '600' }}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={{ color: Colors.text70, fontSize: 10, marginTop: 8 }}>
                  Submitted: {item.submittedAt}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Survey Types */}
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
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>➕ Create New Survey</Text>
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