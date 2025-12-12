import client from './client';

export const register = (data) => 
  client.post('/ad-consent/register', data);

export const uploadCsv = (formData) => 
  client.post('/ad-consent/upload-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getList = (adminId, filter) => 
  client.get('/ad-consent/list', {
    params: { adminId, filter },
  });

export const getMarketingTargets = (adminId) => 
  client.get('/ad-consent/marketing-targets', {
    params: { adminId },
  });