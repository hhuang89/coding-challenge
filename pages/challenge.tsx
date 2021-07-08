import { useEffect, useState } from "react";
import { getData } from "../lib/services/api-services";
import { IResponse, Datum } from "../lib/model";
import * as constants from "../lib/model";
import { Row, Col, Card, Typography } from "antd";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

export default function codeChallenge() {
  const [data, setData] = useState<Datum[]>();

  useEffect(() => {
    getData().then((res: IResponse) => {
      setData(res.data);
    });
  }, []);

  const revenue = Math.trunc(
    data
      ?.filter((item) => item.account_category === constants.REVENUE)
      .reduce((acc, cur) => {
        return acc + cur.total_value;
      }, 0)
  );

  const expense = Math.trunc(
    data
      ?.filter((item) => item.account_category === constants.EXPENSE)
      .reduce((acc, cur) => {
        return acc + cur.total_value;
      }, 0)
  );

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

    return (100 * sum) / revenue;
  };
  const GPM = Math.round(calculateGPM());

  //NPM = (revenue - expense) / revenue
  const calculateNPM = () => {
    return (100 * (revenue - expense)) / revenue;
  };
  const NPM = Math.round(calculateNPM());

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

  const liabilities = data
    ?.filter(
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

  const calculateWCR = (): number => {
    return (assets / liabilities) * 100;
  };
  const WCR = Math.round(calculateWCR());

  const formatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
  });

  const contentList = [
    { label: "revenue", values: formatter.format(revenue) },
    { label: "expense", values: formatter.format(expense) },
  ];

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Percentage",
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointPadding: 0.4,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y}%",
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}%</b> <br/>',
    },

    series: [
      {
        name: "percentage",
        colorByPoint: true,
        data: [
          {
            name: "Gross Profit Margin",
            y: GPM,
          },
          {
            name: "Net Profit Margin",
            y: NPM,
          },
          {
            name: "Working Capital Ratio",
            y: WCR,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Row justify="center">
        <Typography.Title>Code-Challenge</Typography.Title>
      </Row>
      <Row align="middle">
        <Col span={12} offset={6}>
          <Col span={12} offset={6}>
            <Card style={{ width: 300 }}>
              {contentList.map((item) => (
                <Col span={24} key={item.label}>
                  <b
                    style={{
                      marginRight: 16,
                      minWidth: 150,
                      display: "inline-block",
                    }}
                  >
                    {item.label}:
                  </b>
                  <span>{item.values}</span>
                </Col>
              ))}
            </Card>
          </Col>

          <br />
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Col>
      </Row>
    </>
  );
}
