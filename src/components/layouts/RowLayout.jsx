import React from 'react'
import { Outlet } from 'react-router-dom';
import RowTopPage from '../pages/RowTopPage.jsx'
//import RowCenterPage from '../pages/RowCenterPage.jsx'
import FooterPage from '../pages/FooterPage.jsx'

const RowLayout = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // 뷰포트 높이 전체 사용
            margin: 0,
            padding: 0
        }}>
            {/* 상단 영역 */}
            <RowTopPage />

            {/* 중앙 콘텐츠 영역 (라우터에 따라 변경) */}
            <main style={{
                flexGrow: 1, // 남은 공간을 모두 차지
                padding: '20px',
                backgroundColor: '#f8f9fa',
                overflowY: 'auto' // 중앙 콘텐츠 스크롤 가능
            }}>
                <Outlet /> {/* React Router의 라우트 컴포넌트가 렌더링될 위치 */}
            </main>

            {/* 하단 영역 */}
            <FooterPage />
        </div>
    );
}

export default RowLayout