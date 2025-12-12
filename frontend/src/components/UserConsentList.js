import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserConsentList = () => {
  const [consents, setConsents] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPhoneNumber(parsedData.phoneNumber);
      setUserName(parsedData.userName);
    }
  }, []);

  const fetchMyConsents = async () => {
    if (!phoneNumber) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/ad-consent/my-list?phoneNumber=${phoneNumber}`);
      setConsents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchMyConsents();
    }
  }, [phoneNumber]);

  const handleWithdraw = async (consentId) => {
    if (!window.confirm("정말 철회하시겠습니까?\n철회 후에는 다시 동의 상태로 되돌릴 수 없습니다.")) {
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/ad-consent/withdraw/${consentId}`, {
        phoneNumber: phoneNumber
      });
      alert("철회가 완료되었습니다.");
      fetchMyConsents();
    } catch (error) {
      alert("철회 실패: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-full max-w-4xl mt-4 bg-white">
      <h2 className="text-xl font-bold mb-2">{userName}님의 광고 수신 동의 내역</h2>
      <p className="text-sm text-gray-500 mb-4">전화번호: {phoneNumber}</p>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">기업명</th>
              <th className="border p-2 text-center">상태</th>
              <th className="border p-2 text-left">상태 변경일</th>
              <th className="border p-2 text-left text-gray-600">이전 동의 날짜</th>
              <th className="border p-2 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {consents.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">동의한 내역이 없습니다.</td>
              </tr>
            ) : (
              consents.map((item) => (
                <tr key={item.consentId} className="hover:bg-gray-50">
                  <td className="border p-2 font-bold">{item.company?.companyName}</td>
                  
                  <td className="border p-2 text-center">
                    {item.consentStatus === 1 ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">동의중</span>
                    ) : (
                      <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">철회완료</span>
                    )}
                  </td>
                  
                  <td className="border p-2 text-sm">
                    {new Date(item.statusDate).toLocaleString()}
                  </td>

                  <td className="border p-2 text-sm text-gray-500">
                    {item.consentStatus === 0 && item.consentHistory ? (
                      <span className="text-blue-600">
                        {new Date(item.consentHistory.pastConsentDate).toLocaleString()}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>

                  <td className="border p-2 text-center">
                    {item.consentStatus === 1 && (
                      <button 
                        onClick={() => handleWithdraw(item.consentId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-bold shadow"
                      >
                        철회하기
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserConsentList;