import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function Header() {
  const router = useNavigate();
  const location = useLocation();
  return (
    <StyledHeader>
      <h1>Facebook / React Issues List</h1>
      {location.pathname.includes('issue') && (
        <button className='detail__btn' onClick={() => router(-1)}>
          목록으로 가기
        </button>
      )}
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  width: 100vw;
  line-height: 70px;
  position: fixed;
  top: 0;
  font-size: 30px;
  border-bottom: 1px solid black;
  text-align: center;
  background-color: white;
  z-index: 10;

  .detail__btn {
    position: absolute;
    left: 15px;
    top: 15px;
    border: none;
    border-radius: 8px;
    border: 1px solid green;
    color: green;
    background-color: white;
    padding: 12px 8px;

    &:hover {
      border: 1px solid white;
      color: white;
      background-color: green;
      cursor: pointer;
    }
  }
`;
