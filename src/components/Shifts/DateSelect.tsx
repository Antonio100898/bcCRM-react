import { Box, Typography, IconButton } from "@mui/material";
import dayjs from "dayjs";

export type Props = {
  handleWeekChange: (move: "next" | "prev") => void;
  startDate: Date;
  finishDate: Date;
};

export default function DateSelect({
  handleWeekChange,
  finishDate,
  startDate,
}: Props) {
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
        mt: 4,
      }}
    >
      <IconButton onClick={() => handleWeekChange("prev")} size="small">
        <img src="/rightArrow.svg" />
      </IconButton>
      <Box sx={{ mx: 2 }}>
        <Typography component="span">
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
      <IconButton size="small" onClick={() => handleWeekChange("next")}>
        <img src="/leftArrow.svg" />
      </IconButton>
    </Box>
  );
}
