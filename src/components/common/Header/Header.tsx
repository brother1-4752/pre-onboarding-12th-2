import { useLocation, useNavigate } from 'react-router-dom';
import { StyledHeader } from './Header.styled';

export default function Header() {
  const router = useNavigate();
  const location = useLocation();
  return (
    <StyledHeader>
      <h1>Facebook / React Issues List</h1>
      {location.pathname.includes('issue') && (
        <button className='backBtn' onClick={() => router(-1)}>
          목록으로 가기
        </button>
      )}
    </StyledHeader>
  );
}
