export const makeCreatedData = (isoDateString: string) => {
  const isoDate = new Date(isoDateString);
  const year = isoDate.getFullYear();
  const month = isoDate.getMonth() + 1;
  const day = isoDate.getDate();

  const formattedDate = `${year}년 ${month}월 ${day}일`;

  return formattedDate;
};
