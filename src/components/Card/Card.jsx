import React, { useState } from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

// parent Card

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <AnimateSharedLayout>
      {expanded ? (
        <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
    </AnimateSharedLayout>
  );
};

// Compact Card
function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
      onClick={setExpanded}
    >
      <div className="radialBar">
        {param.barValue !== 0 && (
          <CircularProgressbar
            value={param.barValue}
            text={`${param.barValue}%`}
          />
        )}
        <span>{param.title}</span>
      </div>
      <div className="detail">
        <Png />
        <span>{param.value}</span>
        <span>Current month</span>
      </div>
    </motion.div>
  );
}

// Expanded Card
function ExpandedCard({ param, setExpanded }) {
  const data = {
    options: {
      chart: {
        type: "bar",
        toolbar: {
          export: {
            csv: {
              filename: `${param.title}`,
            },
            svg: {
              filename: `${param.title}`,
            },
            png: {
              filename: `${param.title}`,
            },
          },
        },
      },
      fill: {
        colors: ["#000000"],
        type: "solid",
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#FFF"],
        },
      },
      grid: {
        show: true,
      },
      xaxis: {
        showAlways: true,
        type: "category",
        seriesName: `${param.xtitle}`,
      },
      yaxis: {
        showAlways: true,
        type: "numeric",
        seriesName: `${param.ytitle}`,
      },
    },
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
    >
      <div
        className="cardHeader"
        style={{ display: "flex", flexDirection: "row", width: "80%" }}
      >
        <span style={{ width: "100%" }}>{param.title}</span>
        <div
          style={{
            alignSelf: "flex-end",
            cursor: "pointer",
            color: "white",
            float: "right",
          }}
        >
          <UilTimes onClick={setExpanded} />
        </div>
      </div>
      <div className="chartContainer">
        <Chart options={data.options} series={param.series} type="bar" />
      </div>
      <span>Current month</span>
    </motion.div>
  );
}

export default Card;
