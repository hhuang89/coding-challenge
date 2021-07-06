import { useEffect, useState } from "react";
import { getData } from "../lib/services/api-services";
import { IResponse, Datum } from "../lib/model";
import { REVENUE, EXPENSE, SALES, DEBIT } from "../lib/model";

export default function codeChallenge() {
  const [data, setData] = useState<Datum[]>();

  useEffect(() => {
    getData().then((res: IResponse) => {
      setData(res.data);
    });
  }, []);

  const revenue: number | undefined = data
    ?.filter((item) => item.account_category === REVENUE)
    .reduce((acc, cur) => {
      return acc + cur.total_value;
    }, 0);
  const expense = data
    ?.filter((item) => item.account_category === EXPENSE)
    .reduce((acc, cur) => {
      return acc + cur.total_value;
    }, 0);
  const gpm = data
    ?.filter((item) => item.account_type === SALES && item.value_type === DEBIT)
    .reduce((acc, cur) => {
      return acc + cur.total_value;
    }, 0);

  return (
    <>
      <div>{revenue}</div>
      <div>{expense}</div>
      <div>{}</div>
    </>
  );
}
