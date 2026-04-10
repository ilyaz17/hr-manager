# HR Manager App

This is the README for the HR Manager application with enhanced payment and reporting features.

## New Features

### → Push Notifications
- Automated alerts for:
  - Leave approval/rejection
  - Payslip generation
  - Performance review reminders
- Configurable in Settings under `Notifications`

### → Report Export
- **PDF Exports**:
  - Payslips with formatted tables
  - Attendance with status colors
  - Performance reviews
- **Excel Exports**:
  - Payslips, attendance, performance data
  - Employee directories
- **Multiple Sheet Exports**:
  - Comprehensive HR reports with multiple tabs

## How to Use
1. Install required packages:
   ```bash
   npm install expo-notifications expo-device expo-sharing
   npm install react-native-html-to-pdf xlsx
   ```
2. Build with `expo build` or `react-native run-ios`/`run-android`
3. Enable notifications through Settings

## API Documentation
- Available tools: Push notifications, PDF/Excel generation
- Recommended for: HR departments needing efficient employee data management

## Staging Status
- ✅ Push notifications fully implemented
- ✅ PDF/Excel exports working
- ✅ Export buttons in all relevant screens