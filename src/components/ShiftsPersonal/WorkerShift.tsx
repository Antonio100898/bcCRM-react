import { IshiftDetail } from "../../Model";
import { Stack, Typography } from "@mui/material";
import DataField from "../DataField/DataField";
import { color_blue } from "../../Consts/Consts";

interface Iprop {
  shift: IshiftDetail;
  onClick?: () => void;
}

enum SHIFT_TYPE_NAME {
  "בוקר",
  "אמצע",
  "ערב",
  "לילה",
}

enum WEEK_DAY {
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת",
}

export default function WorkerShift({ shift, onClick }: Iprop) {
  const {
    startHour,
    finishHour,
    shiftTypeId,
    jobTypeName,
    startDateEN,
    jobTypeId,
  } = shift;
  const day = new Date(startDateEN).getDay();

  return (
    <DataField
      onClick={onClick}
      sx={{
        backgroundColor:
          day === 5 || day === 6 ? "secondary.light" : "grey.400",
      }}
    >
      <Stack direction="row">
        <Typography fontWeight={600} width="20%">
          {WEEK_DAY[day]}
        </Typography>
        <Typography color={jobTypeId === 1 ? color_blue : ""} width="30%">
          {jobTypeName}
        </Typography>
        <Typography width="25%">{SHIFT_TYPE_NAME[shiftTypeId]}</Typography>
        <Typography width="25%">
          {finishHour} - {startHour}
        </Typography>
      </Stack>
    </DataField>
  );
}
