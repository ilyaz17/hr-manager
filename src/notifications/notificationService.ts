import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
}

class NotificationService {
  private token: string | null = null;
  private notificationEnabled = true;

  async registerForPushNotificationsAsync(): Promise<string | null> {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions denied');
        return null;
      }

      // Get token
      if (Device.isDevice) {
        this.token = await Notifications.getExpoPushTokenAsync();
        await AsyncStorage.setItem('expoPushToken', this.token.data);
      } else {
        alert('Must use a physical device for Push Notifications');
        return null;
      }

      // Add iOS-specific settings
      if (Platform.OS === 'ios') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return this.token.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  async scheduleNotification(data: NotificationData) {
    if (!this.notificationEnabled) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.body,
          data: data.data || {},
          sound: data.sound !== false,
          priority: 'high',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async scheduleDelayedNotification(data: NotificationData, delaySeconds: number) {
    if (!this.notificationEnabled) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.body,
          data: data.data || {},
          sound: data.sound !== false,
          priority: 'high',
        },
        trigger: {
          seconds: delaySeconds,
        },
      });
    } catch (error) {
      console.error('Error scheduling delayed notification:', error);
    }
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async setNotificationEnabled(enabled: boolean) {
    this.notificationEnabled = enabled;
    await AsyncStorage.setItem('notificationsEnabled', String(enabled));
  }

  async getNotificationEnabled(): Promise<boolean> {
    const saved = await AsyncStorage.getItem('notificationsEnabled');
    return saved !== null ? saved === 'true' : true;
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    
    try {
      const saved = await AsyncStorage.getItem('expoPushToken');
      if (saved) {
        this.token = saved;
        return saved;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    
    return null;
  }

  onNotificationReceived(handler: (notification: any) => void) {
    return Notifications.addNotificationReceivedListener(handler);
  }

  onNotificationResponseReceived(handler: (response: any) => void) {
    return Notifications.addNotificationResponseReceivedListener(handler);
  }

  clearListeners() {
    Notifications.removeAllNotificationListeners();
  }
}

export default new NotificationService();