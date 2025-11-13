// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RowLayout from './components/layouts/RowLayout';
import DashBoardPage from './components/pages/FavoriteBoardPage';
import BidBoardPage from './components/pages/BidBoardPage';
import ApiBoardPage from './components/pages/ApiBoardPage';
import AboutPage from './components/pages/AboutPage';

function App() {
  return (
    < BrowserRouter basename="/gov-bid-app" >
      <Routes>
        <Route path="/" element={<RowLayout />}>
          {/* <Route index element={<HomePage />} /> 기본 라우트 */}
          <Route index element={<ApiBoardPage />} />
          {/* <Route path="apiBoard" element={<ApiBoardPage />} /> */}
          {/* <Route path="board" element={<BoardPage />} /> */}
          <Route path="favoriteBoard" element={<DashBoardPage />} />
          <Route path="bidBoard" element={<BidBoardPage />} />
          <Route path="about" element={<AboutPage />} />
          {/* 404 Not Found 페이지도 추가 가능 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App
