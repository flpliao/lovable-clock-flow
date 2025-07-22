import { API_ROUTES, ROUTES } from '@/routes';
import useEmployeeStore from '@/stores/employeeStore';
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
          navigate(ROUTES.HOME);
        }
      } catch (error) {
        console.error('Auto login failed', error);
      }
    };
    checkAutoLogin();
  }, []);

  return null;
};

export const me = async token => {
  const response = await axios.get(API_ROUTES.AUTH.ME, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const employee = response.data;
  useEmployeeStore.getState().setEmployee(employee, token, true);
  return employee;
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(API_ROUTES.AUTH.SIGN_IN, {
      email,
      password,
      company_slug: 'demo',
    });
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
    navigate(ROUTES.LOGIN);
  };
  return logout;
};
