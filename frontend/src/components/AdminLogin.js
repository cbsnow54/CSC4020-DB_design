import React, { useState } from 'react';
import { loginAdmin } from '../api/adminAuth';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ id: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAdmin(formData);
      onLogin(response.data);
    } catch (error) {
      const msg = error.response?.data;
      alert('로그인 실패: ' + (typeof msg === 'object' ? JSON.stringify(msg) : msg || error.message));
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-96 mt-4">
      <h2 className="text-xl font-bold mb-4">관리자 로그인</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="id" placeholder="관리자 ID" onChange={handleChange} className="border p-2" required />
        <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} className="border p-2" required />
        <button type="submit" className="bg-purple-600 text-white p-2 rounded">로그인</button>
      </form>
    </div>
  );
};

export default AdminLogin;