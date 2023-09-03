import { useCallback, useEffect, useRef } from 'react';

type Props = {
  refetch: () => void;
  isLoading: boolean;
};

const useIntersectionObserver = ({ refetch, isLoading }: Props) => {
  //null초기값으로 넣지 않으면 undefined로 잡힘. 그래서 실제 div에 ref로 넣었을 때 에러를 뱉음.
  //undefined는 ref에 들어갈 수 없다고
  const targetRef = useRef<HTMLDivElement | null>(null);

  console.log(targetRef);
  console.log('s')

  const intersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entries[0].isIntersecting && !isLoading) {
        observer.unobserve(entries[0].target);
        console.log('관찰 종료');
        refetch();
        // observer.observe(entries[0].target);
      }
    },
    [isLoading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(intersectionCallback, {
      threshold: 0.9,
    });

    console.log('관찰 다시 시작');
    targetRef.current && observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [intersectionCallback]);
  return targetRef;
};

export default useIntersectionObserver;
