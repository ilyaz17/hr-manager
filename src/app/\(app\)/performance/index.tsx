import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface Review {
  id: string;
  employeeName: string;
  reviewerName: string;
  date: string;
  rating: number;
  status: 'pending' | 'completed' | 'archived';
  feedback: string;
}

const reviews: Review[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    reviewerName: 'Sarah Williams',
    date: '2026-04-01',
    rating: 4.5,
    status: 'completed',
    feedback: 'John has shown significant improvement in his leadership skills over the past quarter. Excellent teamwork and problem-solving abilities.',
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    reviewerName: 'Mike Johnson',
    date: '2026-03-28',
    rating: 4.0,
    status: 'completed',
    feedback: 'Strong technical skills and good project delivery. Should focus more on time management in future projects.',
  },
  {
    id: '3',
    employeeName: 'Tom Brown',
    reviewerName: 'Sarah Williams',
    date: '2026-03-25',
    rating: 3.5,
    status: 'completed',
    feedback: 'Good potential but needs more consistent performance. Communication skills could be improved.',
  },
  {
    id: '4',
    employeeName: 'Alice Davis',
    reviewerName: 'Mike Johnson',
    date: '2026-04-05',
    rating: 5.0,
    status: 'pending',
    feedback: 'Outstanding employee. consistently exceeds expectations and provides excellent mentorship to junior team members.',
  },
];

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return '#10B981';
  if (rating >= 4.0) return '#F59E0B';
  if (rating >= 3.0) return '#6366F1';
  return '#EF4444';
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return 'Completed';
    case 'pending': return 'Pending';
    case 'archived': return 'Archived';
    default: return status;
  }
};

export default function PerformanceReviewsScreen() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredReviews = reviews.filter((review) => {
    if (selectedTab === 'all') return true;
    return review.status === selectedTab;
  });

  const handleNewReview = () => {
    Alert.alert('New Review', 'Create a new performance review for an employee');
    router.push('/reviews/new');
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: 24 }}>
        Performance Reviews
      </Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: selectedTab === 'all' ? Colors.primary : Colors.card,
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
          }}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: selectedTab === 'all' ? Colors.white : Colors.textPrimary }}>
            All ({reviews.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: selectedTab === 'completed' ? Colors.primary : Colors.card,
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
          }}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: selectedTab === 'completed' ? Colors.white : Colors.textPrimary }}>
            Completed ({reviews.filter((r) => r.status === 'completed').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: selectedTab === 'pending' ? Colors.primary : Colors.card,
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
          }}
          onPress={() => setSelectedTab('pending')}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: selectedTab === 'pending' ? Colors.white : Colors.textPrimary }}>
            Pending ({reviews.filter((r) => r.status === 'pending').length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredReviews.map((review) => (
          <TouchableOpacity
            key={review.id}
            style={{
              backgroundColor: Colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
            onPress={() => router.push(`/reviews/${review.id}`)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 }}>
                  {review.employeeName}
                </Text>
                <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                  Reviewed by {review.reviewerName} • {review.date}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: `${getRatingColor(review.rating)}15`,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: getRatingColor(review.rating), fontSize: 14, fontWeight: '700' }}>
                  ⭐ {review.rating}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <View
                style={{
                  backgroundColor: `${getRatingColor(review.rating)}15`,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: getRatingColor(review.rating), fontSize: 11, fontWeight: '600' }}>
                  {getStatusText(review.status)}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 14, color: Colors.textSecondary, lineHeight: 20, numberOfLines: 3 }}>
              {review.feedback}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: Colors.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
        }}
        onPress={handleNewReview}
      >
        <Text style={{ fontSize: 24, color: Colors.white }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}