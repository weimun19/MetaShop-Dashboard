import "./UserView.css";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import inventory from "../../Data/Inventory.csv";
import _ from "lodash";
import "../Cards/Cards.css";
import Card from "../Card/Card";
import { UilUsdSquare } from "@iconscout/react-unicons";
import "../MainDash/MainDash.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import "../Table/Table.css";

const UserView = () => {
  const [chartsData, setChartsData] = useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [availableProduct, setAvailableProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      var chartData = [];
      var productAvailablity = [];
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
          const stock = Object.keys(invDataByProduct).sort(function (a, b) {
            return (
              invDataByProduct[b].filter((s) => s.soldDate === "").length -
              invDataByProduct[a].filter((s) => s.soldDate === "").length
            );
          });
          const ProcessedData = [];
          stock.forEach((productID, index) => {
            ProcessedData.push({
              x: invDataByProduct[productID][0].productName,
              y: invDataByProduct[productID].filter((s) => s.soldDate === "")
                .length,
            });
            productAvailablity.push({
              Product: invDataByProduct[productID][0].productName,
              Remaining: invDataByProduct[productID].filter(
                (s) => s.soldDate === ""
              ).length,
              Sold: invDataByProduct[productID].filter((s) => s.soldDate !== "")
                .length,
            });
          });
          setAvailableProduct(productAvailablity);
          chartData.push({
            title: "Available Stock",
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
              ).toFixed(2) + "% remaining since last restocked",
            png: UilUsdSquare,
            series: [
              {
                name: "Remaining stock",
                data: ProcessedData,
              },
            ],
          });
        },
      });
      setChartsData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div className="MainDash">
      <h1>
        Stock Availability{" "}
        {new Date().toLocaleString("en-US", {
          day: "2-digit",
          month: "long",
          year: "2-digit",
        })}
      </h1>
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
            </div>
          );
        })}
      </div>
      <div className="tableContainer">
        <TableContainer
          component={Paper}
          style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
        >
          <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="left">Sold This Month</TableCell>
                <TableCell align="left">Remaining</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ color: "white" }}>
              {availableProduct
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.Product}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.Product}
                    </TableCell>
                    <TableCell align="left">{row.Sold}</TableCell>
                    <TableCell align="left">{row.Remaining}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={availableProduct.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default UserView;
