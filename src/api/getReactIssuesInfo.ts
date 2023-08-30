import { Octokit } from 'octokit';
import { Endpoints } from '@octokit/types';
import { useNavigate } from 'react-router-dom';

export type issueListReposResponse =
  Endpoints['GET /repos/{owner}/{repo}/issues']['response'];
export type issueDetailReposResponse =
  Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}']['response'];
const octokit = new Octokit({ auth: process.env.REACT_APP_OCTOKIT_TOKEN });

export async function get_react_issues_list(pageNumber?: number) {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner: 'facebook',
      repo: 'react',
      state: 'open',
      sort: 'comments',
      page: pageNumber as number,
      per_page: 15,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (response.status !== 200) {
      //response.status를 url에 push하고 싶음
      //ts파일이라 useNavigate를 못씀
      //그래서 window객체로 제어하기로 함
      const statusAppendedUrl =
        window.location.href + `?status=${response.status}`;
      window.location.href = statusAppendedUrl;
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function get_react_issue_detail(issueId: number) {
  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/issues/{issue_number}',
      {
        owner: 'facebook',
        repo: 'react',
        issue_number: issueId,
        state: 'open',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}
