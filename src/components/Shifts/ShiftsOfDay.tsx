import { Box, Stack, Typography } from "@mui/material";
import {
  ConvertedShiftsTypes,
  HEBREW_WEEK_DAY,
} from "../../helpers/convertShifts";
import DataField from "../DataField/DataField";
import { IDays, IShiftPlan } from "../../Model";
import { getShiftStartDate } from "../../helpers/getShiftStartDate";

type Props = {
  weekDay: keyof IDays;
  shifts: ConvertedShiftsTypes;
  onClick: (shiftTypeId: number, day: keyof IDays) => void;
  selectedShiftPlans: IShiftPlan[];
  startDate: Date;
  onRemarkClick: (day: number) => void;
};

const boxContainerStyle = {
  height: "25px",
  width: "50px",
  display: "flex",
  justifyContent: "center",
  cursor: "pointer",
};

const ShiftsOfDay = ({
  shifts,
  weekDay,
  onClick,
  selectedShiftPlans,
  startDate,
  onRemarkClick,
}: Props) => {
  let day = 0;
  switch (weekDay) {
    case "monday":
      day = 1;
      break;
    case "tuesday":
      day = 2;
      break;
    case "wendsday":
      day = 3;
      break;
    case "thursday":
      day = 4;
      break;
    case "friday":
      day = 5;
      break;
    case "saturday":
      day = 6;
      break;
    default:
      day = 0;
  }

  const isDaySelected = selectedShiftPlans.find(
    (s) => new Date(Number(s.startDate)).getDay() === day
  );

  return (
    <DataField>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={boxContainerStyle} fontWeight="bold">
          {
            //@ts-ignore
            HEBREW_WEEK_DAY[weekDay]
          }
        </Typography>
        <Box
          sx={{
            ...boxContainerStyle,
            visibility: isDaySelected ? "" : "hidden",
          }}
          onClick={() => onRemarkClick(day)}
        >
          <img src="/comment.svg" />
        </Box>
        {Object.keys(shifts).map((key) => {
          const shiftTypeId = Number(key) as keyof ConvertedShiftsTypes;

          const selected = selectedShiftPlans.find(
            (s) =>
              s.startDate === getShiftStartDate(startDate, shiftTypeId, weekDay)
          );
          return (
            <Box
              onClick={() => onClick(shiftTypeId, weekDay)}
              sx={boxContainerStyle}
              key={key}
            >
              <img
                style={{ cursor: "pointer" }}
                src={`/shift${selected ? "" : "Not"}Selected.svg`}
              />
            </Box>
          );
        })}
      </Stack>
    </DataField>
  );
};

export default ShiftsOfDay;
