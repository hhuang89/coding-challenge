import { useEffect, useState } from "react";
import { getData } from "../util/services/api-services";
import { IResponse, Datum } from "../lib/model";
import * as constants from "../lib/model";
import { Row, Col, Card, Typography } from "antd";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import {
  calculationByCategory,
  calculateGPM,
  calculateNPM,
  calculateAssets,
  calculateLiabilities,
  calculateWCR,
} from "../util/calculation";
import { formatter } from "../util/formatter";

export default function codeChallenge() {
  const [data, setData] = useState<Datum[]>();

  useEffect(() => {
    getData().then((res: IResponse) => {
      setData(res.data);
    });
  }, []);

  const revenue = calculationByCategory(data, constants.REVENUE);

  const expense = calculationByCategory(data, constants.EXPENSE);

  const GPM = calculateGPM(data, revenue);

  const NPM = calculateNPM(revenue, expense);

  const assets = calculateAssets(data);

  const liabilities = calculateLiabilities(data);

  const WCR = calculateWCR(assets, liabilities);

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
