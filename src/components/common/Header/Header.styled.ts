import { styled } from 'styled-components';

export const StyledHeader = styled.header`
  width: 100vw;
  line-height: 70px;
  position: fixed;
  top: 0;
  z-index: 10;
  font-size: 30px;
  text-align: center;
  border-bottom: 1px solid black;
  background-color: white;

  .backBtn {
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
