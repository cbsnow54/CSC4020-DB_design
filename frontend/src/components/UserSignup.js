import React, { useState } from 'react';
import { sendVerificationCode, signupUser } from '../api/userAuth';
const UserSignup = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    userName: '',
    verificationCode: ''
  });
  
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const getUserFriendlyErrorMessage = (errorMsg) => {
    if (errorMsg.includes('chk_user_pw')) {
      return '비밀번호 형식이 올바르지 않습니다.\n- 8자 이상\n- 영문 소문자, 숫자, 특수문자 각각 최소 1개 이상 포함해야 합니다.';
    }
    if (errorMsg.includes('chk_user_phone')) {
      return '전화번호는 숫자만 입력해야 합니다.';
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!formData.phoneNumber) {
      alert('전화번호를 입력해주세요.');
      return;
    }
    try {
      await sendVerificationCode(formData.phoneNumber);
      setIsCodeSent(true);
      setIsVerified(false);
      alert('인증번호가 발송되었습니다. (아무 숫자 6자리를 입력하세요)');
    } catch (error) {
      alert('발송 실패: 서버가 켜져있는지 확인해주세요.');
    }
  };

  const handleVerifyCode = () => {
    if (formData.verificationCode.length === 6) {
      setIsVerified(true);
      alert('인증이 완료되었습니다.');
    } else {
      alert('인증번호 6자리를 정확히 입력해주세요.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isVerified) {
      alert('전화번호 인증을 먼저 완료해주세요.');
      return;
    }

    try {
      await signupUser(formData);
      alert('회원가입 성공!');
      window.location.href = '/user/login';
    } catch (error) {
      const rawMsg = error.response?.data || error.message;
      alert('가입 실패:\n' + getUserFriendlyErrorMessage(String(rawMsg)));
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">사용자 회원가입</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input name="userName" placeholder="이름" onChange={handleChange} className="border p-2 w-full rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">전화번호</label>
          <div className="flex gap-2">
            <input name="phoneNumber" placeholder="숫자만 입력" onChange={handleChange} className="border p-2 flex-1 rounded" disabled={isVerified} required />
            <button type="button" onClick={handleSendCode} className={`px-3 py-1 rounded text-white text-sm ${isVerified ? 'bg-gray-400' : 'bg-blue-500'}`} disabled={isVerified}>
              {isCodeSent ? '재발송' : '인증요청'}
            </button>
          </div>
        </div>
        {isCodeSent && (
          <div>
            <label className="block text-sm font-medium text-gray-700">인증번호</label>
            <div className="flex gap-2">
              <input name="verificationCode" placeholder="6자리 숫자" onChange={handleChange} className="border p-2 flex-1 rounded" disabled={isVerified} required />
              <button type="button" onClick={handleVerifyCode} className={`px-3 py-1 rounded text-white text-sm ${isVerified ? 'bg-green-600' : 'bg-green-500'}`} disabled={isVerified}>
                {isVerified ? '완료됨' : '확인'}
              </button>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input type="password" name="password" placeholder="비밀번호 입력" onChange={handleChange} className="border p-2 w-full rounded" required />
          <p className="text-xs text-gray-500 mt-1">* 8자 이상, 소문자/숫자/특수문자 각각 1개 이상 필수</p>
        </div>
        <button type="submit" className={`p-2 rounded mt-2 text-white font-bold ${isVerified ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`} disabled={isVerified}>
          가입하기
        </button>
      </form>
    </div>
  );
};

export default UserSignup;