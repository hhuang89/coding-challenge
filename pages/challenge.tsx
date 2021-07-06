import { useEffect, useState } from "react";
import { getData } from "../lib/services/api-services";
import { IResponse, Datum } from "../lib/model";
import * as constants from "../lib/model";

export default function codeChallenge() {
  const [data, setData] = useState<Datum[]>();

  useEffect(() => {
    getData().then((res: IResponse) => {
      setData(res.data);
    });
  }, []);

  const revenue = data
    ?.filter((item) => item.account_category === constants.REVENUE)
    .reduce((acc, cur) => {
      return acc + cur.total_value;
    }, 0);

  const expense = data
    ?.filter((item) => item.account_category === constants.EXPENSE)
    .reduce((acc, cur) => {
      return acc + cur.total_value;
    }, 0);

  const calculateGPM = () => {
    const sum = data
      ?.filter(
        (item) =>
          item.account_type === constants.SALES &&
          item.value_type === constants.DEBIT
      )
      .reduce((acc, cur) => {
        return acc + cur.total_value;
      }, 0);
      

    if (typeof revenue === "number" && typeof sum === "number") {
      return 100 * sum / revenue;
    } else {
      return -1;
    }
  };
  const GPM = calculateGPM();

  //NPM = (revenue - expense) / revenue
  const calculateNPM = () => {
    if (typeof revenue === "number" && typeof expense === "number") {
      return 100 * (revenue - expense) / revenue;
    } else {
      return -1;
    }
  };
  const NPM = calculateNPM();

  //WCR = assets / liabilities
  const assets = data
    ?.filter(
      (item) =>
        item.account_category === constants.ASSETS &&
        (item.value_type === constants.DEBIT || constants.CREDIT) &&
        (item.account_type === constants.CURRENT ||
          constants.BANK ||
          constants.RECEIVABLE)
    )
    .reduce((acc, cur) => {
      if (cur.value_type === constants.CREDIT) {
        return acc - cur.total_value;
      } else if (cur.value_type === constants.DEBIT) {
        return acc + cur.total_value;
      }
      return 0;
    }, 0);

  const liabilities = data?.filter(
    (item) =>
      item.account_category === constants.LIABILITY &&
      (item.value_type === constants.DEBIT || constants.CREDIT) && 
      (item.account_type === constants.CURRENT || constants.PAYABLE)
  )
  .reduce((acc, cur) => {
    if (cur.value_type === constants.CREDIT) {
      return acc + cur.total_value;
    } else if (cur.value_type === constants.DEBIT) {
      return acc - cur.total_value;
    }
    return 0;
  }, 0);

  const calculateWCR = () => {
    if (typeof assets === "number" && typeof liabilities === "number") {
      return (assets / liabilities) * 100;
    }
  }
  const WCR = calculateWCR();

  return (
    <>
      <div>{revenue}</div>
      <div>{expense}</div>
      <div>{GPM}</div>
      <div>{NPM}</div>
      <div>{WCR}</div>
    </>
  );
}
