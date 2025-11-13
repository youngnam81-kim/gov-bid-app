// src/css/DetailModal.styles.js
// DetailModal 컴포넌트의 모든 스타일 정의

export const modalStyles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000
    },
    modal: { // content 스타일과 modal 스타일 통합
        backgroundColor: 'white', padding: '30px', borderRadius: '10px',
        maxWidth: '1000px', width: '95%', maxHeight: '95vh', overflowY: 'auto',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: '14px',
        color: '#333',
        display: 'flex', // flexbox로 내부 요소 배치
        flexDirection: 'column',
        gap: '20px', // 섹션 간 간격
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
        padding: '15px',
        backgroundColor: '#eef',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    actionButton: {
        padding: '7px 18px', border: '1px solid', borderRadius: '5px',
        cursor: 'pointer', fontSize: '0.95em', fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
    favoriteButton: {
        backgroundColor: '#f0ad4e', // 기본 즐겨찾기 버튼 색상
        color: 'white',
        border: '1px solid #eea236',
    },
    favoriteButtonActive: { // 즐겨찾기 활성화 시 더 밝은 노란색
        backgroundColor: '#ffc107',
        color: 'white',
        border: '1px solid #ffaa00',
    },
    bidControls: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexGrow: 1, // 남는 공간 채우도록
        flexWrap: 'nowrap' // 이 그룹 안에서는 줄바꿈 안 되도록
    },
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
    bidButton: {
        backgroundColor: '#007bff', // 기본 입찰 버튼 색상
        color: 'white',
        border: '1px solid #007bff',
    },
    bidStatusInfo: { // 입찰 완료 시 나의 입찰액 표시 스타일
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#28a745',
        textAlign: 'center',
    },
    detailGroup: {
        marginBottom: '20px',
        border: '1px solid #eee',
        borderRadius: '8px',
        backgroundColor: '#fdfdfd'
    },
    detailGroupTitle: {
        backgroundColor: '#eef', padding: '12px 15px', borderBottom: '1px solid #ccc',
        fontSize: '1.1em', fontWeight: 'bold', color: '#333',
        borderTopLeftRadius: '8px', borderTopRightRadius: '8px'
    },
    detailItemsGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '15px', padding: '15px'
    },
    detailItem: {
        display: 'flex', borderBottom: '1px dashed #f0f0f0', paddingBottom: '8px', marginBottom: '8px', alignItems: 'baseline'
    },
    detailLabel: {
        fontWeight: 'bold', color: '#555', minWidth: '90px', marginRight: '10px', flexShrink: 0
    },
    detailValue: {
        color: '#333', flexGrow: 1
    },
    imageContainer: {
        display: 'flex',
        overflowX: 'auto',
        gap: '10px',
        paddingBottom: '10px',
        scrollbarWidth: 'thin', // 파이어폭스
        scrollbarColor: 'lightgray transparent', // 파이어폭스
    },
    image: {
        minWidth: '150px', // 이미지 최소 너비
        width: '150px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '5px',
        border: '1px solid #ddd',
        flexShrink: 0, // 이미지가 축소되지 않도록
    },
    imagePlaceholder: {
        minWidth: '150px',
        width: '150px',
        height: '100px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '5px',
        color: '#888',
        fontSize: '14px',
        border: '1px solid #ddd',
        flexShrink: 0,
    },
    imageDownloadSection: { /* ... 기존 스타일 유지 ... */ marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' },
    imageDownloadTitle: { /* ... 기존 스타일 유지 ... */ color: '#34495e', marginBottom: '15px', fontSize: '1.1em', fontWeight: '600' },
    imageDownloadGrid: { /* ... 기존 스타일 유지 ... */ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' },
    imageDownloadLink: { /* ... 기존 스타일 유지 ... */ display: 'inline-block', padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', borderRadius: '5px', textDecoration: 'none', fontWeight: 'normal', fontSize: '0.9em', whiteSpace: 'nowrap' },
};
