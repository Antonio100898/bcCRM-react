import { Box, Stack, Typography, IconButton } from "@mui/material";
import {
  ConvertedShiftsTypes,
  HEBREW_WEEK_DAY,
} from "../../helpers/convertShifts";
import DataField from "../DataField/DataField";

type Props = {
  weekDay: string;
  shifts: ConvertedShiftsTypes;
};

const boxContainerStyle = {
  height: "25px",
  width: "50px",
  display: "flex",
  justifyContent: "center",
};

const ShiftsOfDay = ({ shifts, weekDay }: Props) => {
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
          const shift = shifts[Number(key) as keyof ConvertedShiftsTypes][0];
          return (
            <Box sx={boxContainerStyle} key={key}>
              <img style={{ cursor: "pointer" }} src="/shiftNotSelected.svg" />
            </Box>
          );
        })}
      </Stack>
    </DataField>
  );
};

export default ShiftsOfDay;
