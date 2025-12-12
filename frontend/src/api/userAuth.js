import client from './client';

export const sendVerificationCode = (phoneNumber) => 
  client.post('/auth/verify-code', { phoneNumber });

export const signupUser = (userData) => 
  client.post('/auth/signup/user', userData);

export const loginUser = (loginData) => 
  client.post('/auth/login/user', loginData);