import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../../constants/colors';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const markedDates = {
  '2026-04-01': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-02': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-03': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-04': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-05': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-06': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-07': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-08': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-09': { marked: true, dotColor: '#EF4444', selectedColor: '#EF444420' },
  '2026-04-10': { marked: true, dotColor: '#EF4444', selectedColor: '#EF444420' },
  '2026-04-11': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-12': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-13': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-14': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-15': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-16': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-17': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-18': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-19': { marked: true, dotColor: '#10B981', selectedColor: '#10B98120' },
  '2026-04-20': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-21': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-22': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-23': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-24': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-25': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-26': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-27': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-28': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-29': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
  '2026-04-30': { marked: true, dotColor: '#F59E0B', selectedColor: '#F59E0B20' },
};

const events = {
  '2026-04-15': [
    { title: 'John Doe - Annual Leave', color: '#10B981' },
    { title: 'Jane Smith - Sick Leave', color: '#F59E0B' },
  ],
  '2026-04-20': [
    { title: 'Mike Johnson - Personal Leave', color: '#F59E0B' },
  ],
};

export default function LeaveCalendarScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: 24 }}>
        Leave Calendar
      </Text>

      <Calendar
        markingType={'multi-dot'}
        markedDates={markedDates}
        theme={{
          todayTextColor: Colors.primary,
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: Colors.white,
          arrowColor: Colors.primary,
          monthTextColor: Colors.textPrimary,
          textSectionTitleColor: Colors.textSecondary,
          dayTextColor: Colors.textPrimary,
          textDisabledColor: Colors.border,
          selectedDotColor: Colors.white,
          todayDotColor: Colors.primary,
        }}
        style={{
          backgroundColor: Colors.card,
          borderRadius: 12,
          marginBottom: 24,
          overflow: 'hidden',
        }}
      />

      <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12 }}>
        Events on April 2026
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(events).map(([date, dayEvents]) => (
          <View key={date} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.primary, marginBottom: 8 }}>
              {date}
            </Text>
            {dayEvents.map((event, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: Colors.card,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: event.color,
                    marginRight: 12,
                  }}
                />
                <Text style={{ fontSize: 14, color: Colors.textPrimary, flex: 1 }}>
                  {event.title}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#10B981',
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 12, color: Colors.textSecondary }}>Approved</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#F59E0B',
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 12, color: Colors.textSecondary }}>Pending</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#EF4444',
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 12, color: Colors.textSecondary }}>Rejected</Text>
        </View>
      </View>
    </View>
  );
}