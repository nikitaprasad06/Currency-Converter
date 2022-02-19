import { useState } from "react";
import {
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Card,
  CardContent,
} from "@mui/material";
import moment from "moment";
import {
  RemoveRedEye,
  DeleteForever,
} from "@mui/icons-material";
import "../../App.css";

export function ConversionHistory(props) {
  const myStorage = window.localStorage;
  const { setFrom, setTo, setValue, setInput  } = props
  const [historyData, setHistory] = useState(
    JSON.parse(myStorage.getItem("allEnteries")) || []
  );

  const handleView = (event, row) => {
    setInput(row.amount);
    setTo(row.to);
    setFrom(row.from);
    setValue(0);

    console.log(row);
  };

  const handleDelete = (row, index) => {
    const allEnteries = JSON.parse(localStorage.getItem("allEnteries"));
    console.log(allEnteries);
    allEnteries.splice(index, 1);
    myStorage.setItem("allEnteries", JSON.stringify(allEnteries));
    setHistory(JSON.parse(localStorage.getItem("allEnteries")));
  };

  return (
    <>
      <div className="heading">
        <h1 className="headers">Conversion History</h1>
      </div>
      <Card sx={{ minWidth: "70%" }}>
        <CardContent>
          <Grid item xs={12}>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Actions</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {JSON.parse(localStorage.getItem("allEnteries")).map(
                    (row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          {moment(row.date).format("DD/MM/yyyy @ hh:mm")}
                        </TableCell>
                        <TableCell>{`Converted an amount of ${row.amount} from ${row.from} to ${row.to}`}</TableCell>
                        <TableCell>
                          <div
                            className="action-container"
                            onClick={(e) => handleView(e, row, index)}
                          >
                            <RemoveRedEye sx={{ fontSize: 16 }} />
                            <span className="action-label">View</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="delete-container"
                            onClick={() => handleDelete(row, index)}
                          >
                            <DeleteForever sx={{ fontSize: 16 }} />
                            <span className="action-label">
                              Delete from history
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
