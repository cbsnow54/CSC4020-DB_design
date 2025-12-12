import client from './client';

export const searchCompanies = (keyword) => 
  client.get(`/companies/search?keyword=${keyword}`);

export const registerCompany = (companyData) => 
  client.post('/companies/register', companyData);