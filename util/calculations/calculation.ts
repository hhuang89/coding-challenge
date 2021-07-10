import * as constants from "../../lib/model";

export const calculationByCategory = (data, category) => {
  return Math.trunc(
    data
      ?.filter((item) => item.account_category === category)
      .reduce((acc, cur) => {
        return acc + cur.total_value;
      }, 0)
  );
};

export const calculateGPM = (data, revenue) => {
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
export const calculateNPM = (revenue, expense) => {
  return Math.round((100 * (revenue - expense)) / revenue);
};
