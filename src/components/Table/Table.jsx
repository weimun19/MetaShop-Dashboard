import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import "./Table.css";
import Papa from "papaparse";
import inventory from "../../Data/Inventory.csv";


export default function BasicTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [soldItem, setSoldItem] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      var soldItems = [];
      var response = await fetch(inventory); // Assuming the CSV file is in the public folder
      var reader = response.body.getReader();
      var result = await reader.read();
      var decoder = new TextDecoder("utf-8");
      var csv = decoder.decode(result.value);
      var { invData } = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (result) {
          soldItems = result.data
            .filter((d) => d.soldDate !== "")
            .sort((a, b) => {
              return (
                Number(new Date(b.soldDate)) - Number(new Date(a.soldDate))
              );
            });
        },
      });
      setSoldItem(soldItems);
    };
    fetchData();
  }, []);
  return (
    <div className="Table">
      <h3>Recent Orders</h3>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="left">Tracking ID</TableCell>
              <TableCell align="left">Sold Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {soldItem
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.rfidToken}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.productName}
                  </TableCell>
                  <TableCell align="left">{row.rfidToken}</TableCell>
                  <TableCell align="left">{row.soldDate}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={soldItem.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
