import { Octokit } from 'octokit';
import { Endpoints } from '@octokit/types';

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
    return response;
  } catch (error: any) {
    console.error(error);
    const statusAppendedUrl = window.location.href + `?status=${error.status}`;
    if (!window.location.href.includes('?status')) {
      window.location.href = statusAppendedUrl;
    }
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
    console.log('try구문 안 영역');
    return response;
  } catch (error: any) {
    console.error(error);

    const statusAppendedUrl = window.location.href + `?status=${error.status}`;
    if (!window.location.href.includes('?status')) {
      window.location.href = statusAppendedUrl;
    }
  }
}
