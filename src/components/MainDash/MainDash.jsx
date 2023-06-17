import React from "react";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import "./MainDash.css";
const MainDash = () => {
  return (
    <div className="MainDash">
      <h1>
        Dashboard{" "}
        {new Date().toLocaleString("en-US", { month: "long", year: "2-digit" })}
      </h1>
      <Cards />
      <Table />
    </div>
  );
};

export default MainDash;
