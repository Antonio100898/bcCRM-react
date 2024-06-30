import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

export type Props = {
  setDate: (date: Date) => void;
};

function getLastSunday(orOtherDay: number) {
  const date = new Date();
  const today = date.getDate();
  const currentDay = date.getDay();
  const newDate = date.setDate(today - (currentDay || orOtherDay));

  return new Date(newDate);
}

function getLastSundayOption(date: Date, orOtherDay: number) {
  const today = date.getDate();
  const currentDay = date.getDay();
  if (currentDay === orOtherDay) {
    return date;
  }
  const newDate = date.setDate(today - (currentDay || orOtherDay));

  return new Date(newDate);
}

export default function DateSelect({ setDate }: Props) {
  const [startDate, setStartDate] = useState(getLastSunday(7));
  const [finishDate, setFinishDate] = useState(getLastSunday(1));

  function addDays(theDate: Date, days: number) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  const handleChange = (newValue: Dayjs | null) => {
    const d: Date = getLastSundayOption(newValue!.toDate(), 7);
    setStartDate(d);
    setDate(d);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: "row",
        px: 1,
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.13)",
        border: "0.7px solid #DCDCDC",
        borderRadius: "50px",
        width: "max-content",
        alignItems: "center",
        height: "40px",
        mx: "auto",
        mt: 4
      }}
    >
      <IconButton
        onClick={() => {
          setStartDate(addDays(startDate, -7));
          setFinishDate(addDays(finishDate, -7));
          setDate(addDays(startDate, -7));
        }}
        size="small"
      >
        <img src="/rightArrow.svg" />
      </IconButton>
      <Box sx={{ mx: 2 }}>
        <Typography component="span">
          {" "}
          {dayjs(startDate).format("DD/MM/YYYY")} -{" "}
          {dayjs(finishDate).format("DD/MM/YYYY")}
        </Typography>
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            format="DD/MM/YYYY"
            value={dayjs(startDate)}
            onChange={handleChange}
          />
        </LocalizationProvider> */}
      </Box>
      <IconButton
        size="small"
        onClick={() => {
          setStartDate(addDays(startDate, 7));
          setFinishDate(addDays(finishDate, 7));
          setDate(addDays(startDate, 7));
        }}
      >
        <img src="/leftArrow.svg" />
      </IconButton>
    </Box>
  );
}
