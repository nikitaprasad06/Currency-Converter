import { useEffect, useState, useMemo } from "react";
import {
  Grid,
  TextField,
  Button,
  Paper,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Divider,
} from "@mui/material";
import { Sparklines, SparklinesLine } from "react-sparklines";
import moment from "moment";
import { CompareArrows } from "@mui/icons-material";

import "../../App.css";

export function Converter(props) {
  const myStorage = window.localStorage;
  const { setFrom, setTo, setInput, to, from, input } = props;

  const [availableCurrrencies, setAvailableCurr] = useState([]);
  const [rate, setRate] = useState(null);
  const [toRate, setToRate] = useState(null);
  const [isOutput, showOutput] = useState(false);
  const [output, setOutput] = useState(0);
  const [currencies] = useState(["EUR", "INR", "USD", "BTC"]);
  const [historyData, setHistoryData] = useState([]);
  const [value, setValue] = useState("table");

  const fromCurrencies = useMemo(() => {
    return currencies.filter((c) => c !== to);
  }, [currencies, to]);

  const toCurrencies = useMemo(() => {
    return currencies.filter((c) => c !== from);
  }, [currencies, from]);

  const [range, setRange] = useState(7);
  const [date] = useState(moment(new Date()).toISOString());

  console.log(range);

  useEffect(() => {
    fetch(
      "https://api.nomics.com/v1/exchange-rates?key=93379e327afbef6b89a021cc4b0161ad265ccc68"
    )
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((e) => e.currency === from);
        setRate(filteredData[0].rate);
        setAvailableCurr(data);
      });
  }, [from]);

  useEffect(() => {
    if (availableCurrrencies.length) {
      getExchangeHistory();
    }
  }, [range]);

  async function getExchangeHistory() {
    const start = moment(
      new Date(new Date().setDate(new Date().getDate() - range))
    ).toISOString();
    const response = await fetch(
      `https://api.nomics.com/v1/exchange-rates/history?key=93379e327afbef6b89a021cc4b0161ad265ccc68&currency=${from}&start=${start}&end=${date}`
    );
    const data = await response.json();
    setHistoryData(data);
  }

  const convertCurrency = (e) => {
    const filteredData = availableCurrrencies.filter(
      (e) => e.currency === from
    );
    console.log(filteredData);

    const filterToData = availableCurrrencies.filter((e) => e.currency === to);
    // setToRate(filterToData[0].rate);
    const rate = filteredData[0].rate;
    console.log(input, rate);
    setOutput(Number(input) * Number(rate));
    showOutput(true);
    getExchangeHistory();
    const allEnteries = JSON.parse(localStorage.getItem("allEnteries")) || [];
    const eventDetails = {
      date: new Date(),
      key: allEnteries.length + 1,
      amount: input,
      from: from,
      to: to,
    };
    allEnteries.push(eventDetails);
    myStorage.setItem("allEnteries", JSON.stringify(allEnteries));
  };

  const switchCurrencies = (e) => {
    showOutput(false);
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSelectChange = (event, type) => {
    const { value } = event.target;
    console.log(value, type);
    if (type === "duration") {
      // console.log(value)
      setRange(value);
    } else if (type === "currencyFrom") {
      setFrom(value);
    } else if (type === "currencyTo") setTo(value);
  };

  const sortHistory = () => {
    const data = [...historyData];
    return data?.sort((a, b) => a.rate - b.rate);
  };

  const getAverageHistoryRate = () => {
    const sum = historyData?.reduce(getSum, 0);
    return sum / historyData.length;
  };

  const getSum = (total, num) => {
    return total + Number(num.rate);
  };

  const getChartData = () => {
    return historyData.map((e) => e["rate"]);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <div className="heading">
        <h1 className="headers">I want to convert</h1>
      </div>
      <div className="fields-container">
        <TextField
          id="amount-textField"
          label="Amount"
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            showOutput(false);
          }}
        />

        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
          <InputLabel>From</InputLabel>
          <Select
            defaultValue={from}
            value={from}
            onChange={(e) => {
              handleSelectChange(e, "currencyFrom");
              showOutput(false);
            }}
            label="From"
          >
            {fromCurrencies.map((c) => (
              <MenuItem value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <div class="icon-container">
          <CompareArrows
            className="compareIcon"
            onClick={(e) => switchCurrencies(e)}
          />
        </div>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
          <InputLabel>To</InputLabel>
          <Select
            defaultValue={to}
            value={to}
            onChange={(e) => {
              handleSelectChange(e, "currencyTo");
              showOutput(false);
            }}
            label="To"
          >
            {toCurrencies.map((c) => (
              <MenuItem value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          size="small"
          onClick={(e) => convertCurrency(e)}
        >
          Convert
        </Button>
      </div>
      {isOutput ? (
        <Grid xs={12}>
          <Grid item xs={12} className="output-container">
            <h1 className="output-lables">
              {input + " " + from + " = "}
              <span className="to-label">{output.toFixed(2) + " " + to}</span>
            </h1>
            <div className="rate-label">
              1 {from} = {rate} {to}
            </div>
            <div className="rate-label">
              1 {to} = {toRate} {from}
            </div>
          </Grid>
          <Divider />

          <Grid item xs={12}>
            <h2 className="sub-header">Exchange History</h2>
            <Grid container justifyContent={`space-between`} spacing={2}>
              <Grid item xs={4}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                  <InputLabel id="duration-container">Duration</InputLabel>
                  <Select
                    labelId="duration-container"
                    id="duration"
                    defaultValue={7}
                    onChange={(e) => handleSelectChange(e, "duration")}
                    label="Duration"
                  >
                    <MenuItem value={7}>7 days</MenuItem>
                    <MenuItem value={14}>14 days</MenuItem>
                    <MenuItem value={30}>30 days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8} className="radio-container">
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="conversion-data-view-radio-group"
                    name="chart-type"
                    value={value}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="table"
                      control={<Radio size="small" />}
                      label="Table"
                    />
                    <FormControlLabel
                      value="chart"
                      control={<Radio size="small" />}
                      label="Chart"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          {value === "table" ? (
            <Grid
              container
              justifyContent={`space-between`}
              spacing={2}
              className="exchange-rate-container"
            >
              <Grid item xs={6}>
                <TableContainer component={Paper}>
                  <Table aria-label="Exchange Rate table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Exchange Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyData.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            {moment(row.timestamp).format("DD/MM/yyyy")}
                          </TableCell>
                          <TableCell>{row.rate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={6}>
                <TableContainer component={Paper}>
                  <Table aria-label="Statistics table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Statistics</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Lowest</TableCell>
                        <TableCell>{sortHistory()[0]?.rate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Highest</TableCell>
                        <TableCell>
                          {sortHistory()[historyData.length - 1]?.rate}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average</TableCell>
                        <TableCell>{getAverageHistoryRate()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12} className="chart-container">
              <Sparklines data={getChartData()}>
                <SparklinesLine color="#009688" />
              </Sparklines>
            </Grid>
          )}
        </Grid>
      ) : null}
    </>
  );
}
