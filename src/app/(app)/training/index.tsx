import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface TrainingCourse {
  id: string;
  title: string;
  instructor: string;
  status: 'enrolled' | 'completed' | 'in-progress' | 'not-enrolled';
  progress: number;
  startDate: string;
  endDate: string;
  certification: string | null;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  status: 'valid' | 'expiring-soon' | 'expired';
}

const courses: TrainingCourse[] = [
  {
    id: '1',
    title: 'Leadership Fundamentals',
    instructor: 'Sarah Williams',
    status: 'in-progress',
    progress: 65,
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    certification: null,
  },
  {
    id: '2',
    title: 'Safety Training',
    instructor: 'HR Department',
    status: 'completed',
    progress: 100,
    startDate: '2026-03-15',
    endDate: '2026-03-16',
    certification: 'Safety Certification',
  },
  {
    id: '3',
    title: 'Compliance Regulations',
    instructor: 'Legal Team',
    status: 'enrolled',
    progress: 0,
    startDate: '2026-04-10',
    endDate: '2026-05-10',
    certification: 'Compliance Certificate',
  },
  {
    id: '4',
    title: 'Technical Skills Workshop',
    instructor: 'Dev Team Lead',
    status: 'completed',
    progress: 100,
    startDate: '2026-02-01',
    endDate: '2026-02-05',
    certification: 'Technical Skills Certificate',
  },
];

const certifications: Certification[] = [
  {
    id: '1',
    name: 'Project Management Professional',
    issuer: 'PMI',
    issueDate: '2025-01-15',
    expiryDate: '2028-01-15',
    status: 'valid',
  },
  {
    id: '2',
    name: 'Agile Scrum Master',
    issuer: 'Scrum Alliance',
    issueDate: '2025-06-20',
    expiryDate: '2027-06-20',
    status: 'valid',
  },
  {
    id: '3',
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issueDate: '2024-03-10',
    expiryDate: '2027-03-10',
    status: 'expiring-soon',
  },
];

const statusColors = {
  enrolled: '#10B981',
  'in-progress': '#3B82F6',
  completed: '#8B5CF6',
  'not-enrolled': '#9CA3AF',
};

export default function TrainingScreen() {
  const [activeTab, setActiveTab] = useState<'courses' | 'certifications'>('courses');

  const activeCourses = courses.filter((c) => c.status !== 'not-enrolled');

  const enrolledCount = courses.filter((c) => c.status === 'enrolled').length;
  const completedCount = courses.filter((c) => c.status === 'completed').length;
  const inProgressCount = courses.filter((c) => c.status === 'in-progress').length;

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
          <Text style={{ color: '#fff', fontSize: 14 }}>Training & Development</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            Continue Learning
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={{ padding: 20, backgroundColor: Colors.background, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#10B981', fontSize: 28, fontWeight: 'bold' }}>{enrolledCount}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Enrolled</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#3B82F6', fontSize: 28, fontWeight: 'bold' }}>{inProgressCount}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>In Progress</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#8B5CF6', fontSize: 28, fontWeight: 'bold' }}>{completedCount}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={{ padding: 20, backgroundColor: Colors.card }}>
        <View style={{ flexDirection: 'row', backgroundColor: Colors.background, borderRadius: 8, padding: 4 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('courses')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'courses' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'courses' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Courses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('certifications')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: activeTab === 'certifications' ? Colors.primary : 'transparent',
            }}
          >
            <Text style={{ color: activeTab === 'certifications' ? '#fff' : '#6b7280', fontWeight: '600', fontSize: 14 }}>
              Certifications
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Courses */}
      {activeTab === 'courses' && (
        <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
            Active Courses
          </Text>
          <View style={{ gap: 12 }}>
            {activeCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={{
                  backgroundColor: Colors.background,
                  padding: 16,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: statusColors[course.status],
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 16 }}>
                    {course.title}
                  </Text>
                  <View style={{
                    backgroundColor: `${statusColors[course.status]}20`,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}>
                    <Text style={{ color: statusColors[course.status], fontSize: 11, fontWeight: '600', textTransform: 'uppercase' }}>
                      {course.status.replace('-', ' ')}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: Colors.text70, fontSize: 12, marginBottom: 8 }}>
                  Instructor: {course.instructor}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: Colors.text70, fontSize: 11 }}>
                    {course.startDate} → {course.endDate}
                  </Text>
                  <Text style={{ color: Colors.text, fontSize: 12, fontWeight: '600' }}>
                    {course.progress}%
                  </Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#e5e7eb', borderRadius: 3 }}>
                  <View
                    style={{
                      width: `${course.progress}%`,
                      height: '100%',
                      backgroundColor: course.status === 'completed' ? '#10B981' : '#3B82F6',
                      borderRadius: 3,
                    }}
                  />
                </View>
                {course.certification && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
                    <Text style={{ color: '#10B981', fontSize: 12 }}>✓</Text>
                    <Text style={{ color: '#10B981', fontSize: 12 }}>{course.certification}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Certifications */}
      {activeTab === 'certifications' && (
        <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
            Your Certifications
          </Text>
          <View style={{ gap: 12 }}>
            {certifications.map((cert) => (
              <View
                key={cert.id}
                style={{
                  backgroundColor: Colors.background,
                  padding: 16,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor:
                    cert.status === 'valid' ? '#10B981' : cert.status === 'expiring-soon' ? '#F59E0B' : '#EF4444',
                }}
              >
                <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 16 }}>
                  {cert.name}
                </Text>
                <Text style={{ color: Colors.text70, fontSize: 12, marginTop: 2 }}>
                  Issued by: {cert.issuer}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ color: Colors.text70, fontSize: 11 }}>
                    Issued: {cert.issueDate}
                  </Text>
                  {cert.expiryDate ? (
                    <Text
                      style={{
                        color: cert.status === 'valid' ? '#10B981' : cert.status === 'expiring-soon' ? '#F59E0B' : '#EF4444',
                        fontSize: 11,
                        fontWeight: '600',
                      }}
                    >
                      Expiry: {cert.expiryDate}
                    </Text>
                  ) : (
                    <Text style={{ color: '#8B5CF6', fontSize: 11, fontWeight: '600' }}>No Expiry</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

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
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Browse All Courses</Text>
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
            Request New Training
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}