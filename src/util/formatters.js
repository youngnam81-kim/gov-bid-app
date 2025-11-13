// src/util/formatters.js
// 프로젝트 전체에서 사용되는 포맷팅 함수 통합 모음

/**
 * 금액을 포맷팅하는 헬퍼 함수 (최저입찰가 등 표시에 사용)
 * @param {string|number} value - 포맷팅할 금액
 * @returns {string} 포맷팅된 금액 (예: "1,000,000원")
 */
export const formatCurrency = (value) => {
    if (!value) return '-';
    // 콤마가 포함된 문자열 또는 숫자 모두 처리 가능하도록
    const num = parseInt(String(value).replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(num);
};

/**
 * 날짜/시간 문자열을 포맷팅하는 헬퍼 함수
 * @param {string} dateTimeString - "YYYYMMDDHHMISS" 형식의 문자열
 * @returns {string} 포맷팅된 날짜/시간 (예: "2025. 11. 12. 14:30:00")
 */
export const formatDateTime = (dateTimeString) => {
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
    } catch (error) {
        console.error('날짜 포맷팅 중 오류:', error);
        return dateTimeString; // 오류 발생 시 원본 문자열 반환
    }
};

/**
 * 숫자만 입력받고 천 단위 콤마를 추가하는 함수 (입찰 금액 input에 사용)
 * @param {string|number} value - 입력값
 * @returns {string} 천 단위 콤마가 추가된 문자열
 */
export const formatBidAmountInput = (value) => {
    const rawValue = String(value).replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 천 단위 콤마 추가
};

/**
 * 콤마로 구분된 URL 문자열을 배열로 변환하는 헬퍼 함수
 * @param {string} cltrImgFilesString - 콤마로 구분된 URL 문자열
 * @returns {Array<string>} URL 배열
 */
export const getImageUrls = (cltrImgFilesString) => {
    if (!cltrImgFilesString) return [];
    return cltrImgFilesString.split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);
};
