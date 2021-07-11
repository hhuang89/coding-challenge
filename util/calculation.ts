import * as constants from "../lib/model";
import { Datum } from "../lib/model";

export const calculationByCategory = (data: Datum[], category: string): number => {
  return Math.trunc(
    data
      ?.filter((item) => item.account_category === category)
      .reduce((acc, cur) => {
        return acc + cur.total_value;
      }, 0)
  );
};

export const calculateGPM = (data: Datum[], revenue: number): number => {
  const sum = data
    ?.filter(
      (item) =>
        item.account_type === constants.SALES &&
        item.value_type === constants.DEBIT
    )
    .reduce((acc, cur) => {
      return acc + cur.total_value;
    }, 0);

  return Math.round((100 * sum) / revenue);
};

//NPM = (revenue - expense) / revenue
export const calculateNPM = (revenue: number, expense: number): number => {
  return Math.round((100 * (revenue - expense)) / revenue);
};

export const calculateAssets = (data: Datum[]): number =>
  data
    ?.filter(
      (item) =>
        item.account_category === constants.ASSETS &&
        [constants.DEBIT, constants.CREDIT].includes(item.value_type) &&
        [constants.CURRENT, constants.BANK, constants.RECEIVABLE].includes(
          item.account_type
        )
    )
    .reduce((acc, cur) => {
      if (cur.value_type === constants.CREDIT) {
        acc = acc - cur.total_value;
      } else if (cur.value_type === constants.DEBIT) {
        acc = acc + cur.total_value;
      }
      return acc;
    }, 0);

export const calculateLiabilities = (data: Datum[]): number =>
  data
    ?.filter(
      (item) =>
        item.account_category === constants.LIABILITY &&
        [constants.DEBIT, constants.CREDIT].includes(item.value_type) &&
        [constants.CURRENT, constants.PAYABLE].includes(item.account_type)
    )
    .reduce((acc, cur) => {
      if (cur.value_type === constants.CREDIT) {
        acc = acc + cur.total_value;
      } else if (cur.value_type === constants.DEBIT) {
        acc = acc - cur.total_value;
      }
      return acc;
    }, 0);

//WCR = assets / liabilities
export const calculateWCR = (assets: number, liabilities: number): number => {
  return Math.round((assets / liabilities) * 100);
};
