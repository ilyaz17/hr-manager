import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/ThemeProvider';
import * as Notifications from 'expo-notifications';
import { Colors } from '../../constants/colors';
import { getNotificationStatus, saveNotificationSettings, updateNotificationPreference } from '../../services/notificationService';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationSettings() {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    { id: 'leave_approval', title: 'Leave Approval', description: 'Get notified when leave requests are approved/denied', enabled: true },
    { id: 'payslip_available', title: 'Payslip Available', description: 'Notify when new payslips are generated', enabled: true },
    { id: 'performance_review', title: 'Performance Reviews', description: 'Alert about performance review schedules', enabled: true },
    { id: 'attendance_reminder', title: 'Attendance Reminder', description: 'Daily reminder to clock in/out', enabled: true },
    { id: 'urgent_updates', title: 'Urgent Updates', description: 'Priority notifications from HR', enabled: true },
  ]);

  useEffect(() => {
    requestPermission();
    loadPreferences();
  }, []);

  const requestPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      
      if (status === 'granted') {
        setNotificationsEnabled(true);
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: "7c72a518-d2c0-4b7d-8753-93c8dc0020f0",
        });
        console.log('Push token:', token.data);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const saved = getNotificationStatus();
      if (saved) {
        setPreferences(saved);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const handleToggle = (preferenceId: string) => {
    const updated = preferences.map(pref =>
      pref.id === preferenceId ? { ...pref, enabled: !pref.enabled } : pref
    );
    setPreferences(updated);
    updateNotificationStatus(preferences[preferences.findIndex(p => p.id === preferenceId)]);
  };

  const updateNotificationStatus = (preference: NotificationPreference) => {
    try {
      saveNotificationSettings(preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const handleEnableAll = () => {
    setPreferences(preferences.map(p => ({ ...p, enabled: true })));
    updateNotificationStatus(preferences[0]);
  };

  const handleDisableAll = () => {
    setPreferences(preferences.map(p => ({ ...p, enabled: false })));
    updateNotificationSettings(preferences[0]);
  };

  const renderPreference = (preference: NotificationPreference) => (
    <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
            {preference.title}
          </Text>
          <Text style={{ fontSize: 14, color: colors.secondaryText }}>
            {preference.description}
          </Text>
        </View>
        <Switch
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={preference.enabled ? colors.primary : colors.border}
          value={preference.enabled}
          onValueChange={() => handleToggle(preference.id)}
        />
      </View>
    </View>
  );

  if (!permissionGranted) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 10 }}>
          Notifications Permission Required
        </Text>
        <Text style={{ fontSize: 14, textAlign: 'center', color: colors.secondaryText, marginBottom: 20 }}>
          Please enable notifications to receive important updates from the HR system
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          onPress={requestPermission}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            Enable Notifications
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: 50, backgroundColor: colors.card, paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>
          Notifications
        </Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginVertical: 20 }}>
          Notification Settings
        </Text>

        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Global Notifications
              </Text>
              <Text style={{ fontSize: 14, color: colors.secondaryText }}>
                Turn on or off all notifications
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={notificationsEnabled ? colors.primary : colors.border}
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 10 }}
            onPress={handleEnableAll}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Enable All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: colors.border, padding: 12, borderRadius: 8, alignItems: 'center', marginLeft: 10 }}
            onPress={handleDisableAll}
          >
            <Text style={{ color: colors.text, fontWeight: '600' }}>Disable All</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10 }}>
          Notification Types
        </Text>

        {preferences.map(preference => (
          <View key={preference.id}>{renderPreference(preference)}</View>
        ))}

        <View style={{ backgroundColor: colors.border, padding: 16, borderRadius: 12, margin: 20 }}>
          <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '600', marginBottom: 8 }}>
            ℹ️ How Notifications Work
          </Text>
          <Text style={{ fontSize: 13, color: colors.secondaryText, lineHeight: 20 }}>
            Push notifications will alert you about important HR events like leave approvals,
            new payslips, and performance reviews. You can customize which types of
            notifications you want to receive.
          </Text>
        </View>

        <View style={{ marginBottom: 40 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 10 }}>
            Notification Sound
          </Text>
          <Switch
            trackColor={{ false: colors.border, true: colors.primary + '40' }}
            thumbColor={notificationsEnabled ? colors.primary : colors.border}
            value={true}
            onValueChange={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
}
