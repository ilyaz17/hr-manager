import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  avatar: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'push' | 'email';
}

interface Preference {
  id: string;
  title: string;
  value: boolean;
  description: string;
}

const profileData: ProfileData = {
  name: 'John Doe',
  email: 'john.doe@company.com',
  role: 'Senior Developer',
  department: 'Engineering',
  joinDate: '2026-04-01',
  avatar: 'JD',
};

const notifications: NotificationSetting[] = [
  {
    id: '1',
    title: 'Push Notifications',
    description: 'Receive push notifications for important updates',
    enabled: true,
    type: 'push',
  },
  {
    id: '2',
    title: 'Email Notifications',
    description: 'Receive email updates about HR matters',
    enabled: true,
    type: 'email',
  },
  {
    id: '3',
    title: 'Leave Approvals',
    description: 'Get notified when your leave is approved',
    enabled: true,
    type: 'push',
  },
  {
    id: '4',
    title: 'Attendance Alerts',
    description: 'Alerts for late clock-in or missed work',
    enabled: false,
    type: 'push',
  },
  {
    id: '5',
    title: 'Survey Reminders',
    description: 'Reminders to complete employee surveys',
    enabled: true,
    type: 'email',
  },
  {
    id: '6',
    title: 'Performance Reviews',
    description: 'Notifications about review schedules and updates',
    enabled: true,
    type: 'push',
  },
];

const preferences: Preference[] = [
  {
    id: '1',
    title: 'Dark Mode',
    value: false,
    description: 'Use dark theme for the app',
  },
  {
    id: '2',
    title: 'Language',
    value: true,
    description: 'Select app language (English)',
  },
  {
    id: '3',
    title: 'Auto-Dark Mode',
    value: false,
    description: 'Automatically switch to dark mode at sunset',
  },
  {
    id: '4',
    title: 'Auto-Sign Out',
    value: false,
    description: 'Automatically sign out after 30 minutes of inactivity',
  },
];

export default function SettingsScreen() {
  const [notificationsList, setNotificationsList] = useState<NotificationSetting[]>(notifications);
  const [preferencesList, setPreferencesList] = useState<Preference[]>(preferences);

  const leavePortal = () => {
    router.push('/leave');
  };

  const handleNotificationToggle = (id: string) => {
    setNotificationsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handlePreferenceToggle = (id: string) => {
    setPreferencesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: !item.value } : item))
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => Alert.alert('Signed Out', 'You have been signed out successfully.'),
      },
    ]);
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change functionality would open here.');
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile edit functionality would open here.');
  };

  const handleSecuritySettings = () => {
    Alert.alert('Security', 'Two-factor authentication and security settings would open here.');
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
          <Text style={{ color: '#fff', fontSize: 14 }}>Settings</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            Preferences
          </Text>
        </View>
      </View>

      {/* Profile Section */}
      <View style={{ padding: 20, backgroundColor: Colors.background, marginBottom: 20 }}>
        <View style={{ backgroundColor: Colors.card, padding: 16, borderRadius: 16, alignItems: 'center' }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#3B82F620',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ color: '#3B82F6', fontSize: 36, fontWeight: 'bold' }}>{profileData.avatar}</Text>
          </View>
          <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 20 }}>{profileData.name}</Text>
          <Text style={{ color: Colors.text70, fontSize: 14, marginTop: 2 }}>{profileData.email}</Text>
          <Text style={{ color: Colors.text70, fontSize: 12, marginTop: 4 }}>
            {profileData.role} • {profileData.department}
          </Text>
          <Text style={{ color: Colors.text70, fontSize: 11, marginTop: 4 }}>Joined: {profileData.joinDate}</Text>

          <TouchableOpacity
            onPress={handleEditProfile}
            style={{
              marginTop: 16,
              backgroundColor: '#3B82F6',
              padding: 12,
              borderRadius: 8,
              minWidth: 150,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Settings */}
      <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Notifications
        </Text>
        <View style={{ gap: 16 }}>
          {notificationsList.map((notification) => (
            <View key={notification.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <View>
                  <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>{notification.title}</Text>
                  <Text style={{ color: Colors.text70, fontSize: 11 }}>{notification.description}</Text>
                </View>
                <Switch
                  value={notification.enabled}
                  onValueChange={() => handleNotificationToggle(notification.id)}
                  trackColor={{ false: '#d1d5db', true: '#3B82F6' }}
                  thumbColor={notification.enabled ? '#fff' : '#9CA3AF'}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Preferences */}
      <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Preferences
        </Text>
        <View style={{ gap: 16 }}>
          {preferencesList.map((preference) => (
            <View key={preference.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <View>
                  <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>{preference.title}</Text>
                  <Text style={{ color: Colors.text70, fontSize: 11 }}>{preference.description}</Text>
                </View>
                <Switch
                  value={preference.value}
                  onValueChange={() => handlePreferenceToggle(preference.id)}
                  trackColor={{ false: '#d1d5db', true: '#10B981' }}
                  thumbColor={preference.value ? '#fff' : '#9CA3AF'}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Security Settings */}
      <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Security
        </Text>
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={handleChangePassword}
            style={{
              backgroundColor: Colors.background,
              padding: 16,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F59E0B20', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#F59E0B', fontSize: 18 }}>🔒</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>Change Password</Text>
              <Text style={{ color: Colors.text70, fontSize: 12 }}>Update your password</Text>
            </View>
            <Text style={{ color: Colors.text70 }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSecuritySettings}
            style={{
              backgroundColor: Colors.background,
              padding: 16,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#8B5CF620', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#8B5CF6', fontSize: 18 }}>🛡️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>Security Settings</Text>
              <Text style={{ color: Colors.text70, fontSize: 12 }}>Two-factor auth & login history</Text>
            </View>
            <Text style={{ color: Colors.text70 }}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support Section */}
      <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Support
        </Text>
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.background,
              padding: 16,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#10B98120', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#10B981', fontSize: 18 }}>💬</Text>
            </View>
            <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>Help Center</Text>
            <Text style={{ color: Colors.text70, fontSize: 12, marginLeft: 'auto' }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: Colors.background,
              padding: 16,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#EF444420', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#EF4444', fontSize: 18 }}>ℹ️</Text>
            </View>
            <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>About</Text>
            <Text style={{ color: Colors.text70, fontSize: 12, marginLeft: 'auto' }}>v1.0.0 ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Out Button */}
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            backgroundColor: '#EF444420',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#EF4444',
          }}
        >
          <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}