import { useState } from "react";
import {
  Grid,
  Tab,
  Tabs,
  Typography
} from "@mui/material";

import { ConversionHistory } from "./Components/ConversionHistory";
import { Converter } from "./Components/Converter";
import "./App.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
}

function App() {
  const [input, setInput] = useState(0);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [value, setValue] = useState(0);


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item xs={12} justifyContent={"center"}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Navigation Tabs"
          centered
        >
          <Tab className="tabs" label="CURRENCY CONVERTER" {...a11yProps(0)} />
          <Tab
            className="tabs"
            label="VIEW CONVERSION HISTORY"
            {...a11yProps(1)}
          />
        </Tabs>
      </Grid>
      <Grid item xs={8} className="main">
        <TabPanel value={value} index={0}>
          <Converter
            setFrom={setFrom}
            setTo={setTo}
            setInput={setInput}
            setValue={setValue}
            from={from}
            to={to}
            input={input}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ConversionHistory
            setFrom={setFrom}
            setTo={setTo}
            setInput={setInput}
            setValue={setValue}
          />
        </TabPanel>
      </Grid>
    </Grid>
  );
}

export default App;
