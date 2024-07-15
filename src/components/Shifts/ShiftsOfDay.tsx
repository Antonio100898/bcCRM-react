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
};

const boxContainerStyle = {
  height: "25px",
  width: "50px",
  display: "flex",
  justifyContent: "center",
};

const ShiftsOfDay = ({
  shifts,
  weekDay,
  onClick,
  selectedShiftPlans,
  startDate,
}: Props) => {
  return (
    <DataField>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={boxContainerStyle} fontWeight="bold">
          {
            //@ts-ignore
            HEBREW_WEEK_DAY[weekDay]
          }
        </Typography>

        <Box sx={boxContainerStyle}>
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
