// src/components/common/RowTopNavi.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // <<-- Redux의 useSelector 훅 임포트
import '../../css/RowTopNavi.css'; // 스타일 임포트

function RowTopNavi() {
    const { isAuthenticated } = useSelector((state) => state.auth); // Redux 상태에서 인증 정보 가져오기
    return (
        <nav>
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/" className="nav-link">공매 물건</Link>
                </li>
                {/* <li className="nav-item">
                    <Link to="/apiBoard" className="nav-link">ApiBoard</Link>
                </li> */}
                {/* <li className="nav-item">
                    <Link to="/board" className="nav-link">Board</Link>
                </li> */}
                {/* isAuthenticated가 true일 때만 Dashboard 링크를 렌더링합니다. */}
                {/* {isAuthenticated && ( // <<-- JSX 내에서 조건부 렌더링 (논리 AND 연산자 사용)
                    <li className="nav-item">
                        <Link to="/favoriteBoard" className="nav-link">관심 물건</Link>
                    </li>
                )} */}
                {isAuthenticated && ( // <<-- JSX 내에서 조건부 렌더링 (논리 AND 연산자 사용)
                    <li className="nav-item">
                        <Link to="/bidBoard" className="nav-link">나의 물건</Link>
                    </li>
                )}
                <li className="nav-item">
                    <Link to="/about" className="nav-link">서비스 소개</Link>
                </li>
                <li className="nav-item">
                    <a href="http://localhost:8080/swagger-ui/index.html" className="nav-link" target="_blank" rel="noopener noreferrer">Swagger</a>
                </li>
            </ul>
        </nav>
    );
}

export default RowTopNavi;