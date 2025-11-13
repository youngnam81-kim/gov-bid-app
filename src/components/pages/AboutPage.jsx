import React from 'react';

// AboutPage.jsx
const AboutPage = () => {
  // 인라인 스타일 (필요시 별도 CSS 파일로 분리 가능)
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '30px 20px',
      maxWidth: '1000px',
      margin: '20px auto',
      backgroundColor: '#fcfcfc',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
      lineHeight: '1.7',
      color: '#333',
      
    },
    header: {
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: '20px',
      fontSize: '2.5em',
      fontWeight: '700',
    },
    section: {
      marginBottom: '45px',
      backgroundColor: '#fcfcfc',
      padding: '30px',
      //borderRadius: '8px',
      //boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center', 
      gap: '30px', 
      flexWrap: 'wrap', 
      border: '0px solid #ccc'
    },
    // 이미지와 텍스트의 순서를 바꾸기 위한 flex-direction 제어 (홀수/짝수 섹션)
    sectionReverse: {
        flexDirection: 'row-reverse', // 이미지를 오른쪽에 배치
    },
    sectionContent: {
      flex: '2', 
      minWidth: '300px', 
      border: '0px solid #ccc'
    },
    sectionImage: {
      flex: '1', 
      maxWidth: '400px', // 이미지 최대 너비 강화 (픽셀 단위)
      minWidth: '250px', // 이미지 최소 너비
      height: '250px',   // 고정된 높이를 주어 이미지 레이아웃 예측 가능하게
      objectFit: 'cover', // 이미지 비율 유지하며 지정된 공간을 채우도록
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
      color: '#34495e',
      fontSize: '1.8em',
      marginBottom: '15px',
      borderBottom: '2px solid #3498db',
      paddingBottom: '10px',
      fontWeight: '600',
    },
    paragraph: {
      marginBottom: '15px',
      fontSize: '1.05em',
    },
    list: {
      listStyleType: 'disc',
      marginLeft: '25px',
      padding: '0',
    },
    listItem: {
      marginBottom: '8px',
      fontSize: '1em',
    },
    imageSource: {
      fontSize: '0.8em',
      color: '#777',
      textAlign: 'right',
      marginTop: '10px',
      marginBottom: '30px', // 다음 섹션과의 간격
      paddingRight: '30px', // 섹션의 패딩과 맞춤
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>온비드 공매 물건 서비스 소개</h1>

      {/* 1. 공고 및 물건 정보 조회 섹션 */}
      <div style={styles.section}>
        <img 
          src="https://picsum.photos/id/1018/700/400" // picsum.photos 이미지 링크로 변경 (700x400 사이즈)
          alt="온비드 물건 조회" 
          style={styles.sectionImage} 
        />
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>01. 공고 및 물건 정보 조회</h2>
          <p style={styles.paragraph}>
            전자 카탈로그를 통한 체계적이고 다양한 물건정보를 조회할 수 있습니다.
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>처분방법 및 물건용도별 물건상세정보 카탈로그 제공</li>
            <li style={styles.listItem}>
              감정평가서, 사진정보, 위치도, 인근시세정보, 지도정보, 토지이용계획 및 표준공시지가, 토지이용규제정보, 
              세금자동계산, 등기부등본 열람ㆍ발급 등 물건관련 부가정보를 한 번에 조회할 수 있습니다.
            </li>
          </ul>
          <p style={styles.paragraph}>
            공매물건을 다양한 조건과 방법으로 검색할 수 있습니다.
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              '물건검색'과 '공고검색' 코너에서 물건용도, 공고기관, 소재지, 최저입찰가격 등의 상세조건으로 검색
            </li>
            <li style={styles.listItem}>
              '통합검색'을 통해 물건, 공고, 입찰결과, 게시판 등을 통합하여 한 번에 검색
            </li>
            <li style={styles.listItem}>
              '지도검색' 코너에서 지도를 이용하여 물건을 편리하게 검색
            </li>
          </ul>
        </div>
      </div>
      {/* 2. 개인화된 정보관리 섹션 */}
      {/* sectionReverse 스타일을 적용하여 이미지와 텍스트 순서 변경 */}
      <div style={{ ...styles.section, ...styles.sectionReverse }}> 
        <img 
          src="https://picsum.photos/id/1005/700/400" // picsum.photos 이미지 링크로 변경
          alt="개인 정보 관리" 
          style={styles.sectionImage} 
        />
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>02. 개인화된 정보관리</h2>
          <p style={styles.paragraph}>
            사용자 맞춤형 서비스로 개인화된 정보 관리가 가능합니다.
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              관심있는 정보를 스크랩해 두었다가 다시 볼 수 있는 '관심물건ㆍ관심공고' 서비스 제공
            </li>
            <li style={styles.listItem}>
              자주 찾는 검색 조건을 미리 설정해 둘 수 있는 '맞춤물건ㆍ맞춤공고' 서비스
            </li>
            <li style={styles.listItem}>
              e-소식지를 신청한 회원은 정기적으로 이메일로 새로운 공고 정보를 받아볼 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
      {/* 3. 각종 통계 및 부가정보 섹션 */}
      <div style={styles.section}>
        <img 
          src="https://picsum.photos/id/1015/700/400" // picsum.photos 이미지 링크로 변경
          alt="통계 정보" 
          style={styles.sectionImage} 
        />
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>03. 각종 통계정보와 입찰 부가정보</h2>
          <p style={styles.paragraph}>
            성공적인 입찰을 위한 다양한 통계 정보와 유용한 부가 정보가 제공됩니다.
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              용도별, 지역별 낙찰가율 등 공ㆍ경매 관련 각종 통계정보를 상세하게 제공
            </li>
            <li style={styles.listItem}>
              부동산뉴스, 세금자동계산, 부동산권리분석 정보, 중고차 사고이력정보 등 입찰에 도움이 되는 부가 서비스
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;