// src/components/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import DetailModal from '../common/DetailModal-backup.jsx';
import api from '../../api/index.js'; // 백엔드 호출용 Axios 인스턴스 임포트

// 필드 정의: 각 컬럼에 대한 정보 (헤더 이름, 데이터 키, 정렬 가능 여부 등)
const FIELD_DEFINITIONS = [
    { key: "cltrMnmtNo", title: "물건관리번호" },
    // { key: "pbctCdtnNo", title: "공고조건번호" }, 
    // { key: "cltrNo", title: "물건번호" },
    { key: "cltrHstrNo", title: "물건이력번호", sortable: true },
    // { key: "scrnGrpCd", title: "화면그룹코드" },
    { key: "ctgrFullNm", title: "카테고리" },
    // { key: "bidMnmtNo", title: "입찰관리번호" },
    { key: "cltrNm", title: "물건명" },
    // { key: "ldnmAdrs", title: "지번주소" },
    // { key: "nmrdAdrs", title: "도로명주소" },
    // { key: "ldnmPnu", title: "지번고유번호" },
    // { key: "dpslMtdCd", title: "처분방법코드" },
    // { key: "dpslMtdNm", title: "처분방법명" },
    // { key: "bidMtdNm", title: "입찰방법명" },
    { key: "minBidPrc", title: "최저입찰가", sortable: true },
    // { key: "apslAsesAvgAmt", title: "감정평가평균금액" },
    { key: "feeRate", title: "수수료율" },
    // { key: "pbctNo", title: "공고번호" },
    { key: "pbctBegnDtm", title: "공고시작일시" },
    { key: "pbctClsDtm", title: "공고종료일시" },
    { key: "pbctCltrStatNm", title: "공고물건상태명" },
    // { key: "uscbdCnt", title: "유찰회수" },
    // { key: "iqryCnt", title: "조회건수" },
    { key: "imageLinks", title: "이미지" },
];


function DashboardPage() {
    const { isAuthenticated } = useSelector(state => state.auth);
    const [auctionItems, setAuctionItems] = useState([]); // API로부터 받은 원본 데이터
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 필터링 및 페이징 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [prptDvsnCd, setPrptDvsnCd] = useState('0001'); // 물건구분코드
    const [cltrNm, setCltrNm] = useState(''); // 물건명 검색어

    // 지역 input text 필드
    const [sido, setSido] = useState('서울특별시');
    const [sgk, setSgk] = useState('성북구');
    const [emd, setEmd] = useState('성북동');

    // 페이지네이션 관련 상수
    const DEFAULT_NUM_OF_ROWS = 10;
    const PAGE_RANGE_SIZE = 10;

    // 모달 관련 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // ======== 정렬 관련 상태 ========
    const [sortKey, setSortKey] = useState(null); // 현재 정렬 기준 컬럼 키
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' (오름차순) | 'desc' (내림차순)

    // ==== 헬퍼 함수: 통화 및 날짜/시간 포맷팅 ====
    const formatCurrency = (value) => {
        if (!value) return '-';
        const num = parseInt(String(value).replace(/,/g, ''), 10);
        if (isNaN(num)) return '-';
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(num);
    };

    const formatDateTime = (dateTimeString) => {
        if (dateTimeString === undefined || dateTimeString === null || dateTimeString === '') return '-';
        try {
            // "YYYYMMDDHHMISS" 형식의 문자열을 Date 객체로 변환
            const year = dateTimeString.substring(0, 4);
            const month = dateTimeString.substring(4, 6);
            const day = dateTimeString.substring(6, 8);
            const hour = dateTimeString.substring(8, 10);
            const minute = dateTimeString.substring(10, 12);
            const second = dateTimeString.substring(12, 14);

            // Date 객체를 생성할 때 월은 0부터 시작하므로 -1
            const date = new Date(year, month - 1, day, hour, minute, second);

            // 유효한 Date 객체인지 확인
            if (isNaN(date.getTime())) {
                return dateTimeString; // 변환 실패 시 원본 문자열 반환
            }

            return new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // 24시간 형식
            }).format(date);
        } catch (e) {
            console.error("날짜 포맷 오류:", e);
            return dateTimeString; // 오류 발생 시 원본 문자열 반환
        }
    };

    // API 호출 함수 ( useCallback으로 래핑하여 불필요한 재생성 방지)
    const fetchAuctionItems = useCallback(async (page, currentFilters) => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                numOfRows: DEFAULT_NUM_OF_ROWS,
                pageNo: page,
                prptDvsnCd: currentFilters.prptDvsnCd,
            };

            // 지역 필터 (값이 있을 경우에만 추가)
            if (currentFilters.sido) params.sido = currentFilters.sido;
            if (currentFilters.sgk) params.sgk = currentFilters.sgk;
            if (currentFilters.emd) params.emd = currentFilters.emd;
            if (currentFilters.cltrNm) params.cltrNm = currentFilters.cltrNm;

            console.log("백엔드 프록시 API 호출 파라미터:", params);
            const response = await api.get('/onbid/list', { params });

            console.log("온비드 데이터 응답:", response.data);
            setAuctionItems(response.data.items || []); // 받아온 데이터를 저장
            setTotalCount(response.data.totalCount || 0);

        } catch (err) {
            console.error("온비드 데이터 로드 중 오류 발생:", err);
            setError("온비드 데이터를 불러오는데 실패했습니다. 백엔드 프록시 API를 확인해주세요.");
            setAuctionItems([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [DEFAULT_NUM_OF_ROWS]); // DEFAULT_NUM_OF_ROWS는 상수이므로 여기에 넣어줍니다.

    // 컴포넌트 첫 로드 및 인증 상태 변경 시 데이터 로드
    useEffect(() => {
        if (!isAuthenticated) { // 인증되지 않았다면 API 호출 안함
            return;
        }
        // 첫 로드 시 현재 필터 상태를 묶어서 fetchAuctionItems에 전달하여 조회
        fetchAuctionItems(currentPage, { prptDvsnCd, sido, sgk, emd, cltrNm });
    }, [isAuthenticated, fetchAuctionItems, currentPage, prptDvsnCd, sido, sgk, emd, cltrNm]);


    // 검색 실행 및 페이지 변경을 담당하는 함수 (useCallback으로 래핑)
    const triggerSearch = useCallback((pageToFetch = 1) => {
        setCurrentPage(pageToFetch); // 현재 페이지 상태 업데이트

        const currentFilters = { // 현재 필터 값들을 객체로 묶음
            prptDvsnCd, sido, sgk, emd, cltrNm,
        };
        fetchAuctionItems(pageToFetch, currentFilters); // API 호출
    }, [prptDvsnCd, sido, sgk, emd, cltrNm, fetchAuctionItems]);


    // 검색 버튼 클릭 핸들러
    const handleSearchButtonClick = () => {
        triggerSearch(1); // 검색 버튼 클릭 시 1페이지부터 다시 검색 시작
    };

    // 모달 열기 함수 (useCallback으로 래핑)
    const openDetailModal = useCallback((item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    }, []);

    // 모달 닫기 함수 (useCallback으로 래핑)
    const closeDetailModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedItem(null); // 선택된 아이템 초기화
    }, []);


    // ======== 정렬 핸들러 ========
    const handleSort = useCallback((key) => {
        if (!key) return; // 유효한 키가 아니면 정렬하지 않음

        // 현재 정렬 기준 키와 동일하면 정렬 방향만 변경 (오름차순 <-> 내림차순)
        if (sortKey === key) {
            setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
        } else { // 새로운 키로 정렬 시, 기본은 오름차순으로 시작
            setSortKey(key);
            setSortDirection('asc');
        }
    }, [sortKey]); // sortKey가 변경될 때만 재생성


    // ======== 정렬된 아이템 목록 계산 ========
    // auctionItems, sortKey, sortDirection 중 하나라도 변경될 때만 다시 계산
    const sortedAuctionItems = useMemo(() => {
        // 정렬 기준이 없거나 데이터가 비어있으면 원본 데이터를 그대로 반환
        if (!sortKey || auctionItems.length === 0) {
            return auctionItems;
        }

        const sorted = [...auctionItems].sort((a, b) => { // 원본 배열을 복사하여 정렬
            const valA = a[sortKey];
            const valB = b[sortKey];

            // null 또는 undefined 값 처리 (정렬 시 가장 마지막으로 보내는 것이 일반적)
            if (valA === null || valA === undefined) return sortDirection === 'asc' ? 1 : -1;
            if (valB === null || valB === undefined) return sortDirection === 'asc' ? -1 : 1;

            // 숫자형 필드 정렬 로직 (예: minBidPrc, iqryCnt)
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            }
            // 날짜/시간 문자열 필드 정렬 로직 (예: pbctBegnDtm, pbctClsDtm)
            if (sortKey.includes('Dtm')) { // 'Dtm'이 포함된 필드는 날짜/시간 문자열로 간주
                const dateA = new Date(valA);
                const dateB = new Date(valB);
                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) { // 날짜 변환이 유효하지 않은 경우 비교하지 않음
                    return 0;
                }
                // 날짜 객체의 타임스탬프를 사용하여 비교
                return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            }
            // 그 외 문자열 필드 정렬 로직
            // toLowerCase()로 대소문자 구분 없이, localeCompare()로 한국어 정렬 지원
            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
        return sorted;
    }, [auctionItems, sortKey, sortDirection]); // 의존성 배열에 관련 상태들을 추가


    // 페이지네이션 컴포넌트 (ApiBoardPage 내부에 정의)
    const Pagination = () => {
        const totalPages = Math.ceil(totalCount / DEFAULT_NUM_OF_ROWS); // 총 페이지 수 계산
        if (totalPages <= 1) return null; // 페이지가 1개 이하면 페이지네이션 미표시

        const currentBlock = Math.ceil(currentPage / PAGE_RANGE_SIZE); // 현재 페이지 블록 계산
        const startPageInBlock = (currentBlock - 1) * PAGE_RANGE_SIZE + 1; // 현재 블록의 시작 페이지
        const endPageInBlock = Math.min(totalPages, currentBlock * PAGE_RANGE_SIZE); // 현재 블록의 마지막 페이지

        const pageNumbers = []; // 현재 블록에 표시할 페이지 번호 배열
        for (let i = startPageInBlock; i <= endPageInBlock; i++) {
            pageNumbers.push(i);
        }

        return (
            <div style={paginationStyle}> {/* 스타일 적용 */}
                {/* 첫 페이지로 이동 버튼 */}
                <button
                    onClick={() => triggerSearch(1)}
                    disabled={currentPage === 1}
                    style={paginationButtonStyle} // 스타일 적용
                >
                    &lt;&lt;
                </button>
                {/* 이전 블록으로 이동 버튼 */}
                <button
                    onClick={() => triggerSearch(Math.max(1, startPageInBlock - PAGE_RANGE_SIZE))}
                    disabled={startPageInBlock === 1}
                    style={paginationButtonStyle} // 스타일 적용
                >
                    &lt;
                </button>

                {/* 페이지 번호 버튼들 */}
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => triggerSearch(number)}
                        // 현재 페이지 버튼에는 추가 스타일 적용
                        style={{ ...paginationButtonStyle, ...(currentPage === number ? currentPaginationButtonStyle : {}) }}
                    >
                        {number}
                    </button>
                ))}

                {/* 다음 블록으로 이동 버튼 */}
                <button
                    onClick={() => triggerSearch(Math.min(totalPages, endPageInBlock + PAGE_RANGE_SIZE))}
                    disabled={endPageInBlock === totalPages}
                    style={paginationButtonStyle} // 스타일 적용
                >
                    &gt;
                </button>
                {/* 마지막 페이지로 이동 버튼 */}
                <button
                    onClick={() => triggerSearch(totalPages)}
                    disabled={currentPage === totalPages}
                    style={paginationButtonStyle} // 스타일 적용
                >
                    &gt;&gt;
                </button>
            </div>
        );
    };

    // ==================== UI 스타일 정의 (영남님이 제공해주신 스타일로 업데이트) ====================
    const containerStyle = { padding: '0px', maxWidth: '1600px', margin: '0 auto' };

    // 헤더 스타일 (기존 유지, 더 깔끔하게 조정)
    const headerStyle = {
        color: '#2c3e50',
        marginBottom: '20px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        fontSize: '24px',
        fontWeight: 'bold',
        paddingLeft: '0px', // 좌측 패딩 제거
    };

    const filterContainerStyle = { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '15px', marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' };

    const filterGroupStyle_150 = { // 필터 그룹 스타일 (기존 유지)
        display: 'flex',
        flexDirection: 'column',
        minWidth: '150px',
    };
    const filterGroupStyle_300 = { // 필터 그룹 스타일 (기존 유지)
        display: 'flex',
        flexDirection: 'column',
        minWidth: '300px',
    };

    const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: '14px', fontWeight: 'bold', color: '#555', flexShrink: 0 };
    const selectStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', minWidth: '120px', marginTop: '5px', background: 'white' };
    const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', minWidth: '120px', marginTop: '5px' }; // 텍스트 인풋용으로 활용
    const searchButtonStyle = { padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', minWidth: '80px', height: 'fit-content', marginLeft: 'auto' };

    const tableContainerStyle = { overflowX: 'auto', marginTop: '20px', border: '1px solid #ddd', borderRadius: '8px' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: '800px' };
    const tableHeaderStyle = { backgroundColor: '#eef', padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ccc', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' };
    const tableCellStyle = { padding: '10px 15px', borderBottom: '1px solid #eee', verticalAlign: 'top', fontSize: '13px', whiteSpace: 'nowrap' };

    const paginationStyle = { display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '8px' };
    const paginationButtonStyle = { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', lineHeight: '1' };
    const currentPaginationButtonStyle = { backgroundColor: '#007bff', color: 'white', borderColor: '#007bff' };

    const loadingStyle = { textAlign: 'center', padding: '20px', fontSize: '16px', color: '#666' }; // 로딩 메시지
    const errorTextStyle = { ...loadingStyle, color: 'red' }; // 에러 메시지 스타일 분리
    const noDataStyle = { ...loadingStyle, color: '#6c757d' }; // 데이터 없음 메시지 (기존과 동일하게)

    // =========================================================================================


    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>관심 물건 조회</h1>

            {/* 필터 영역 */}
            <div style={filterContainerStyle}>
                <label style={filterGroupStyle_150}>
                    처분방법:
                    <select value={prptDvsnCd} onChange={(e) => {
                        setPrptDvsnCd(e.target.value);
                        setCurrentPage(1);
                    }} style={selectStyle}>
                        <option value="0001">매각</option>
                        <option value="0002">임대</option>
                    </select>
                </label>
                <div style={filterGroupStyle_300}>
                    <label htmlFor="cltrNm" style={labelStyle}>물건 부분 검색</label>
                    <input
                        type="text"
                        id="cltrNm"
                        value={cltrNm}
                        onChange={(e) => setCltrNm(e.target.value)}
                        placeholder="물건 부분 검색"
                        style={inputStyle} // inputStyle 적용
                    />
                </div>

                (총 {totalCount}건)<button onClick={handleSearchButtonClick} style={searchButtonStyle}>조회</button>
                {/* <button onClick={handleSearchButtonClick} style={searchButtonStyle}>검색</button> */}
            </div>


            {/* 로딩 및 에러 메시지 */}
            {loading && <p style={loadingStyle}>데이터를 불러오는 중입니다...</p>} {/* loadingStyle 적용 */}
            {error && <p style={errorTextStyle}>에러: {error}</p>} {/* errorTextStyle 적용 */}

            {/* 데이터가 없거나 로딩/에러 상태가 아닐 때 메시지 */}
            {!loading && !error && auctionItems.length === 0 && (
                <p style={noDataStyle}>조회된 데이터가 없습니다.</p>
            )}

            {/* 데이터 테이블 (로딩 중이 아니고 에러도 없으며 데이터가 있을 때만 표시) */}
            {!loading && !error && auctionItems.length > 0 && (
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                {FIELD_DEFINITIONS.map((field, index) => (
                                    <th key={index} style={tableHeaderStyle}> {/* key와 style 적용 */}
                                        {/* 정렬 가능한 필드에만 클릭 이벤트 및 정렬 아이콘 추가 */}
                                        {field.sortable ? (
                                            <span onClick={() => handleSort(field.key)} style={{ cursor: 'pointer' }}>
                                                {field.title}
                                                {sortKey === field.key && ( // 현재 정렬 기준일 때만 아이콘 표시
                                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                                )}
                                            </span>
                                        ) : (
                                            field.title // 정렬 불가능한 필드는 제목만 표시
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAuctionItems.map((item, itemIndex) => ( // <<-- 정렬된 데이터 사용
                                <tr key={itemIndex}>
                                    {FIELD_DEFINITIONS.map((field, colIndex) => (
                                        <td key={colIndex} style={tableCellStyle}>
                                            {field.key === "cltrMnmtNo" ? (
                                                <span
                                                    onClick={() => openDetailModal(item)}
                                                    style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                                                >
                                                    {item[field.key] || '-'}
                                                </span>
                                            ) :
                                                field.key === "minBidPrc" ? ( // 최저입찰가에 통화 포맷 적용
                                                    formatCurrency(item[field.key])
                                                ) :
                                                    field.key === "pbctBegnDtm" || field.key === "pbctClsDtm" ? ( // 공고시작/종료일시에 날짜 포맷 적용
                                                        formatDateTime(item[field.key])
                                                    ) :
                                                        field.key === "imageLinks" ? ( // 이미지 링크 처리
                                                            item.imageLinks && item.imageLinks.length > 0 ? (
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                                                    {item.imageLinks.map((linkInfo, idx) => (
                                                                        <a
                                                                            key={idx}
                                                                            href={linkInfo.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}
                                                                        >
                                                                            {String(idx + 1).padStart(2, '0')}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                '-'
                                                            )
                                                        ) : (
                                                            // 다른 필드들은 기본 출력
                                                            item[field.key] !== undefined && item[field.key] !== null ? String(item[field.key]) : ''
                                                        )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination /> {/* 페이지네이션 컴포넌트 렌더링 */}

            {/* 모달 */}
            {isModalOpen && (
                <DetailModal
                    isOpen={isModalOpen}
                    onClose={closeDetailModal}
                    item={selectedItem}
                />
            )}
        </div>
    );
}

export default DashboardPage;