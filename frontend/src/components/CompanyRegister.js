import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCompany } from '../api/company';

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    url: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerCompany(formData);
      alert('기업 등록이 완료되었습니다.');
      setFormData({ companyName: '', address: '', url: '' });
    } catch (error) {
      alert('등록 실패: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-96 mt-4 bg-white">
      <button 
        onClick={() => navigate('/')} 
        className="back-button" 
        style={{ marginBottom: '1rem', display: 'block' }}
      >
        ← 뒤로 가기
      </button>

      <h2 className="text-xl font-bold mb-4">기업 등록</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">기업명</label>
          <input 
            name="companyName" 
            value={formData.companyName}
            onChange={handleChange} 
            className="border p-2 w-full" 
            placeholder="예: 동국전자"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">실제 주소</label>
          <input 
            name="address" 
            value={formData.address}
            onChange={handleChange} 
            className="border p-2 w-full" 
            placeholder="서울시 중구 ..."
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">웹사이트 주소 (선택)</label>
          <input 
            name="url" 
            value={formData.url}
            onChange={handleChange} 
            className="border p-2 w-full" 
            placeholder="https://..."
          />
        </div>
        
        <button type="submit" className="bg-teal-600 text-white p-2 rounded mt-2">
          기업 등록하기
        </button>
      </form>
    </div>
  );
};

export default CompanyRegister;