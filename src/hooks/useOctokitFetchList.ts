import { useCallback, useEffect, useRef, useState } from 'react';
import { Octokit } from 'octokit';
import { Endpoints } from '@octokit/types';

export type issueListReposResponse = Endpoints['GET /repos/{owner}/{repo}/issues']['response'];
export type issueDetailReposResponse = Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}']['response'];
const octokit = new Octokit({ auth: process.env.REACT_APP_OCTOKIT_TOKEN });

const useOctokitfetchList = () => {
  const [page, setPage] = useState<number>(1);

  const [issuesList, setIssuesList] = useState<issueListReposResponse['data']>([]);
  const [isLoading, setIsLoading] = useState(false); //데이터 페칭여부 로딩상태
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false); //무한스크롤용 로딩스피너 상태

  const options = {
    owner: 'facebook',
    repo: 'react',
    state: 'open',
    sort: 'comments',
    per_page: 30,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  } as const;

  const fetchList = useCallback((pageNumber: number) => {
    setIsInfiniteLoading(true);
    octokit
      .request('GET /repos/{owner}/{repo}/issues', {
        page: pageNumber,
        ...options,
      })
      .then((response) => {
        setIssuesList((prev) => [...prev, ...response.data]);
        console.log(pageNumber, '\n');
        console.log(issuesList);
      })
      .catch((error) => {
        if (error instanceof Error) {
          throw new Error(`${error.message}`);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsInfiniteLoading(false);
      });
  }, []);

  const refetch = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchList(page);
    console.log('refetch');
  }, [page]);

  return { issuesList, isLoading, isInfiniteLoading, refetch };
};

export default useOctokitfetchList;
