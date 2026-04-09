import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@hr_attendance';

export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: AttendanceStatus;
  hoursWorked: string;
}

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((val) => {
      if (val) setRecords(JSON.parse(val));
      setLoading(false);
    });
  }, []);

  const addRecord = useCallback((rec: Omit<AttendanceRecord, 'id'>) => {
    setRecords((prev) => {
      const updated = [...prev, { ...rec, id: Date.now().toString() }];
      AsyncStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getByEmployee = useCallback(
    (employeeId: string) => records.filter((r) => r.employeeId === employeeId),
    [records]
  );

  const getSummary = useCallback(
    (employeeId: string) => {
      const emp = records.filter((r) => r.employeeId === employeeId);
      return {
        total: emp.length,
        present: emp.filter((r) => r.status === 'Present').length,
        absent: emp.filter((r) => r.status === 'Absent').length,
        halfDay: emp.filter((r) => r.status === 'Half Day').length,
        leave: emp.filter((r) => r.status === 'Leave').length,
      };
    },
    [records]
  );

  return { records, loading, addRecord, getByEmployee, getSummary };
}
