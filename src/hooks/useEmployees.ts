import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMPLOYEES_KEY = '@hr_employees';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const persist = async (data: Employee[]) => {
    await AsyncStorage.setItem(EMPLOYEES_KEY, JSON.stringify(data));
    setEmployees(data);
  };

  useEffect(() => {
    AsyncStorage.getItem(EMPLOYEES_KEY).then((val) => {
      if (val) setEmployees(JSON.parse(val));
      setLoading(false);
    });
  }, []);

  const addEmployee = useCallback(async (emp: Omit<Employee, 'id'>) => {
    const next = { ...emp, id: Date.now().toString() };
    setEmployees((prev) => {
      const updated = [...prev, next];
      AsyncStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateEmployee = useCallback(async (id: string, data: Partial<Omit<Employee, 'id'>>) => {
    setEmployees((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...data } : e));
      AsyncStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    setEmployees((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      AsyncStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getEmployee = useCallback(
    (id: string) => employees.find((e) => e.id === id) ?? null,
    [employees]
  );

  return { employees, loading, addEmployee, updateEmployee, deleteEmployee, getEmployee };
}
