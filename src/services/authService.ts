import { apiRoutes, routes } from '@/routes/api';
import useEmployeeStore from '@/stores/employeeStore';
import type { Employee, LoginRequest, LoginResponse } from '@/types/auth';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AutoLogin = () => {
  const logout = useLogout();
  const token = useEmployeeStore(state => state.token);
  const navigate = useNavigate();

  const autoLogin = async () => {
    if (token) {
      try {
        return await me(token);
      } catch (error) {
        console.error('Auto login failed', error);
        logout();
      }
    }
  };
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const employee = await autoLogin();
        if (employee) {
          navigate(routes.home);
        }
      } catch (error) {
        console.error('Auto login failed', error);
      }
    };
    checkAutoLogin();
  }, []);

  return null;
};

export const me = async (token: string): Promise<Employee> => {
  const response = await axios.get<Employee>(apiRoutes.auth.me, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const employee = response.data;
  useEmployeeStore.getState().setEmployee(employee, token, true);
  return employee;
};

export const login = async (
  email: string,
  password: string,
  companySlug: string
): Promise<string> => {
  try {
    const loginData: LoginRequest = {
      email,
      password,
      company_slug: companySlug,
    };
    const response = await axios.post<LoginResponse>(apiRoutes.auth.signIn, loginData);
    const { accessToken } = response.data;
    return accessToken;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = () => {
    useEmployeeStore.getState().reset();
    navigate(routes.login);
  };
  return logout;
};
