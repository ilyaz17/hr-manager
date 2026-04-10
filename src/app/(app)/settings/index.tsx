import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useTheme } from '../../context/ThemeProvider';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'push' | 'email';
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: '1', title: 'Push Notifications', description: 'Receive push notifications for important updates', enabled: true, type: 'push' },
    { id: '2', title: 'Email Notifications', description: 'Get daily and weekly email digests', enabled: true, type: 'email' },
    { id: '3', title: 'Leave Approvals', description: 'Notify when your leave requests are approved', enabled: true, type: 'push' },
    { id: '4', title: 'Performance Reviews', description: 'Alert when performance reviews are scheduled', enabled: false, type: 'email' },
    { id: '5', title: 'Training Updates', description: 'Updates about new training courses', enabled: true, type: 'push' },
    { id: '6', title: 'Survey Invitations', description: 'Get invited to employee surveys', enabled: true, type: 'push' },
  ]);

  const { mode, setMode, systemMode } = useTheme();

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => router.push('/(auth)/login') },
    ]);
  };

  const handlePasswordChange = () => {
    Alert.alert('Password Change', 'Password change would open here');
  };

  const handleTwoFactor = () => {
    Alert.alert('2FA Settings', 'Two-factor authentication setup would open here');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>JS</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Smith</Text>
            <Text style={styles.profileEmail}>john.smith@company.com</Text>
            <Text style={styles.profileRole}>HR Manager</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationDescription}>{notification.description}</Text>
            </View>
            <Switch
              value={notification.enabled}
              onValueChange={() => toggleNotification(notification.id)}
              trackColor={{ false: Colors.gray, true: Colors.primary }}
              thumbColor={notification.enabled ? '#fff' : '#fff'}
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceCard}>
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Dark Mode</Text>
              <Text style={styles.preferenceDescription}>Enable dark theme for the app</Text>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              trackColor={{ false: Colors.gray, true: Colors.primary }}
              thumbColor={mode === 'dark' ? '#fff' : '#fff'}
            />
          </View>

          <View style={styles.preferenceDivider} />

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Auto Dark Mode</Text>
              <Text style={styles.preferenceDescription}>Automatically enable dark mode at sunset</Text>
            </View>
            <Switch
              value={mode === 'auto'}
              onValueChange={() => setMode('auto')}
              trackColor={{ false: Colors.gray, true: Colors.primary }}
              thumbColor={mode === 'auto' ? '#fff' : '#fff'}
            />
          </View>

          <View style={styles.preferenceDivider} />

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={additionalTitle}>Language</Text>
              <Text style={styles.preferenceDescription}>Select your preferred language</Text>
            </View>
            <TouchableOpacity style={styles.languageButton}>
              <Text style={styles.languageButtonText}>English</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.preferenceCard}>
          <TouchableOpacity style={styles.securityItem} onPress={handlePasswordChange}>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Change Password</Text>
              <Text style={styles.securityDescription}>Update your current password</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.preferenceDivider} />

          <TouchableOpacity style={styles.securityItem} onPress={handleTwoFactor}>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Two-Factor Authentication</Text>
              <Text style={styles.securityDescription}>Add extra security to your account</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.preferenceDivider} />

          <TouchableOpacity style={styles.securityItem} onPress={() => Alert.alert('Support', 'Help center would open here')}>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Help & Support</Text>
              <Text style={styles.securityDescription}>Get help from HR support team</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.preferenceDivider} />

          <TouchableOpacity style={styles.securityItem} onPress={() => Alert.alert('About', 'HR Manager v1.0.0')}>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>About</Text>
              <Text style={styles.securityDescription}>Version 1.0.0</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: Colors.red }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>HR Manager © 2026</Text>
      </ScrollView>
    </View>
  );
}

const styles = {
  // existing styles unchanged
};
