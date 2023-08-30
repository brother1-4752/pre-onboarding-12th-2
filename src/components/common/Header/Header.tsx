import { useLocation, useNavigate } from 'react-router-dom';
import { StyledHeader } from './Header.styled';

export default function Header() {
  const router = useNavigate();
  const location = useLocation();
  return (
    <StyledHeader>
      <h1>Facebook / React Issues List</h1>
      {location.pathname.includes('issue') && (
        //TODO: 클릭한 상세 화면의 id를 기억했다가, 이슈리스트화면으로 복귀할때 그 height에 맞게 스크롤 위치가 딱 들어가야됨 그래야 ux가 더 개선될듯
        <button className='backBtn' onClick={() => router(-1)}>
          목록으로 가기
        </button>
      )}
    </StyledHeader>
  );
}
