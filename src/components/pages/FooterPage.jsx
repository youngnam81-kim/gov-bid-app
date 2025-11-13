// src/components/layout/FooterPage.jsx
import React from 'react';

function FooterPage() {
    return (
        <footer style={{
            padding: '20px',
            backgroundColor: '#222',
            color: 'white',
            textAlign: 'center',
            marginTop: 'auto' // 중앙 콘텐츠가 짧아도 항상 하단에 위치
        }}>
            <p>&copy; 2025 My React App. All rights reserved.</p>
        </footer>
    );
}

export default FooterPage;