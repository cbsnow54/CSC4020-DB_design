import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdConsentRegister = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    selectedDate: ''
  });
  const [csvFile, setCsvFile] = useState(null);
  const [adminId, setAdminId] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setAdminId(parsedData.id);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  // 1. 개별 등록
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!adminId) return alert('관리자 정보 없음');

    try {
      const payload = {
        adminId: adminId,
        phoneNumber: formData.phoneNumber,
        consentStatus: 1,
        selectedDate: formData.selectedDate ? formData.selectedDate : null
      };
      await axios.post('http://localhost:8080/api/ad-consent/register', payload);
      alert('등록되었습니다.');
      setFormData({ phoneNumber: '', selectedDate: '' });
    } catch (error) {
      alert('등록 실패: ' + (error.response?.data || error.message));
    }
  };

  const handleCsvSubmit = async (e) => {
    e.preventDefault();
    if (!adminId) return alert('관리자 정보 없음');
    if (!csvFile) return alert('CSV 파일을 선택해주세요.');

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('adminId', adminId);

    try {
      const res = await axios.post('http://localhost:8080/api/ad-consent/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(res.data);
      setCsvFile(null);
    } catch (error) {
      alert('업로드 실패: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-96 mt-4">
      <h2 className="text-xl font-bold mb-4">광고 수신 동의 등록</h2>
      
      <div className="flex border-b mb-4">
        <button 
          className={`flex-1 py-2 font-bold ${activeTab === 'manual' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('manual')}
        >
          개별 등록
        </button>
        <button 
          className={`flex-1 py-2 font-bold ${activeTab === 'csv' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('csv')}
        >
          CSV 대량 업로드
        </button>
      </div>
      
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
          <p className="text-sm text-gray-500 mb-2">고객 전화번호를 입력하여 등록합니다.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">고객 전화번호</label>
            <input 
              name="phoneNumber" 
              placeholder="숫자만 입력" 
              value={formData.phoneNumber}
              onChange={handleChange} 
              className="border p-2 w-full rounded" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">동의 날짜 (선택)</label>
            <input 
              type="datetime-local"
              name="selectedDate" 
              value={formData.selectedDate} 
              onChange={handleChange} 
              className="border p-2 w-full rounded"
            />
            <p className="text-xs text-gray-400 mt-1">
              * 선택하지 않으면 현재 시간이 등록됩니다.
            </p>
          </div>
          <button type="submit" className="bg-teal-600 text-white p-2 rounded mt-2 hover:bg-teal-700">
            등록하기
          </button>
        </form>
      )}

      {activeTab === 'csv' && (
        <form onSubmit={handleCsvSubmit} className="flex flex-col gap-3">
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 mb-2">
            <p className="font-bold mb-1">📄 파일 작성 규칙:</p>
            <ul className="list-disc pl-4 mb-2 space-y-1">
              <li><strong>1열:</strong> 전화번호 (필수, 숫자만)</li>
              <li><strong>2열:</strong> 동의 날짜 (선택)</li>
            </ul>
            <p className="text-xs text-gray-500">
              * 날짜를 비우면 <strong>현재 시간</strong>으로 등록됩니다.<br/>
              * 날짜 형식: <code>yyyy-MM-dd HH:mm:ss</code>
            </p>
            
            <div className="mt-2 bg-gray-200 p-2 rounded text-xs font-mono">
              <p className="text-gray-500 font-bold mb-1">[예시 내용]</p>
              01012345678, 2024-01-01 10:00:00<br/>
              01098765432<br/>
              01055556666, 2025-12-25 15:30:00
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CSV 파일 선택</label>
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="border p-2 w-full rounded bg-white" 
              required 
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700">
            일괄 업로드
          </button>
        </form>
      )}
    </div>
  );
};

export default AdConsentRegister;