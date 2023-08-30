import styled from 'styled-components';

export const ListContainer = styled.ul`
  width: 100%;
  height: 75%;

  display: flex;
  flex-direction: column;
  align-items: center;

  .listitem__container {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .listitem {
      display: flex;

      justify-content: space-between;
      align-items: center;
    }

    .listitem,
    .add {
      width: 90%;
      height: 50px;
      margin-bottom: 10px;
      padding: 15px;
      border-bottom: 1px solid black;

      &:hover {
        color: white;
        background-color: green;
        cursor: pointer;
      }
    }

    .add {
      background-color: green;
      text-decoration: none;
      color: white;
    }
  }
`;
