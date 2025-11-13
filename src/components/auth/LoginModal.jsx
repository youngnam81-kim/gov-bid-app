// src/components/auth/LoginModal.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice'; // Redux login 액션 임포트
import { modalOverlayStyle, modalContentStyle, inputStyle, buttonStyle, secondaryButtonStyle, closeButtonStyle } from '../../css/modalStyles'; // 공통 스타일 임포트

// LoginModal은 isOpen, onClose 외에 onOpenRegister 콜백 함수를 props로 받습니다.
function LoginModal({ isOpen, onClose, onOpenRegister }) {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth); // Redux 상태 가져오기

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음

    // 폼 제출 핸들러 (로그인 로직)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(login({ userId, password }));
        if (login.fulfilled.match(resultAction)) {
            onClose(); // 로그인 성공 시 모달 닫기
        }
    };

    // '회원가입' 버튼 클릭 핸들러
    const handleRegisterClick = () => {
        // 부모로부터 받은 onOpenRegister 콜백을 호출합니다.
        // 이 함수가 LoginButtonAndModal에서 isLoginModalOpen을 false로 만들고 isRegisterModalOpen을 true로 만듭니다.
        if (onOpenRegister) { // onOpenRegister props가 유효한지 확인
            onOpenRegister();
        } else {
            console.warn("LoginModal: onOpenRegister props가 제공되지 않았습니다.");
            onClose(); // 폴백: onOpenRegister가 없으면 로그인 모달만 닫음
        }
    };

    return (
        <>
            {/* 모달 외부 클릭 시 닫히도록 하는 오버레이 */}
            <div style={modalOverlayStyle} onClick={onClose}></div>

            {/* 모달 콘텐츠 */}
            <div style={modalContentStyle}>
                <h2 style={{ marginBottom: '20px' }}>로그인</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />
                    {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                    <button type="submit" disabled={isLoading} style={buttonStyle}>
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                    <button type="button" onClick={handleRegisterClick} style={secondaryButtonStyle}>
                        회원가입
                    </button>
                </form>
                <button onClick={onClose} style={closeButtonStyle}>X</button>
            </div>
        </>
    );
}

export default LoginModal;