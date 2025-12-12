import client from './client';

export const checkAdminId = (id) => 
  client.get(`/auth/admin/check-id?id=${id}`);

export const signupAdmin = (adminData) => 
  client.post('/auth/signup/admin', adminData);

export const loginAdmin = (loginData) => 
  client.post('/auth/login/admin', loginData);