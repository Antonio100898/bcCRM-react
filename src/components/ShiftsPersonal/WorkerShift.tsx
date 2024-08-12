import { IshiftDetail } from "../../Model";
import { Stack, Typography, Box } from "@mui/material";
import DataField from "../DataField/DataField";
import { color_blue } from "../../Consts/Consts";

interface Props {
  shifts: IshiftDetail[];
  onClick: (shift: IshiftDetail) => void;
  day: number;
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

export default function WorkerShift({ shifts, onClick, day }: Props) {
  const length = shifts.length;
  const dayName = WEEK_DAY[day];

  if (length === 1) {
    return (
      <>
        {shifts.map((s) => (
          <DataField
            key={s.id}
            onClick={() => onClick(shifts[0])}
            sx={{
              backgroundColor: s.color,
            }}
          >
            <Stack direction="row">
              <Typography fontWeight={600} width="20%">
                {dayName}
              </Typography>
              <Typography
                color={s.jobTypeId === 1 ? color_blue : ""}
                width="30%"
              >
                {s.jobTypeName}
              </Typography>
              <Typography width="25%">
                {SHIFT_TYPE_NAME[s.shiftTypeId - 1]}
              </Typography>
              <Typography width="25%">
                {s.finishHour} - {s.startHour}
              </Typography>
            </Stack>
          </DataField>
        ))}
      </>
    );
  } else {
    return (
      <Stack sx={{ flexDirection: "row" }}>
        <Typography fontWeight={600} width="24.7%" pl={1}>
          {dayName}
        </Typography>
        <Stack sx={{ width: "100%", gap: 0.5 }}>
          {shifts.map((s) => (
            <DataField
              key={s.id}
              onClick={() => onClick(shifts[0])}
              sx={{
                backgroundColor: s.color,
              }}
            >
              <Stack direction="row">
                <Typography
                  color={s.jobTypeId === 1 ? color_blue : ""}
                  width="37.5%"
                >
                  {s.jobTypeName}
                </Typography>
                <Typography width="31.25%">
                  {SHIFT_TYPE_NAME[s.shiftTypeId - 1]}
                </Typography>
                <Typography width="31.25%">
                  {s.finishHour} - {s.startHour}
                </Typography>
              </Stack>
            </DataField>
          ))}
        </Stack>
      </Stack>
    );
  }
}
