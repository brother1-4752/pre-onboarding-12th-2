import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  get_react_issues_list,
  issueListReposResponse,
} from '../../api/getReactIssuesInfo';
import { makeCreatedData } from '../../utils/makeCreatedDate';
import { ListContainer } from './IssueList.styled';

export default function IssueList() {
  const response = useLoaderData() as issueListReposResponse;
  const [issuesList, setIssuesList] = useState([...response.data]);
  const [page, setPage] = useState<number>(2);
  const targetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useNavigate();
  console.log(issuesList);

  const routeToDetail = (issue: any) => {
    sessionStorage.setItem('issuesList', JSON.stringify(issuesList));
    sessionStorage.setItem('page', JSON.stringify(page));

    if (issue !== undefined) {
      router(`/issue/${issue.number}`);
    }
  };

  const restoreSessionData = () => {
    const sessionIssueList = sessionStorage.getItem('issuesList');
    const sessionPage = sessionStorage.getItem('page');
    if (sessionIssueList && sessionPage) {
      setIssuesList(JSON.parse(sessionIssueList));
      setPage(JSON.parse(sessionPage));
    }
  };

  useEffect(() => {
    restoreSessionData();
  }, []);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const fetchItems = async () => {
    try {
      const response = await get_react_issues_list(page);
      if (response) {
        const only_issue_data = response.data.filter(
          (issue) =>
            !Object.prototype.hasOwnProperty.call(issue, 'pull_request')
        );
        loadMore();
        return only_issue_data;
      }
    } catch (error) {
      console.error('데이터 가져오기 오류', error);
      return [];
    }
  };

  const handleIntersect = async (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    if (entries[0].isIntersecting && !isLoading) {
      setIsLoading(true);
      observer.unobserve(entries[0].target);

      try {
        const newItems = (await fetchItems()) as issueListReposResponse['data'];
        setIssuesList((prev) => [...prev, ...newItems]);
      } finally {
        observer.observe(entries[0].target);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 1,
    });
    if (targetRef.current) {
      observer.observe(targetRef.current);
    }
    return () => observer.disconnect();
  }, [handleIntersect, targetRef.current, page, isLoading]);

  return (
    <ListContainer>
      {issuesList &&
        issuesList.map((issue: any, index: number) => (
          <div key={issue.number} className='listitem__container'>
            <li className='listitem' onClick={() => routeToDetail(issue)}>
              <div>
                <h3>
                  #{issue.number} {issue.title}
                </h3>
                <p>
                  작성자: {issue.user && issue.user.login}, 작성일:{' '}
                  {makeCreatedData(issue.created_at)}
                </p>
              </div>
              <div>{issue.comments}</div>
            </li>
            {(index + 1) % 4 === 0 && (
              <Link
                target='_blank'
                to='https://www.wanted.co.kr/ '
                key={issue.id}
              >
                <img
                  style={{ width: '100%' }}
                  src={`mockAddImage${(Math.floor(index / 4) % 4) + 1}.png`}
                  alt='광고이미지'
                />
              </Link>
            )}
          </div>
        ))}
      {isLoading ? null : <div className='target' ref={targetRef}></div>}
    </ListContainer>
  );
}
