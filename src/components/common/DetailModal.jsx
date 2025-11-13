// src/components/common/DetailModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { formatCurrency, formatBidAmountInput, getImageUrls } from '../../util/formatters';
import '../../css/DetailModal.css';

const DetailModal = ({ isOpen, onClose, item }) => {
    // 모달이 열려있지 않거나 아이템이 없으면 렌더링하지 않음
    if (!isOpen || !item) return null;

    const [bidAmount, setBidAmount] = useState('');
    const [userSavedBidAmount, setUserSavedBidAmount] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isBid, setIsBid] = useState(false);
    const [isLoadingMyData, setIsLoadingMyData] = useState(true);
    const userId = localStorage.getItem('userId');

    // 사용자별 즐겨찾기/입찰 데이터 조회
    useEffect(() => {
        const fetchUserItemData = async () => {
            if (!userId || !item.cltrMnmtNo || !item.cltrHstrNo) {
                setIsLoadingMyData(false);
                return;
            }

            setIsLoadingMyData(true);
            try {
                const response = await api.get('/kamco/getMyDataStatus', {
                    params: {
                        userId,
                        cltrMnmtNo: item.cltrMnmtNo,
                        cltrHstrNo: item.cltrHstrNo,
                    }
                });

                const data = response.data;
                setIsFavorite(data.isFavorite === 'Y');
                setIsBid(data.isBid === 'Y');

                if (data.bidAmount) {
                    setUserSavedBidAmount(data.bidAmount);
                    setBidAmount(formatBidAmountInput(String(data.bidAmount)));
                } else {
                    setUserSavedBidAmount(null);
                    setBidAmount('');
                }
            } catch (error) {
                console.error("사용자별 물건 데이터 로드 중 오류 발생:", error);
                setIsFavorite(false);
                setIsBid(false);
                setUserSavedBidAmount(null);
                setBidAmount('');
            } finally {
                setIsLoadingMyData(false);
            }
        };

        if (isOpen) {
            fetchUserItemData();
        }
    }, [isOpen, item, userId]);

    // 입찰 처리
    const handleBidClick = async () => {
        if (!userId) {
            alert('로그인 후 입찰할 수 있습니다.');
            return;
        }

        const parsedBidAmount = parseInt(bidAmount.replace(/,/g, ''), 10);
        if (isNaN(parsedBidAmount) || parsedBidAmount <= 0) {
            alert('유효한 입찰 금액을 입력해주세요.');
            return;
        }

        const minBidPrc = parseInt(String(item.minBidPrc || '0').replace(/[^0-9]/g, ''), 10);
        if (parsedBidAmount < minBidPrc) {
            alert(`입찰 금액은 최저입찰가(${formatCurrency(minBidPrc)})보다 높아야 합니다.`);
            return;
        }

        if (window.confirm(`${item.cltrNm || '물건'}에 ${formatCurrency(parsedBidAmount)}원으로 입찰하시겠습니까?`)) {
            try {
                const params = {
                    userId,
                    cltrMnmtNo: item.cltrMnmtNo,
                    cltrHstrNo: item.cltrHstrNo,
                    isFavorite: isFavorite ? 'Y' : 'N',
                    isBid: 'Y',
                    bidAmount: parsedBidAmount,
                };

                const response = await api.post('/kamco/modifyMyData', params);
                if (response.status === 200) {
                    alert('입찰이 성공적으로 처리되었습니다.');
                    setUserSavedBidAmount(parsedBidAmount);
                    setIsBid(true);
                } else {
                    alert('입찰 처리 중 문제가 발생했습니다.');
                }
            } catch (error) {
                console.error('입찰 처리 중 오류 발생:', error);
                alert('입찰 처리 중 오류가 발생했습니다.');
            }
        }
    };

    // 입찰금액 입력 처리
    const handleBidAmountChange = (e) => {
        setBidAmount(formatBidAmountInput(e.target.value));
    };

    // 즐겨찾기 처리
    const handleFavoriteClick = async () => {
        if (!userId) {
            alert('로그인 후 즐겨찾기를 할 수 있습니다.');
            return;
        }

        const newFavoriteStatus = !isFavorite;
        const confirmMessage = newFavoriteStatus ?
            `${item.cltrNm || '물건'}을(를) 즐겨찾기에 추가하시겠습니까?` :
            `${item.cltrNm || '물건'}을(를) 즐겨찾기에서 제거하시겠습니까?`;

        if (window.confirm(confirmMessage)) {
            try {
                const params = {
                    userId,
                    cltrMnmtNo: item.cltrMnmtNo,
                    cltrHstrNo: item.cltrHstrNo,
                    isFavorite: newFavoriteStatus ? 'Y' : 'N',
                    isBid: isBid ? 'Y' : 'N',
                    bidAmount: userSavedBidAmount,
                };

                const response = await api.post('/kamco/modifyMyData', params);
                if (response.status === 200) {
                    alert(`즐겨찾기가 성공적으로 ${newFavoriteStatus ? '추가' : '제거'}되었습니다.`);
                    setIsFavorite(newFavoriteStatus);
                } else {
                    alert('즐겨찾기 처리 중 문제가 발생했습니다.');
                }
            } catch (error) {
                console.error('즐겨찾기 처리 중 오류 발생:', error);
                alert('즐겨찾기 처리 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="detail-modal-overlay">
            <div className="detail-modal">
                <button onClick={onClose} className="detail-modal-close">&times;</button>
                <h2 className="detail-modal-title">🏢 {item.cltrNm || '물건 정보'}</h2>

                {/* 로딩 상태 */}
                {isLoadingMyData ? (
                    <div className="detail-loading">사용자 데이터 로딩 중입니다</div>
                ) : (
                    <>
                        {/* 액션 영역 (즐겨찾기, 입찰) */}
                        <div className="detail-modal-actions">
                            <div className="detail-modal-actions-left">
                                <button
                                    onClick={handleFavoriteClick}
                                    className={`detail-btn detail-btn-favorite ${isFavorite ? 'active' : ''}`}
                                >
                                    {isFavorite ? '⭐ 즐겨찾기 해제' : '☆ 즐겨찾기 추가'}
                                </button>
                            </div>

                            <div className="detail-modal-actions-right">
                                <div className="detail-bid-input-group">
                                    <input
                                        type="text"
                                        placeholder={`입찰금액 (최저: ${formatCurrency(item.minBidPrc)})`}
                                        value={bidAmount}
                                        onChange={handleBidAmountChange}
                                        className="detail-bid-input"
                                        inputMode="numeric"
                                        readOnly={isBid}
                                    />
                                    <button
                                        onClick={handleBidClick}
                                        className="detail-btn detail-btn-bid"
                                        disabled={isBid}
                                    >
                                        {isBid ? '✅ 입찰완료' : '💰 입찰'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 입찰 상태 표시 */}
                        {isBid && userSavedBidAmount !== null && (
                            <div className="detail-bid-status">
                                💵 나의 입찰액: {formatCurrency(userSavedBidAmount)}
                            </div>
                        )}
                    </>
                )}

                {/* 이미지 다운로드 
                {item.imageLinks?.length > 0 && (
                    <div className="detail-image-section">
                        <h3 className="detail-image-title">📷 물건 이미지</h3>
                        <div className="detail-image-grid">
                            {item.imageLinks.map((linkInfo, idx) => (
                                <a
                                    key={idx}
                                    href={linkInfo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="detail-image-link"
                                >
                                    이미지 {String(idx + 1).padStart(2, '0')}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
                */}

                {/* 상세정보 테이블 */}
                <div className="detail-info-section">
                    <h3 className="detail-info-title">📋 상세 정보</h3>
                    <table className="detail-table">
                        <tbody>
                            <tr>
                                <td className="detail-table-label">물건명</td>
                                <td className="detail-table-value">{item.cltrNm || '-'}</td>
                                <td className="detail-table-label">카테고리</td>
                                <td className="detail-table-value">{item.ctgrFullNm || '-'}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">물건관리번호</td>
                                <td className="detail-table-value">{item.cltrMnmtNo || '-'}</td>
                                <td className="detail-table-label">처분방법</td>
                                <td className="detail-table-value">{item.dpslMtdNm || '-'}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">공고번호</td>
                                <td className="detail-table-value">{item.pbctNo || '-'}</td>
                                <td className="detail-table-label">공고조건번호</td>
                                <td className="detail-table-value">{item.pbctCdtnNo || '-'}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">공매계획번호</td>
                                <td className="detail-table-value">{item.plnmNo || '-'}</td>
                                <td className="detail-table-label">물건번호</td>
                                <td className="detail-table-value">{item.cltrNo || '-'}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">입찰방법명</td>
                                <td className="detail-table-value">{item.bidMtdNm || '-'}</td>
                                <td className="detail-table-label">최저입찰가</td>
                                <td className="detail-table-value">{formatCurrency(item.minBidPrc)}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">도로명주소</td>
                                <td className="detail-table-value" colSpan="3">{item.nmrdAdrs || '-'}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">지번주소</td>
                                <td className="detail-table-value" colSpan="3">{item.ldnmAdrs || '-'}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">감정평가금액</td>
                                <td className="detail-table-value">{formatCurrency(item.apslAsesAvgAmt)}</td>
                                <td className="detail-table-label">수수료율</td>
                                <td className="detail-table-value">{item.feeRate || '-'}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">공고시작일시</td>
                                <td className="detail-table-value">{item.pbctBegnDtm || '-'}</td>
                                <td className="detail-table-label">공고종료일시</td>
                                <td className="detail-table-value">{item.pbctClsDtm || '-'}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">공고물건상태</td>
                                <td className="detail-table-value">{item.pbctCltrStatNm || '-'}</td>
                                <td className="detail-table-label">유찰회수</td>
                                <td className="detail-table-value">{item.uscbdCnt || '-'}</td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">조회건수</td>
                                <td className="detail-table-value">{item.iqryCnt || '-'}</td>
                                <td className="detail-table-label"></td>
                                <td className="detail-table-value"></td>
                            </tr>
                            <tr>
                                <td className="detail-table-label">이미지</td>
                                <td className="detail-table-value" colSpan="3">
                                    <div className="detail-image-grid">
                                        {item.imageLinks.map((linkInfo, idx) => (
                                            <a
                                                key={idx}
                                                href={linkInfo.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="detail-image-link"
                                            >
                                                이미지 {String(idx + 1).padStart(2, '0')}
                                            </a>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 물품명세 상세 설명 */}
                {item.goodsNm && (
                    <div className="detail-description-section">
                        <h3 className="detail-description-title">📝 물품명세 상세 설명</h3>
                        <p className="detail-description-content">{item.goodsNm}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailModal;