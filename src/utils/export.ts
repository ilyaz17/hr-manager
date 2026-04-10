import * as FileSystem from 'expo-file-system';
import { Alert, Share } from 'react-native';
import { generatePDF, sharePDF, savePDFToFileSystem } from './pdfUtils';
import {
  exportPayslipsToExcel,
  exportAttendanceToExcel,
  exportPerformanceToExcel,
  exportEmployeesToExcel,
  exportMultipleSheetsToExcel,
  shareExcelFile,
} from './excelUtils';

export interface ExportOptions {
  fileName?: string;
  exportType?: 'pdf' | 'excel' | 'both';
  share?: boolean;
}

/**
 * Main export function for payslips
 */
export const exportPayslip = async (
  payslip: any,
  options: ExportOptions = {}
) => {
  try {
    const { fileName = 'payslip', exportType = 'both', share = false } = options;
    const companyInfo = {
      name: 'HR Manager',
      email: 'hr@company.com',
      phone: '+91 1234567890',
    };

    // Generate HTML
    const { createPayslipHTML } = await import('./pdfUtils');
    const htmlContent = createPayslipHTML(payslip, companyInfo);

    if (exportType === 'pdf' || exportType === 'both') {
      const pdfPath = await generatePDF(htmlContent, {
        fileName: `${fileName}_payslip`,
        base64: false,
      });

      if (share) {
        await sharePDF(pdfPath);
      } else {
        const savedPath = await savePDFToFileSystem(pdfPath);
        Alert.alert(
          'Success',
          `Payslip saved to ${savedPath || 'downloads folder'}`
        );
      }
    }

    if (exportType === 'excel' || exportType === 'both') {
      await exportPayslipsToExcel(
        [{
          id: payslip.id,
          employeeName: payslip.employeeName,
          employeeId: payslip.employeeId,
          period: payslip.period,
          payDate: payslip.payDate,
          grossPay: payslip.grossPay,
          netPay: payslip.netPay,
          deductions: [{ type: 'Provident Fund', amount: 5000 }],
          benefits: [{ type: 'Allowances', amount: 2000 }],
          allowances: [{ type: 'Bonus', amount: 1500 }],
          status: payslip.status,
        }],
        fileName
      );

      if (share) {
        Alert.alert('Excel exported', 'Payslip available in Excel format');
      } else {
        Alert.alert(
          'Success',
          `Payslip exported as ${fileName}.xlsx`
        );
      }
    }
  } catch (error) {
    console.error('Payslip export failed:', error);
    Alert.alert('Error', 'Failed to export payslip');
  }
};

/**
 * Export attendance data
 */
export const exportAttendanceData = async (
  attendance: any[],
  period: string,
  options: ExportOptions = {}
) => {
  try {
    const { fileName = 'attendance', exportType = 'excel', share = false } = options;

    if (exportType === 'pdf' || exportType === 'both') {
      const { createAttendanceHTML, generatePDF } = await import('./pdfUtils');
      const htmlContent = createAttendanceHTML(attendance, period);
      const pdfPath = await generatePDF(htmlContent, {
        fileName: `${fileName}_attendance`,
        base64: false,
      });

      if (share) {
        await sharePDF(pdfPath);
      } else {
        await savePDFToFileSystem(pdfPath);
        Alert.alert('Success', 'Attendance report PDF created');
      }
    }

    if (exportType === 'excel' || exportType === 'both') {
      await exportAttendanceToExcel(
        attendance.map((record) => ({
          id: record.id,
          employeeName: record.employeeName,
          employeeId: record.employeeId,
          reportDate: record.reportDate,
          checkInTime: record.checkInTime,
          checkOutTime: record.checkOutTime,
          totalWorkingHours: record.totalWorkingHours,
          status: record.status,
          remarks: record.remarks,
        })),
        fileName,
        period
      );

      if (share) {
        await shareExcelFile(`${FileSystem.documentDirectory}${fileName}.xlsx`);
      } else {
        Alert.alert('Success', 'Attendance data exported to Excel');
      }
    }
  } catch (error) {
    console.error('Attendance export failed:', error);
    Alert.alert('Error', 'Failed to export attendance data');
  }
};

/**
 * Export performance reviews
 */
export const exportPerformanceReviews = async (
  performances: any[],
  options: ExportOptions = {}
) => {
  try {
    const { fileName = 'performance', exportType = 'excel', share = false } = options;

    if (exportType === 'pdf' || exportType === 'both') {
      const { createPerformanceHTML, generatePDF } = await import('./pdfUtils');
      const htmlContent = createPerformanceHTML(
        performances[0] || {},
        [{ id: '1', label: 'Excellent', value: 5 }]
      );

      for (const performance of performances) {
        await generatePDF(createPerformanceHTML(performance, []), {
          fileName: `performance_${performance.employeeName.replace(/\s+/g, '_')}`,
          base64: false,
        });
      }
    }

    if (exportType === 'excel' || exportType === 'both') {
      await exportPerformanceToExcel(
        performances.map((review) => ({
          id: review.id,
          employeeName: review.employeeName,
          employeeId: review.employeeId,
          rating: review.rating,
          period: review.period,
          date: review.date,
          overall: review.overall,
          achievements: review.achievements,
          improvements: review.improvements,
          comments: review.comments,
        })),
        fileName
      );

      if (share) {
        Alert.alert('Excel exported', 'Performance reviews available in Excel format');
      } else {
        Alert.alert('Success', 'Performance reviews exported to Excel');
      }
    }
  } catch (error) {
    console.error('Performance export failed:', error);
    Alert.alert('Error', 'Failed to export performance reviews');
  }
};

/**
 * Export employee list
 */
export const exportEmployeeList = async (
  employees: any[],
  options: ExportOptions = {}
) => {
  try {
    const { fileName = 'employees', exportType = 'excel', share = false } = options;

    if (exportType === 'excel' || exportType === 'both') {
      await exportEmployeesToExcel(
        employees.map((emp) => ({
          employeeId: emp.employeeId,
          fullName: emp.fullName,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          designation: emp.designation,
          joiningDate: emp.joiningDate,
          salary: emp.salary,
          status: emp.status,
          managerName: emp.managerName,
        })),
        fileName
      );

      if (share) {
        Alert.alert('Excel exported', 'Employee list available in Excel format');
      } else {
        Alert.alert('Success', 'Employee list exported to Excel');
      }
    }
  } catch (error) {
    console.error('Employee list export failed:', error);
    Alert.alert('Error', 'Failed to export employee list');
  }
};

/**
 * Export comprehensive HR report (all modules)
 */
export const exportHROverview = async (data: any, options: ExportOptions = {}) => {
  try {
    const { fileName = 'hr_overview', exportType = 'both', share = false } = options;

    if (exportType === 'excel' || exportType === 'both') {
      await exportMultipleSheetsToExcel(
        [
          {
            name: 'Summary',
            data: [
              ['HR Overview Report', '', '', '', ''],
              [new Date().toLocaleDateString()],
              ['', '', '', '', ''],
              ['Metric', 'Count', '', '', ''],
              ['Total Employees', data.totalEmployees || 0, '', '', ''],
              ['Attendance Records', data.attendanceRecords || 0, '', '', ''],
              ['Leave Requests', data.leaveRequests || 0, '', '', ''],
              ['Performance Reviews', data.performanceReviews || 0, '', '', ''],
              ['Payslips', data.payslips || 0, '', '', ''],
            ],
          },
          {
            name: 'Payslips',
            data: [['Employee', 'Period', 'Gross Pay', 'Net Pay']].concat(
              (data.payslips || []).map((p: any) => [
                p.employeeName,
                p.period,
                p.grossPay,
                p.netPay,
              ])
            ),
          },
          {
            name: 'Attendance',
            data: [['Date', 'Employee', 'Check In', 'Check Out', 'Status']].concat(
              (data.attendance || []).map((a: any) => [
                a.date,
                a.employeeName,
                a.checkIn,
                a.checkOut,
                a.status,
              ])
            ),
          },
          {
            name: 'Employees',
            data: [['ID', 'Name', 'Department', 'Salary']].concat(
              (data.employees || []).map((e: any) => [
                e.employeeId,
                e.fullName,
                e.department,
                e.salary,
              ])
            ),
          },
        ],
        fileName
      );
    }

    if (exportType === 'pdf' || exportType === 'both') {
      const { generatePDF, createPayslipHTML } = await import('./pdfUtils');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #2563eb; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
            .summary { margin-top: 15px; padding: 10px; background: #f3f4f6; border-radius: 4px; }
            .summary-row { display: flex; justify-content: space-between; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">HR Overview Report</div>
            <div>Generated: ${new Date().toLocaleDateString()}</div>
          </div>
          <div class="summary">
            <div class="summary-row"><span>Total Employees:</span><span>${data.totalEmployees || 0}</span></div>
            <div class="summary-row"><span>Attendance Records:</span><span>${data.attendanceRecords || 0}</span></div>
            <div class="summary-row"><span>Leave Requests:</span><span>${data.leaveRequests || 0}</span></div>
            <div class="summary-row"><span>Performance Reviews:</span><span>${data.performanceReviews || 0}</span></div>
          </div>
        </body>
        </html>
      `;
      await generatePDF(htmlContent, { fileName: 'hr_overview' });
    }

    Alert.alert('Success', 'HR Overview exported to Excel');
  } catch (error) {
    console.error('HR overview export failed:', error);
    Alert.alert('Error', 'Failed to export HR overview');
  }
};

/**
 * Export individual record with detailed formatting
 */
export const exportRecord = async (
  type: 'payslip' | 'attendance' | 'performance' | 'employee',
  record: any,
  options: ExportOptions = {}
) => {
  try {
    const { exportType = 'pdf', share = false } = options;

    if (type === 'payslip') {
      await exportPayslip(record, { fileName: record.employeeName.replace(/\s+/g, '_'), exportType, share });
    } else if (type === 'attendance') {
      await exportAttendanceData([record], record.period || 'Current Month', { fileName: 'attendance', exportType, share });
    } else if (type === 'performance') {
      await exportPerformanceReviews([record], { fileName: record.employeeName.replace(/\s+/g, '_'), exportType, share });
    } else if (type === 'employee') {
      await exportEmployeeList([record], { fileName: record.fullName.replace(/\s+/g, '_'), exportType, share });
    }
  } catch (error) {
    console.error('Record export failed:', error);
    Alert.alert('Error', 'Failed to export record');
  }
};

export type { ExportOptions };
