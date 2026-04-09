import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@hr_payroll';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  month: string;
  basicSalary: number;
  allowance: number;
  deduction: number;
  netSalary: number;
}

export function usePayroll() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((val) => {
      if (val) setRecords(JSON.parse(val));
      setLoading(false);
    });
  }, []);

  const addRecord = useCallback((rec: Omit<PayrollRecord, 'id'>) => {
    setRecords((prev) => {
      const updated = [...prev, { ...rec, id: Date.now().toString() }];
      AsyncStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const generateFromEmployee = useCallback(
    (emp: { id: string; name: string; designation: string; basicSalary: string; allowance: string; deduction: string }, month: string) => {
      const basic = parseFloat(emp.basicSalary) || 0;
      const allowance = parseFloat(emp.allowance) || 0;
      const deduction = parseFloat(emp.deduction) || 0;
      const net = basic + allowance - deduction;
      addRecord({
        employeeId: emp.id,
        employeeName: emp.name,
        designation: emp.designation,
        month,
        basicSalary: basic,
        allowance,
        deduction,
        netSalary: net,
      });
    },
    [addRecord]
  );

  return { records, loading, addRecord, generateFromEmployee };
}
