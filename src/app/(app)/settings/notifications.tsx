import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import notificationService from '../../notifications/notificationService';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'push' | 'email' | 'both';
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Load saved preferences
    const loadPreferences = async () => {
      const enabled = await notificationService.getNotificationEnabled();
      setNotificationsEnabled(enabled);
      // You can load more preferences from database here
    };
    loadPreferences();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    await notificationService.setNotificationEnabled(value);
    setNotificationsEnabled(value);
  };

  const handleTestNotification = async () => {
    await notificationService.scheduleNotification({
      title: 'Test Notification',
      body: 'This is a test push notification!',
      sound: true,
      data: { type: 'test' },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Notifications Toggle */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Enable Notifications
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.secondaryText, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* Sound Toggle */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Notification Sound
          </Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: colors.secondaryText, true: colors.primary }}
            thumbColor="#fff"
          />
          <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
            Play sound for all notifications
          </Text>
        </View>

        {/* Push Notifications */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Push Notifications
          </Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: colors.secondaryText, true: colors.primary }}
            thumbColor="#fff"
          />
          <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
            Receive push notifications on your device
          </Text>
        </View>

        {/* Email Notifications */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Email Notifications
          </Text>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            trackColor={{ false: colors.secondaryText, true: colors.primary }}
            thumbColor="#fff"
          />
          <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
            Receive important updates via email
          </Text>
        </View>

        {/* Notification Types */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Notification Types
        </Text>

        {notificationTypes.map((type) => (
          <View key={type.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {type.title}
                </Text>
                <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
                  {type.description}
                </Text>
              </View>
              <View style={styles.typeBadges}>
                {type.category === 'push' && (
                  <View style={[styles.badge, styles.badgePush]}>
                    <Text style={styles.badgeText}>Push</Text>
                  </View>
                )}
                {type.category === 'email' && (
                  <View style={[styles.badge, styles.badgeEmail]}>
                    <Text style={styles.badgeText}>Email</Text>
                  </View>
                )}
                {type.category === 'both' && (
                  <>
                    <View style={[styles.badge, styles.badgePush]}>
                      <Text style={styles.badgeText}>Push</Text>
                    </View>
                    <View style={[styles.badge, styles.badgeEmail]}>
                      <Text style={styles.badgeText}>Email</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
            <Switch
              value={type.enabled}
              onValueChange={() => {/* Toggle preference in database */}}
              trackColor={{ false: colors.secondaryText, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        ))}

        {/* Test Button */}
        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: colors.primary }]}
          onPress={handleTestNotification}
        >
          <Text style={styles.testButtonText}>Send Test Notification</Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: colors.secondaryText }]}>
          Notifications will appear in real-time when enabled
        </Text>
      </ScrollView>
    </View>
  );
}

const notificationTypes: NotificationPreference[] = [
  {
    id: '1',
    title: 'Leave Approvals',
    description: 'Get notified when your leave request is approved or rejected',
    enabled: true,
    category: 'both',
  },
  {
    id: '2',
    title: 'Salary Slips',
    description: 'Receive your payslip as soon as it is generated',
    enabled: true,
    category: 'both',
  },
  {
    id: '3',
    title: 'Performance Reviews',
    description: 'Get alerts when performance reviews are scheduled or completed',
    enabled: true,
    category: 'push',
  },
  {
    id: '4',
    title: 'Training Updates',
    description: 'Updates about new training courses and completion reminders',
    enabled: true,
    category: 'push',
  },
  {
    id: '5',
    title: 'Survey Invitations',
    description: 'Get invited to employee satisfaction surveys',
    enabled: true,
    category: 'push',
  },
  {
    id: '6',
    title: 'Attendance Alerts',
    description: 'Alerts for early leave, late arrival, or attendance issues',
    enabled: true,
    category: 'push',
  },
  {
    id: '7',
    title: 'Document Reminders',
    description: 'Reminders to upload or update required documents',
    enabled: true,
    category: 'push',
  },
  {
    id: '8',
    title: 'System Updates',
    description: 'Important updates about the HR Manager app',
    enabled: true,
    category: 'both',
  },
];

const styles = {
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
  },
  typeBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgePush: {
    backgroundColor: '#5A6BD8',
  },
  badgeEmail: {
    backgroundColor: '#43A047',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#3F51B5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
};