import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

const NOTIFICATION_KEYS = {
  PUSH_TOKEN: '@hr_manager_push_token',
  NOTIFICATIONS_ENABLED: '@hr_manager_notifications_enabled',
  NOTIFICATION_PREFERENCES: '@hr_manager_notification_preferences',
};

interface NotificationPreferences {
  leaveApproval: boolean;
  payslipAvailable: boolean;
  performanceReview: boolean;
  attendanceReminder: boolean;
  urgentUpdates: boolean;
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Handle notification taps
export const handleNotificationTap = (notification: Notifications.Notification) => {
  const data = notification.request.content.data;
  
  if (data?.type === 'leave_approval') {
    // Navigate to leave detail or notification screen
  } else if (data?.type === 'payslip') {
    // Navigate to payslips screen
  } else if (data?.type === 'performance_review') {
    // Navigate to performance reviews screen
  }
};

// Initialize notifications
export const initializeNotifications = async () => {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }
  }

  let token = await AsyncStorage.getItem(NOTIFICATION_KEYS.PUSH_TOKEN);
  
  if (!token) {
    try {
      const response = await Notifications.getExpoPushTokenAsync({
        projectId: "7c72a518-d2c0-4b7d-8753-93c8dc0020f0",
          });
      token = response.data;
      
      await AsyncStorage.setItem(NOTIFICATION_KEYS.PUSH_TOKEN, token);
      
      // Update notification settings
      const prefs = await getNotificationPreferences();
      await AsyncStorage.setItem(
        NOTIFICATION_KEYS.NOTIFICATIONS_ENABLED,
        JSON.stringify({
          enabled: true,
          preferences: prefs,
          token,
        })
      );
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }

  // Set up notification listeners
  const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received:', notification);
    }
  );

  Notifications.addNotificationResponseReceivedListener(handleNotificationTap);

  return token;
};

// Create a notification trigger (scheduled local notification)
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: any,
  triggerDate?: Date
) => {
  try {
    const token = await AsyncStorage.getItem(NOTIFICATION_KEYS.PUSH_TOKEN);
    const prefs = await getNotificationPreferences();
    
    if (!token) {
      console.warn('No push token available');
      return false;
    }

    // Check if notification is enabled in preferences
    const { leaveApproval, payslipAvailable, performanceReview, urgentUpdates } = prefs;
    const isDataNotification = data?.type === 'leave_approval' ? leaveApproval :
                               data?.type === 'payslip' ? payslipAvailable :
                               data?.type === 'performance_review' ? performanceReview :
                               urgentUpdates;

    if (!isDataNotification) {
      return false;
    }

    // Schedule local notification
    const date = triggerDate || new Date();
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        date,
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return false;
  }
};

// Send notification (trigger immediately)
export const sendNotification = (
  title: string,
  body: string,
  data?: any
) => {
  scheduleLocalNotification(title, body, data);
};

// Send leave approval notification
export const sendLeaveApprovalNotification = async (
  employeeName: string,
  leaveType: string,
  isApproved: boolean,
  leaveId: string
) => {
  const status = isApproved ? 'approved' : 'denied';
  const title = `Leave ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  const body = `${employeeName}'s ${leaveType} leave request has been ${status}.`;
  
  return await sendNotification(title, body, {
    type: 'leave_approval',
    leaveId,
    isApproved,
  });
};

// Send payslip notification
export const sendPayslipNotification = async (
  employeeName: string,
  period: string,
  payslipId: string
) => {
  const title = 'New Payslip Available';
  const body = `${employeeName}, your payslip for ${period} has been generated.`;
  
  return await sendNotification(title, body, {
    type: 'payslip',
    payslipId,
    period,
  });
};

// Send performance review notification
export const sendPerformanceReviewNotification = async (
  employeeName: string,
  reviewPeriod: string,
  reviewId: string
) => {
  const title = 'Performance Review Reminder';
  const body = `${employeeName}, please complete your performance review for ${reviewPeriod}.`;
  
  return await sendNotification(title, body, {
    type: 'performance_review',
    reviewId,
    reviewPeriod,
  });
};

// Request immediate notification
export const requestPermission = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    return false;
  }

  const { status } = await Notifications.getPermissionsAsync();
  
  if (status === 'granted') {
    return true;
  }

  const { status: newStatus } = await Notifications.requestPermissionsAsync();
  return newStatus === 'granted';
};

// Notification preferences management
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  try {
    const prefs = await AsyncStorage.getItem(NOTIFICATION_KEYS.NOTIFICATION_PREFERENCES);
    return prefs ? JSON.parse(prefs) : {
      leaveApproval: true,
      payslipAvailable: true,
      performanceReview: true,
      attendanceReminder: true,
      urgentUpdates: true,
    };
  } catch {
    return {
      leaveApproval: true,
      payslipAvailable: true,
      performanceReview: true,
      attendanceReminder: true,
      urgentUpdates: true,
    };
  }
};

export const updateNotificationPreferences = async (
  preferences: Partial<NotificationPreferences>
): Promise<void> => {
  try {
    const current = await getNotificationPreferences();
    const updated = { ...current, ...preferences };
    await AsyncStorage.setItem(
      NOTIFICATION_KEYS.NOTIFICATION_PREFERENCES,
      JSON.stringify(updated)
    );
  } catch (error) {
    console.error('Failed to update preferences:', error);
  }
};

export const getNotificationStatus = async (): Promise<boolean> => {
  try {
    const item = await AsyncStorage.getItem(NOTIFICATION_KEYS.NOTIFICATIONS_ENABLED);
    if (item) {
      const data = JSON.parse(item);
      return data.enabled;
    }
    return true;
  } catch {
    return true;
  }
};

export const saveNotificationSettings = async (
  settings: { enabled: boolean; preferences?: object; token?: string }
): Promise<void> => {
  try {
    const { enabled, preferences, token } = settings;
    
    await AsyncStorage.setItem(
      NOTIFICATION_KEYS.NOTIFICATIONS_ENABLED,
      JSON.stringify(settings)
    );

    if (preferences) {
      await AsyncStorage.setItem(
        NOTIFICATION_KEYS.NOTIFICATION_PREFERENCES,
        JSON.stringify(preferences)
      );
    }

    if (token) {
      await AsyncStorage.setItem(NOTIFICATION_KEYS.PUSH_TOKEN, token);
    }
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export { NOTIFICATION_KEYS };
