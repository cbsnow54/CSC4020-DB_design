import React, { useState } from 'react';
import { checkAdminId, signupAdmin } from '../api/adminAuth';
import { searchCompanies } from '../api/company';

const AdminSignup = () => {
  const [keyword, setKeyword] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [isIdAvailable, setIsIdAvailable] = useState(null);

  const getUserFriendlyErrorMessage = (errorMsg) => {
    if (errorMsg.includes('chk_admin_id')) return '아이디 형식이 올바르지 않습니다.\n- 8자 이상\n- 영문 소문자, 숫자, 특수문자 각각 최소 1개 이상 포함해야 합니다.';
    if (errorMsg.includes('chk_admin_pw')) return '비밀번호 형식이 올바르지 않습니다.\n- 8자 이상\n- 영문 소문자, 숫자, 특수문자 각각 최소 1개 이상 포함해야 합니다.';
    if (errorMsg.includes('Duplicate entry') || errorMsg.includes('이미 사용 중')) return '이미 사용 중인 정보입니다.';
    return errorMsg;
  };

  const handleSearch = async () => {
    try {
      const res = await searchCompanies(keyword);
      setCompanies(res.data);
    } catch (error) {
      alert('검색 실패');
    }
  };

  const selectCompany = (company) => {
    setSelectedCompany(company);
    setCompanies([]);
    setKeyword('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'id') setIsIdAvailable(null);
  };

  const handleCheckId = async () => {
    if (!formData.id) return alert('관리자 ID를 입력해주세요.');
    try {
      const response = await checkAdminId(formData.id);
      if (response.data) {
        alert('이미 사용 중인 ID입니다.');
        setIsIdAvailable(false);
      } else {
        alert('사용 가능한 ID입니다.');
        setIsIdAvailable(true);
      }
    } catch (error) {
      const rawMsg = error.response?.data || error.message;
      alert(getUserFriendlyErrorMessage(String(rawMsg)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isIdAvailable !== true) return alert('ID 중복 확인을 완료해주세요.');
    if (!selectedCompany) return alert('기업을 먼저 선택해주세요.');

    const payload = { ...formData, companyName: selectedCompany.companyName };

    try {
      await signupAdmin(payload);
      alert('관리자 가입 성공! 로그인 화면으로 이동합니다.');
      window.location.href = '/auth/admin'; 
    } catch (error) {
      const rawMsg = error.response?.data || error.message;
      alert('가입 실패:\n' + getUserFriendlyErrorMessage(String(rawMsg)));
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-96 mt-4">
      <h2 className="text-xl font-bold mb-4">관리자 회원가입</h2>
      {!selectedCompany ? (
        <div className="mb-4">
          <div className="flex gap-2">
            <input placeholder="기업명 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="border p-2 flex-1" />
            <button type="button" onClick={handleSearch} className="bg-gray-500 text-white px-2 rounded">검색</button>
          </div>
          <ul className="border mt-1 max-h-40 overflow-y-auto">
            {companies.map(comp => (
              <li key={comp.companyName} onClick={() => selectCompany(comp)} className="p-2 hover:bg-gray-100 cursor-pointer">{comp.companyName}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-4 p-2 bg-blue-100 rounded flex justify-between items-center">
          <span className="font-bold">{selectedCompany.companyName}</span>
          <button onClick={() => setSelectedCompany(null)} className="text-red-500 text-sm">변경</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">관리자 ID</label>
          <div className="flex gap-2">
            <input name="id" placeholder="ID 입력" onChange={handleChange} className={`border p-2 flex-1 rounded ${isIdAvailable === false ? 'border-red-500' : isIdAvailable === true ? 'border-green-500' : ''}`} required />
            <button type="button" onClick={handleCheckId} className={`px-3 py-1 rounded text-white text-sm ${isIdAvailable === true ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'}`} disabled={isIdAvailable === true}>중복 확인</button>
          </div>
          <p className="text-xs text-gray-500 mt-1">* 8자 이상, 소문자/숫자/특수문자 각각 1개 이상 필수</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input type="password" name="password" placeholder="비밀번호 입력" onChange={handleChange} className="border p-2 w-full rounded" required />
          <p className="text-xs text-gray-500 mt-1">* 8자 이상, 소문자/숫자/특수문자 각각 1개 이상 필수</p>
        </div>
        <button type="submit" className="p-2 rounded mt-2 text-white font-bold bg-purple-600 hover:bg-purple-700">가입하기</button>
      </form>
    </div>
  );
};

export default AdminSignup;