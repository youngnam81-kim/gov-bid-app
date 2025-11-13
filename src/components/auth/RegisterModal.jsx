// src/components/auth/RegisterModal.jsx
import React, { useState } from 'react';
import api from '../../api'; // 백엔드 API 호출용
import { modalOverlayStyle, modalContentStyle, inputStyle, registerButtonStyle, closeButtonStyle } from '../../css/modalStyles'; // 공통 스타일 임포트

function RegisterModal({ isOpen, onClose }) {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            // TODO: 백엔드 회원가입 API 엔드포인트로 변경
            const response = await api.post('/user/register', { userId, userName, password, email });
            setMessage(response.data.message || '회원가입 성공!');
            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            onClose(); // 로그인 성공 시 모달 닫기

            setUserId('');
            setUserName('');
            setPassword('');
            setEmail('');
            //handleLoginClick(); // 회원가입 후 로그인 모달 열기


        } catch (error) {
            setMessage(error.response?.data?.message || '회원가입 실패');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div style={modalOverlayStyle} onClick={onClose}></div>
            <div style={modalContentStyle}>
                <h2 style={{ marginBottom: '20px' }}>회원가입</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        placeholder="이름"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />
                    {/* <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    /> */}
                    {message && <p style={{ color: message.includes('실패') ? 'red' : 'green', fontSize: '14px' }}>{message}</p>}
                    <button type="submit" disabled={isLoading} style={registerButtonStyle}>
                        {isLoading ? '가입 중...' : '회원가입'}
                    </button>
                </form>
                <button onClick={onClose} style={closeButtonStyle}>X</button>
            </div>
        </>
    );
}

export default RegisterModal;