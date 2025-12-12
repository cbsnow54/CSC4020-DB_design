import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdConsentList = () => {
  const [consents, setConsents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [adminId, setAdminId] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setAdminId(parsedData.id);
    }
  }, []);

  const fetchConsents = async () => {
    if (!adminId) return;
    try {
      const response = await axios.get('http://localhost:8080/api/ad-consent/list', {
        params: {
          adminId: adminId,
          filter: filter
        }
      });
      setConsents(response.data);
    } catch (error) {
      alert('조회 실패: ' + (error.response?.data || error.message));
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchConsents();
    }
  }, [adminId, filter]);

  return (
    <div className="p-4 border rounded shadow-md w-full max-w-4xl mt-4 bg-white">
      <h2 className="text-xl font-bold mb-4">고객 수신 동의 내역 조회</h2>
      
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded text-sm font-bold border ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>전체 보기</button>
        <button onClick={() => setFilter('active')} className={`px-3 py-1 rounded text-sm font-bold border ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border-green-600'}`}>유지 고객</button>
        <button onClick={() => setFilter('withdrawn')} className={`px-3 py-1 rounded text-sm font-bold border ${filter === 'withdrawn' ? 'bg-red-500 text-white' : 'bg-white text-red-500 border-red-500'}`}>철회 고객</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">전화번호</th>
              <th className="border p-2 text-center">현재 상태</th>
              <th className="border p-2 text-left">상태 변경일</th>
              <th className="border p-2 text-left text-gray-600">과거 동의 이력 (철회 시)</th>
            </tr>
          </thead>
          <tbody>
            {consents.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">데이터가 없습니다.</td>
              </tr>
            ) : (
              consents.map((item) => (
                <tr key={item.consentId} className="hover:bg-gray-50">
                  <td className="border p-2">{item.phoneNumber}</td>
                  
                  <td className="border p-2 text-center">
                    {item.consentStatus === 1 ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">동의중</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">철회됨</span>
                    )}
                  </td>
                  
                  <td className="border p-2 text-sm">
                    {new Date(item.statusDate).toLocaleString()}
                  </td>

                  <td className="border p-2 text-sm text-gray-500">
                    {/* 상태가 0(철회)이고 이력이 있을 때만 표시 */}
                    {item.consentStatus === 0 && item.consentHistory ? (
                      <div>
                        <span className="font-bold text-xs text-blue-600">[과거 동의일]</span><br/>
                        {new Date(item.consentHistory.pastConsentDate).toLocaleString()}
                      </div>
                    ) : (
                      '-'
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

export default AdConsentList;