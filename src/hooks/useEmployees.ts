import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@hr_employees';

export interface Employee {
  id: string;
  // Personal
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  // Work
  employeeId: string;
  designation: string;
  department: string;
  joinDate: string;
  employmentType: string;
  // Salary
  basicSalary: string;
  allowance: string;
  deduction: string;
  bankName: string;
  accountNumber: string;
}

export type EmployeeInput = Omit<Employee, 'id'>;

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((val) => {
      if (val) setEmployees(JSON.parse(val));
      setLoading(false);
    });
  }, []);

  const save = (data: Employee[]) => {
    AsyncStorage.setItem(KEY, JSON.stringify(data));
    setEmployees(data);
  };

  const addEmployee = useCallback((emp: EmployeeInput) => {
    setEmployees((prev) => {
      const updated = [...prev, { ...emp, id: Date.now().toString() }];
      AsyncStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateEmployee = useCallback((id: string, emp: Partial<EmployeeInput>) => {
    setEmployees((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...emp } : e));
      AsyncStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      AsyncStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getEmployee = useCallback(
    (id: string) => employees.find((e) => e.id === id) ?? null,
    [employees]
  );

  return { employees, loading, addEmployee, updateEmployee, deleteEmployee, getEmployee };
}
