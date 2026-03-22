// 환경변수 VITE_API_URL을 사용하여 API 주소를 설정
// 로컬 개발: .env에서 VITE_API_URL=http://localhost:8800
// Vercel 배포: 환경변수에서 VITE_API_URL=https://decarbon-dev.onrender.com
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8800';
export default API_BASE;
