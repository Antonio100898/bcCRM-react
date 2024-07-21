import { Box, Stack, Typography } from "@mui/material";
import {
  ConvertedShiftsTypes,
  HEBREW_WEEK_DAY,
} from "../../helpers/convertShifts";
import DataField from "../DataField/DataField";
import { IDays } from "../../Model";

type Props = {
  weekDay: keyof IDays;
  shifts: ConvertedShiftsTypes;
};

const boxContainerStyle = {
  height: "25px",
  width: "50px",
  display: "flex",
  justifyContent: "center",
};

const ShiftPlansOfTheDay = ({ shifts, weekDay }: Props) => {
  return (
    <DataField>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={boxContainerStyle} fontWeight="bold">
          {
            //@ts-ignore
            HEBREW_WEEK_DAY[weekDay]
          }
        </Typography>
        {Object.keys(shifts).map((key) => (
          <Typography
            fontWeight={700}
            color="secondary.main"
            sx={{
              width: "50px",
              textAlign: "center",
            }}
          >
            {shifts[Number(key) as keyof ConvertedShiftsTypes].length}
          </Typography>
        ))}
      </Stack>
    </DataField>
  );
};

export default ShiftPlansOfTheDay;
