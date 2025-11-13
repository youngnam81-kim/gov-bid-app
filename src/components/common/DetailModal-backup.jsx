// src/components/common/DetailModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

// 콤마로 구분된 URL 문자열을 배열로 변환하는 헬퍼 함수
const getImageUrls = (cltrImgFilesString) => {
    if (!cltrImgFilesString) return [];
    return cltrImgFilesString.split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);
};

// 금액을 포맷팅하는 헬퍼 함수 (최저입찰가 등 표시에 사용)
const formatCurrency = (value) => {
    if (!value) return '-';
    const num = parseInt(String(value).replace(/,/g, ''), 10);
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(num);
};

// 숫자만 입력받고 천 단위 콤마를 추가하는 함수 (입찰 금액 input에 사용)
const formatBidAmountInput = (value) => {
    const rawValue = value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 천 단위 콤마 추가
};



const DetailModal = ({ isOpen, onClose, item }) => {
    // 모달이 열려있지 않거나 아이템이 없으면 렌더링하지 않음
    if (!isOpen || !item) return null;

    const [bidAmount, setBidAmount] = useState(''); // 사용자가 입력할 입찰 금액
    const [userSavedBidAmount, setUserSavedBidAmount] = useState(null); // 사용자가 이미 입찰한 금액 (조회용)
    const [isFavorite, setIsFavorite] = useState(false); // 사용자의 즐겨찾기 여부
    const [isBid, setIsBid] = useState(false); // 사용자의 입찰 여부
    const [isLoadingMyData, setIsLoadingMyData] = useState(true); // 사용자 데이터 로딩 상태
    const imageUrls = getImageUrls(item.cltrImgFiles);

    const userId = localStorage.getItem('userId');

    // 입찰 금액 input 변경 핸들러
    const handleBidAmountChange = (e) => {
        setBidAmount(formatBidAmountInput(e.target.value));
    };
    // 모달이 열릴 때마다 입찰 금액 초기화
    useEffect(() => {
        const fetchUserItemData = async () => {
            // 로그인하지 않았거나 물건 정보가 불완전하면 조회하지 않음
            if (!userId || !item.cltrMnmtNo || !item.cltrHstrNo) {
                setIsLoadingMyData(false);
                return;
            }

            setIsLoadingMyData(true);
            try {
                // 백엔드 API 경로를 '/kamco/myitem-status'로 변경하고 GET 요청으로 파라미터 전달
                const response = await api.get('/kamco/getMyDataStatus', { // ✨ 경로 수정
                    params: { // ✨ GET 요청은 params로 파라미터를 보냄
                        userId: userId,
                        cltrMnmtNo: item.cltrMnmtNo,
                        cltrHstrNo: item.cltrHstrNo,
                    }
                });

                const data = response.data; // 백엔드에서 KamcoMyDto 객체가 직접 넘어옵니다.

                // 백엔드에서 데이터가 없으면 비어있는 DTO가 올 것이므로, null 체크보다 필드값 체크
                setIsFavorite(data.isFavorite === 'Y');
                setIsBid(data.isBid === 'Y');
                if (data.bidAmount) { // 입찰 금액이 있을 경우
                    setUserSavedBidAmount(data.bidAmount);
                    // input 필드에 기존 입찰액 표시, 없을 경우 빈 문자열
                    setBidAmount(formatBidAmountInput(String(data.bidAmount)));
                } else { // 입찰 금액이 없을 경우 초기화
                    setUserSavedBidAmount(null);
                    setBidAmount('');
                }

            } catch (error) {
                console.error("사용자별 물건 데이터 로드 중 오류 발생:", error);
                // 오류 발생 시 초기화 또는 기본값 설정
                setIsFavorite(false);
                setIsBid(false);
                setUserSavedBidAmount(null);
                setBidAmount('');
            } finally {
                setIsLoadingMyData(false);
            }
        };

        // 모달이 열리면 사용자 데이터를 조회
        if (isOpen) {
            fetchUserItemData();
        }
        // 의존성 배열: isOpen, item 객체 자체가 변경될 때, userId가 변경될 때, formatBidAmountInput 추가 (콜백 함수)
    }, [isOpen, item, userId, formatBidAmountInput]);



    // 입찰 버튼 클릭 핸들러
    const handleBidClick = async () => {
        const parsedBidAmount = parseInt(bidAmount.replace(/,/g, ''), 10); // 콤마 제거 후 숫자로 변환
        if (isNaN(parsedBidAmount) || parsedBidAmount <= 0) {
            alert('유효한 입찰 금액을 입력해주세요.');
            return;
        }
        // 최저입찰가(item.minBidPrc)가 있다면 비교하는 로직 추가
        const minBidPrc = parseInt(String(item.minBidPrc || '0').replace(/,/g, ''), 10);
        if (parsedBidAmount < minBidPrc) {
            alert(`입찰 금액은 최저입찰가(${formatCurrency(minBidPrc)})보다 높아야 합니다.`);
            return;
        }

        alert(`${item.cltrNm || '물건'}에 ${formatCurrency(parsedBidAmount)}원으로 입찰합니다.`);
        try {
            const params = {
                userId: localStorage.getItem('userId'),
                cltrMnmtNo: item.cltrMnmtNo,
                cltrHstrNo: item.cltrHstrNo,
                isFavorite: null,
                isBid: 'Y',
                bidAmount: parsedBidAmount,

            };
            console.log('즐겨찾기 파라미터:', params);
            const response = await api.post('/kamco/modifyMyData', params);

            //onClose(); // 입찰 후 모달 닫기 (선택 사항)
        } catch (error) {
            console.error('입찰 중 오류 발생:', error);
            alert('입찰 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    // 즐겨찾기 버튼 클릭 핸들러
    const handleFavoriteClick = async () => {

        // Favorite 즐겨찾기 값을 db에서 가져온 값이 있으면 해당값을 N 으로 params 에 넘기고 없으면 Y 로 넘긴다.
        // 화면 들어올때 useEffect 에서 처리 api로 해당 물건 즐겨찾기 여부, 입찰 금액 입찰 여부 조회

        alert(`${item.cltrNm || '물건'}을(를) 즐겨찾기에 추가합니다.`);
        const params = {
            userId: localStorage.getItem('userId'),
            cltrMnmtNo: item.cltrMnmtNo,
            cltrHstrNo: item.cltrHstrNo,
            isFavorite: 'Y',
            isBid: null,
            bidAmount: null,
        };
        console.log('즐겨찾기 파라미터:', params);
        const response = await api.post('/kamco/modifyMyData', params);
    };

    // 모달 전용 스타일


    // 상세 정보 항목을 렌더링하는 헬퍼 컴포넌트
    const DetailItem = ({ label, value }) => (
        <div style={modalStyles.detailItem}>
            <span style={modalStyles.detailLabel}>{label}:</span>
            <span style={modalStyles.detailValue}>{value || '-'}</span>
        </div>
    );

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.content}>
                <button onClick={onClose} style={modalStyles.closeButton}>&times;</button>
                <h2 style={modalStyles.title}>물건 : {item.cltrNm || '-'}</h2>

                {/* 버튼 및 입찰 금액 입력 영역 */}
                <div style={modalStyles.buttonContainer}>
                    {/* 왼쪽 - 즐겨찾기 버튼 */}
                    <button
                        onClick={handleFavoriteClick}
                        style={{ ...modalStyles.actionButton, ...modalStyles.favoriteButton }}
                    >
                        ⭐ 즐겨찾기
                    </button>
                    {/* 오른쪽 - 입찰 금액 입력 필드와 입찰 버튼 */}
                    <div style={modalStyles.bidControls}>
                        <input
                            type="text"
                            placeholder="입찰 금액 (원)"
                            value={bidAmount}
                            onChange={handleBidAmountChange}
                            style={modalStyles.bidAmountInput}
                            inputMode="numeric" // 모바일에서 숫자 키패드 띄우기
                            pattern="[0-9]*" // HTML5 패턴 (일부 브라우저에서 유효성 검사 도움)
                        />
                        <button
                            onClick={handleBidClick}
                            style={{ ...modalStyles.actionButton, ...modalStyles.bidButton }}
                        >
                            💰 입찰하기
                        </button>
                    </div>
                </div>

                {/* 일반 상세 정보 그룹 */}
                <div style={modalStyles.detailGroup}>
                    <h3 style={modalStyles.detailGroupTitle}>상세 정보</h3>
                    <div style={modalStyles.detailItemsGrid}>
                        <DetailItem label="순번" value={item.rnum} />
                        <DetailItem label="공매계획번호" value={item.plnmNo} />
                        <DetailItem label="물건관리번호" value={item.cltrMnmtNo} />
                        <DetailItem label="공고조건번호" value={item.pbctCdtnNo} />
                        <DetailItem label="물건번호" value={item.cltrNo} />
                        <DetailItem label="물건이력번호" value={item.cltrHstrNo} />
                        <DetailItem label="화면그룹코드" value={item.scrnGrpCd} />
                        <DetailItem label="카테고리" value={item.ctgrFullNm} />
                        <DetailItem label="입찰관리번호" value={item.bidMnmtNo} />
                        <DetailItem label="지번주소" value={item.ldnmAdrs} />
                        <DetailItem label="도로명주소" value={item.nmrdAdrs} />
                        <DetailItem label="지번고유번호" value={item.ldnmPnu} />
                        <DetailItem label="처분방법코드" value={item.dpslMtdCd} />
                        <DetailItem label="처분방법명" value={item.dpslMtdNm} />
                        <DetailItem label="입찰방법명" value={item.bidMtdNm} />
                        <DetailItem label="최저입찰가" value={formatCurrency(item.minBidPrc)} />
                        <DetailItem label="감정평가평균금액" value={formatCurrency(item.apslAsesAvgAmt)} />
                        <DetailItem label="수수료율" value={item.feeRate ? item.feeRate : '-'} />
                        <DetailItem label="공고번호" value={item.pbctNo} />
                        <DetailItem label="공고시작일시" value={item.pbctBegnDtm} />
                        <DetailItem label="공고종료일시" value={item.pbctClsDtm} />
                        <DetailItem label="공고물건상태명" value={item.pbctCltrStatNm} />
                        <DetailItem label="유찰회수" value={item.uscbdCnt} />
                        <DetailItem label="조회건수" value={item.iqryCnt} />
                    </div>
                </div>

                {/* 차량 관련 정보 (있다면 표시) */}
                {(item.manf || item.mdl || item.nrgt || item.grbx || item.endpc || item.vhclMlge || item.fuel) && (
                    <div style={modalStyles.detailGroup}>
                        <h3 style={modalStyles.detailGroupTitle}>차량 정보</h3>
                        <div style={modalStyles.detailItemsGrid}>
                            <DetailItem label="제조사" value={item.manf} />
                            <DetailItem label="모델" value={item.mdl} />
                            <DetailItem label="배기량" value={item.nrgt} />
                            <DetailItem label="변속기" value={item.grbx} />
                            <DetailItem label="최종출력" value={item.endpc} />
                            <DetailItem label="주행거리" value={item.vhclMlge} />
                            <DetailItem label="연료" value={item.fuel} />
                        </div>
                    </div>
                )}
                {/* 기타 품목 정보 */}
                {(item.scrtNm || item.tpbz || item.itmNm || item.mmbRgtNm) && (
                    <div style={modalStyles.detailGroup}>
                        <h3 style={modalStyles.detailGroupTitle}>기타 품목 정보</h3>
                        <div style={modalStyles.detailItemsGrid}>
                            <DetailItem label="보증서명" value={item.scrtNm} />
                            <DetailItem label="업종" value={item.tpbz} />
                            <DetailItem label="품목명" value={item.itmNm} />
                            <DetailItem label="회원권종명" value={item.mmbRgtNm} />
                        </div>
                    </div>
                )}

                {/* 이미지 다운로드 링크 섹션 */}
                {imageUrls.length > 0 && (
                    <div style={modalStyles.imageDownloadSection}>
                        <h3 style={modalStyles.imageDownloadTitle}>물건 이미지 파일 (클릭 시 다운로드)</h3>
                        <div style={modalStyles.imageDownloadGrid}>
                            {imageUrls.map((url, idx) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={modalStyles.imageDownloadLink}
                                >
                                    이미지 {String(idx + 1).padStart(2, '0')} 다운로드
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* 물품명세 상세 설명 (goodsNm 값이 있을 경우에만 표시) */}
                {item.goodsNm && (
                    <div style={modalStyles.descriptionSection}>
                        <h3 style={modalStyles.descriptionTitle}>물품명세 상세 설명</h3>
                        <p style={modalStyles.descriptionContent}>
                            {item.goodsNm}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );


};


const modalStyles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000
    },
    content: {
        backgroundColor: 'white', padding: '30px', borderRadius: '10px',
        maxWidth: '1000px', width: '95%', maxHeight: '95vh', overflowY: 'auto',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: '14px',
        color: '#333'
    },
    closeButton: {
        position: 'absolute', top: '15px', right: '15px',
        background: 'none', border: 'none', fontSize: '2em',
        cursor: 'pointer', color: '#666', lineHeight: '1'
    },
    title: {
        borderBottom: '2px solid #007bff', paddingBottom: '5px', marginBottom: '15px',
        color: '#2c3e50', fontWeight: '700', fontSize: '1.6em'
    },
    // 버튼 컨테이너: 좌우 정렬을 위해 space-between 사용
    buttonContainer: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px',
        flexWrap: 'wrap', // 화면 작아질 때 줄바꿈
        gap: '20px', // 아이템 간 간격
    },
    actionButton: {
        padding: '7px 18px', border: '1px solid', borderRadius: '5px',
        cursor: 'pointer', fontSize: '0.95em', fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
    favoriteButton: {
        //backgroundColor: 'white', borderColor: '#6c757d', color: '#6c757d',
    },
    bidButton: {
        //backgroundColor: '#007bff', borderColor: '#007bff', color: 'white',
    },
    // 입찰 금액 input 스타일 추가
    bidAmountInput: {
        padding: '9px 12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '0.95em',
        minWidth: '120px',
        textAlign: 'right', // 금액은 오른쪽 정렬
        flexGrow: 1, // 남는 공간 채우도록
        maxWidth: '200px' // 너무 길어지지 않게
    },
    // 입찰 관련 버튼과 인풋을 그룹화할 컨테이너
    bidControls: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'nowrap' // 이 그룹 안에서는 줄바꿈 안 되도록
    },
    detailGroup: { /* ... 기존 스타일 유지 ... */ marginBottom: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fdfdfd' },
    detailGroupTitle: { /* ... 기존 스타일 유지 ... */ backgroundColor: '#eef', padding: '12px 15px', borderBottom: '1px solid #ccc', fontSize: '1.1em', fontWeight: 'bold', color: '#333', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' },
    detailItemsGrid: { /* ... 기존 스타일 유지 ... */ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', padding: '15px' },
    detailItem: { /* ... 기존 스타일 유지 ... */ display: 'flex', borderBottom: '1px dashed #f0f0f0', paddingBottom: '8px', marginBottom: '8px', alignItems: 'baseline' },
    detailLabel: { /* ... 기존 스타일 유지 ... */ fontWeight: 'bold', color: '#555', minWidth: '90px', marginRight: '10px', flexShrink: 0 },
    detailValue: { /* ... 기존 스타일 유지 ... */ color: '#333', flexGrow: 1 },
    imageDownloadSection: { /* ... 기존 스타일 유지 ... */ marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' },
    imageDownloadTitle: { /* ... 기존 스타일 유지 ... */ color: '#34495e', marginBottom: '15px', fontSize: '1.1em', fontWeight: '600' },
    imageDownloadGrid: { /* ... 기존 스타일 유지 ... */ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' },
    imageDownloadLink: { /* ... 기존 스타일 유지 ... */ display: 'inline-block', padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', borderRadius: '5px', textDecoration: 'none', fontWeight: 'normal', fontSize: '0.9em', whiteSpace: 'nowrap' },
    descriptionSection: { /* ... 기존 스타일 유지 ... */ borderTop: '1px solid #eee', paddingTop: '20px' },
    descriptionTitle: { /* ... 기존 스타일 유지 ... */ color: '#34495e', marginBottom: '15px', fontSize: '1.1em', fontWeight: '600' },
    descriptionContent: { /* ... 기존 스타일 유지 ... */ backgroundColor: '#f8f8f8', padding: '18px', borderRadius: '5px', border: '1px solid #ddd', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95em', color: '#555' }
};

export default DetailModal;