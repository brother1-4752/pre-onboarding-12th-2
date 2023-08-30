import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
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

  const routeToDetail = (issue: any) => {
    sessionStorage.setItem('page', JSON.stringify(page));
    sessionStorage.setItem('issuesList', JSON.stringify(issuesList));

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

      //page에 엄청 큰 수를 넣을 수도 있으니까, response 정상적으로 값이 존재하면이라는 조건문을 달아주는거야
      if (response) {
        const only_issue_data = response.data.filter(
          (issue) =>
            //4. 넣고 싶은거!! issue data만 필터링한다.
            !Object.prototype.hasOwnProperty.call(issue, 'pull_request')
        );
        return only_issue_data;
      }
    } catch (error) {
      // catch 구문 void 형식으로 리턴되서 오류날까봐 빈 배열 리턴했는데 완전 잘못된 사고를 하고 있는 것 같다. ㅋㅋ
      console.error('데이터 가져오기 오류', error);
      // return [];
    }
  };

  //Refactor: useCallback으로 감쌈. 그리고 의존성 배열에 어떤 요소를 넣고 생략할지 고민하는중
  //궁금한거: useEffect의 의존성 배열로 isLoading이 들어가있어. 그러니까 아무리 eslint에서 isLoading이 들어갈 필요가 있다고 말해도, useEffect에서 만약에 isLoading이 바뀌면 트리거되는데, 중복해서 넣는게 비효율적으로 생각이 된다. 그래서 안 넣어야겠다.
  const handleIntersect = useCallback(
    async (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      //!isLoading = 로딩이 안되고 있다? 즉, targetRef가 아직 타치가 안되었다.
      if (entries[0].isIntersecting && !isLoading) {
        // 타치가 되었다!! true로 바꾸는거!
        setIsLoading(true);
        //prevent네. observer 이 녀석한테, 타치되었음을 알려주고, 중복 호출되지 않게(isIntersectionRatio가 계속 1일 수 있잖아. 즉, 계속 그 뷰포트 안에 보일 수 있잖아.) 그렇기 때문에 한번만 실행되게 하기 위함이다,

        // 아래도 필요없네. 왜냐하면 isLoading이 true가 되면 애초에 entries[0]은 없어져. 공중분해돼
        // observer.unobserve(entries[0].target);

        //한번만 호출되게 세팅했어? 이제 그럼 데이터페칭 준비할게. 일단 page +1해.
        //초기값이 2이니까, 밑에 loadmore하면 3되어야 되는거 아니야?
        loadMore();
        // console.log(page)

        try {
          // 1. 데이터 페칭함수 실행해서 새로운 데이터 가져왔어
          // 2. 그 새로운 데이터를 최신화했어. 어디에? issuesList 스테이트를 말이야
          const newItems =
            (await fetchItems()) as issueListReposResponse['data'];
          setIssuesList((prev) => [...prev, ...newItems]);
        } finally {
          setIsLoading(false); // false하면 targetRef인 divElement가 뿅 나와
          // observer.observe(entries[0].target); // 타겟이 나왔으니까, 다시 관찰해야겠지? 이거는 불필요해. 왜냐하면 현재 entries[0]은 isLoading이 true가 되
        }
      }
    },
    //fetchItems를 넣지 않으면 중복 호출됨. 왤까? 잘 모르겠음. 꼭 고민하기
    [fetchItems]
  );

  //effect, deps 파라미터로 받는다. effect가 명령형 함수라는데, 그게 머야?
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      //개발자 도구를 켜서 무한스크롤 체크하면 가끔 안 먹음? 왜 그럼, width에 따라서 되고 안되고가 결정되는데???
      threshold: 0.95,
    });

    //맨~~처음에 디폴트로 나타나있거나, 아니면 한번 옵져버해서 사라졌다가 데이터 페칭 끝나고, 다시 뿅 등장한 상황
    //위의 finally부분에서 observe를 다시 시작하잖아. 중복되는 부분이 맞았음
    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    // 밑에는 머야?? 솔직히 모르겠는데... if else 그런 느낌으로 많이 하던데, 정확히는 모르겠음
    return () => observer.disconnect();
    //아래 의존성 배열 솔직히 모르겠음, 여기에 담긴 요소가 바뀌면 위의 함수가 작동된다는 것은 이해하겠는데,어려움 그리고 지금 구현한 무한스크롤 기능관련 함수들 어느 부분에 useCallback을 씌우고, 뭐 어떤 컴포넌트에 React.memo를 해야할지 모르겠음
    // 밑에 요소 4가지 handleIntersect, targetRef.current, page, isLoading의 중복되는 것들을 생각해보자.
    // isLoading이 바뀌면, 무조건 targetRef.current는 바뀌어. 그러니까 둘 중 하나만 있으면 useEffect에서 의존성 배열의 역할이 뭐야? 배열 안에 있는 요소가 바뀌면 useEffect의 effect 명령형 함수 돌려줄게. 이걸로 cleanup해줄게. 이거잖아. 그러니까 isLoading바뀐다는 것은 targetRef.current도 무조건  바뀌니까 굳이 중복 호출할 필요가 없지. 그래서 뺐어.
    // handleIntersect는 intersectionObserver생성함수의 첫번째 파라미터인 콜백함수야. 이 콜백이 바뀌면, 무조건 page스테이트는 바뀌어. 왜냐면 콜백 안에 loadMore이라는 함수가 있으니까. 이것은 setpage(prev => prev+1)이니까.
  }, [handleIntersect, isLoading]);

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
              <Link target='_blank' to='https://www.wanted.co.kr/'>
                <img
                  style={{ width: '100%' }}
                  //tsx안에서 함수 돌리는거 싫어서 맨 처음에 유틸함수 만들고, return 위에 전역으로 함수 호출하고 그 값을 변수에 넣어줬는데. 그리고 그 변수를 밑에 src, alt에 사용하고, 이렇게 하면 무한스크롤할 때, 이전 위에 부분들 이미지 소스도 다 바뀌는 에러 현상 발생함
                  src={`mockAddImage${(Math.floor(index / 4) % 4) + 1}.png`}
                  alt={`광고이미지 ${(Math.floor(index / 4) % 4) + 1}`}
                />
              </Link>
            )}
          </div>
        ))}
      {isLoading ? null : <div className='target' ref={targetRef}></div>}
    </ListContainer>
  );
}
