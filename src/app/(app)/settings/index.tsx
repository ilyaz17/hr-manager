import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

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

  const [prefDarkMode, setPrefDarkMode] = useState(false);
  const [prefLanguage, setPrefLanguage] = useState('English');
  const [prefAutoDark, setPrefAutoDark] = useState(true);

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
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
              value={prefDarkMode}
              onValueChange={setPrefDarkMode}
              trackColor={{ false: Colors.gray, true: Colors.primary }}
              thumbColor={prefDarkMode ? '#fff' : '#fff'}
            />
          </View>

          <View style={styles.preferenceDivider} />

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Auto Dark Mode</Text>
              <Text style={styles.preferenceDescription}>Automatically enable dark mode at sunset</Text>
            </View>
            <Switch
              value={prefAutoDark}
              onValueChange={setPrefAutoDark}
              trackColor={{ false: Colors.gray, true: Colors.primary }}
              thumbColor={prefAutoDark ? '#fff' : '#fff'}
            />
          </View>

          <View style={styles.preferenceDivider} />

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Language</Text>
              <Text style={styles.preferenceDescription}>Select your preferred language</Text>
            </View>
            <TouchableOpacity style={styles.languageButton}>
              <Text style={styles.languageButtonText}>{prefLanguage}</Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: Colors.card,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 3,
  },
  profileRole: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  preferenceCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  preferenceDivider: {
    height: 1,
    backgroundColor: Colors.gray,
    marginLeft: 15,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  languageButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  chevron: {
    fontSize: 24,
    color: Colors.secondaryText,
  },
  logoutButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
};