// src/components/layout/RowTopPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import RowTopNavi from '../common/RowTopNavi';
import LoginButtonAndModal from '../common/LoginButtonAndModal';

function RowTopPage() {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#333',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            {/* 왼쪽: 로고 */}
            <div style={{ flex: 1, textAlign: 'left' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
                    온비드 공매 물건 서비스
                </Link>
            </div>

            {/* 가운데: 메뉴 */}
            <div style={{ flex: 1, textAlign: 'center' }}>
                <RowTopNavi />
            </div>

            {/* 오른쪽: 로그인/로그아웃 버튼 */}
            <div style={{ flex: 1, textAlign: 'right' }}>
                <LoginButtonAndModal />
            </div>
        </header>
    );
}

export default RowTopPage;