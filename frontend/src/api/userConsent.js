import client from './client';

export const getMyList = (phoneNumber) => 
  client.get('/ad-consent/my-list', {
    params: { phoneNumber },
  });

export const withdraw = (consentId, phoneNumber) => 
  client.post(`/ad-consent/withdraw/${consentId}`, { phoneNumber });