import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import inventory from "../../Data/Inventory.csv";
import _ from "lodash";
import "./Cards.css";
import Card from "../Card/Card";
import engagement from "../../Data/engagement.csv";
import { UilUsdSquare, UilEye } from "@iconscout/react-unicons";
import TopRankingCard from "../TopRankingCard/TopRankingCard";

const Cards = () => {
  const [chartsData, setChartsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      var chartData = [];
      var response = await fetch(inventory); // Assuming the CSV file is in the public folder
      var reader = response.body.getReader();
      var result = await reader.read();
      var decoder = new TextDecoder("utf-8");
      var csv = decoder.decode(result.value);
      var { invData } = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (result) {
          const invDataByProduct = _.groupBy(result.data, "productID");
          const lowStock = Object.keys(invDataByProduct).sort(function (a, b) {
            return (
              invDataByProduct[b].filter((s) => s.soldDate === "").length -
              invDataByProduct[a].filter((s) => s.soldDate === "").length
            );
          });
          const ProcessedData = [];
          const RankingData = [];
          lowStock.forEach((productID, index) => {
            ProcessedData.push({
              x: invDataByProduct[productID][0].productName,
              y: invDataByProduct[productID].filter((s) => s.soldDate === "")
                .length,
            });
          });
          for (var i = 1; i <= lowStock.length; i++) {
            var productID = lowStock[lowStock.length - i];
            RankingData.push({
              item: invDataByProduct[productID][0].productName,
              ranking: i,
              description: invDataByProduct[productID].length + " remained",
            });
          }
          chartData.push({
            title: "Inventory Overview",
            xtitle: "Product",
            ytitle: "Remaining stock",
            color: {
              backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
              boxShadow: "0px 10px 20px 0px #e0c6f5",
            },
            barValue: (
              (result.data.filter((d) => d.soldDate === "").length /
                result.data.length) *
              100
            ).toFixed(2),
            value:
              (
                (result.data.filter((d) => d.soldDate === "").length /
                  result.data.length) *
                100
              ).toFixed(2) + "%",
            png: UilUsdSquare,
            series: [
              {
                name: "Remaining stock",
                data: ProcessedData,
              },
            ],
            ranking: RankingData,
            rankTitle: "Lowest Stock Products",
          });

          const topSelling = Object.keys(invDataByProduct).sort(function (
            a,
            b
          ) {
            return (
              invDataByProduct[b].filter((s) => s.soldDate !== "").length -
              invDataByProduct[a].filter((s) => s.soldDate !== "").length
            );
          });
          const processedTopSelling = [];
          const sellRanking = [];
          topSelling.forEach((productID, index) => {
            processedTopSelling.push({
              x: invDataByProduct[productID][0].productName,
              y: invDataByProduct[productID].filter((s) => s.soldDate === "")
                .length,
            });
          });
          for (var i = 1; i <= topSelling.length; i++) {
            var productID = topSelling[topSelling.length - i];
            sellRanking.push({
              item: invDataByProduct[productID][0].productName,
              ranking: i,
              description: invDataByProduct[productID].length + " sold",
            });
          }
          chartData.push({
            title: "Hot Selling",
            xtitle: "Product",
            ytitle: "Sales",
            color: {
              backGround:
                "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
              boxShadow: "0px 10px 20px 0px #F9D59B",
            },
            barValue: (
              (result.data.filter((d) => d.soldDate !== "").length /
                result.data.length) *
              100
            ).toFixed(2),
            value:
              (
                (result.data.filter((d) => d.soldDate !== "").length /
                  result.data.length) *
                100
              ).toFixed(2) + "%",
            png: UilUsdSquare,
            series: [
              {
                name: "Sales",
                data: ProcessedData,
              },
            ],
            ranking: sellRanking,
            rankTitle: "Top 3 Hot Selling",
          });
        },
      });

      response = await fetch(engagement); // Assuming the CSV file is in the public folder
      reader = response.body.getReader();
      result = await reader.read();
      decoder = new TextDecoder("utf-8");
      csv = decoder.decode(result.value);
      const { enData } = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (result) {
          const engagementByProduct = _.groupBy(result.data, "productID");
          const productID = Object.keys(engagementByProduct).sort(function (
            a,
            b
          ) {
            return (
              engagementByProduct[b].length - engagementByProduct[a].length
            );
          });
          const ProcessedData = [];
          productID.forEach((pid) => {
            ProcessedData.push({
              x: engagementByProduct[pid][0].productName,
              y: engagementByProduct[pid].length,
            });
          });
          const RankingData = [];
          productID.forEach((pid, index) => {
            RankingData.push({
              item: engagementByProduct[pid][0].productName,
              ranking: index + 1,
              description: engagementByProduct[pid].length + " views",
            });
          });
          chartData.push({
            title: "Product Engagement Overview",
            xtitle: "Product",
            ytitle: "Views",
            color: {
              backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
              boxShadow: "0px 10px 20px 0px #FDC0C7",
            },
            barValue: 0,
            value: result.data.length + " views",
            png: UilEye,
            series: [
              {
                name: "View count",
                data: ProcessedData,
              },
            ],
            ranking: RankingData,
            rankTitle: "Top 3 Viewed Products",
          });
        },
      }); // Parse the CSV data
      setChartsData(chartData);
    };

    fetchData();
  }, []);
  return (
    <div className="Cards">
      {chartsData.map((card, id) => {
        return (
          <div className="parentContainer" key={id}>
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
              series={card.series}
              xtitle={card.xtitle}
              ytitle={card.ytitle}
            />
            <TopRankingCard title={card.rankTitle} data={card.ranking} />
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
