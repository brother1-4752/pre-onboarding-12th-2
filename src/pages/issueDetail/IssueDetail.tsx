import { useLoaderData, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { issueDetailReposResponse } from '../../api/getReactIssuesInfo';
import { makeCreatedData } from '../../utils/makeCreatedDate';

export default function IssueDetail() {
  const response = useLoaderData() as issueDetailReposResponse;
  const reactIssueDetail = response.data;

  const router = useNavigate();

  return (
    <StyledDetail>
      <div className='detail__header'>
        <img
          className='detail__img'
          src={`${reactIssueDetail.user?.avatar_url}`}
          alt='유저 프로필 이미지'
        />
        <div className='detail__info'>
          <h1 className='detail__info--issue'>
            #{reactIssueDetail.number} {reactIssueDetail.title}
          </h1>
          <p className='detail__info--user'>
            작성자:{reactIssueDetail.user?.login}, 작성일:
            {makeCreatedData(reactIssueDetail.created_at)}
          </p>
        </div>
        <div className='detail__comments'>
          코멘트:{reactIssueDetail.comments}
        </div>
      </div>
      <div className='detail__body'>
        {reactIssueDetail.body
          ?.split('\n')
          .map((paragraph: any, index: number) => (
            <p key={index}>
              <br />
              {paragraph}
            </p>
          ))}
      </div>
    </StyledDetail>
  );
}

const StyledDetail = styled.section`
  width: 90%;
  height: 75%;
  position: relative;

  .detail__header {
    display: flex;
    position: relative;
    .detail__img {
      width: 100px;
      margin-right: 15px;
      border-radius: 15px;
    }

    .detail__info {
      margin-right: 70px;
      .detail__info--issue {
        font-size: 30px;
        margin: 10px 0 5px 0;
      }
      .detail__info--user {
        font-size: 18px;
      }
    }

    .detail__comments {
      height: 100%;
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
    }
  }

  .detail__body {
    margin: 20px 0;
    padding: 20px;
    font-size: 18px;
    border: 1px solid green;
    color: green;
    border-radius: 15px;
  }
`;
