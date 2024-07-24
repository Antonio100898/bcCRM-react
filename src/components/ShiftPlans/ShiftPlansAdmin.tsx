import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { ExcelShiftPlans } from "../Excel/ExcelShiftPlans";
import { useUser } from "../../Context/useUser";
import { shiftService } from "../../API/services";
import DateSelect from "../DateSelect/DateSelect";
import { getWeekDate } from "../../helpers/getWeekDate";
import { CircularProgress, Typography, Box, Stack } from "@mui/material";
import { addDays } from "../../helpers/addDays";
import { ConvertedShifts, convertShifts } from "../../helpers/convertShifts";
import dayjs from "dayjs";
import ShiftPlansOfTheDay from "./ShiftPlansOfTheDay";
import { IDays } from "../../Model";

export default function ShiftPlansAdmin() {
  const { enqueueSnackbar } = useSnackbar();
  const { updateShowLoader } = useUser();
  const [shiftPlans, setShiftPlans] = useState<ConvertedShifts>();
  const [startDate, setStartDate] = useState(getWeekDate("start"));
  const [finishDate, setFinishDate] = useState(getWeekDate("finish"));

  const handleWeekChange = (move: "next" | "prev") => {
    if (move === "next") {
      setStartDate(addDays(startDate, 7));
      setFinishDate(addDays(finishDate, 7));
    } else {
      setStartDate(addDays(startDate, -7));
      setFinishDate(addDays(finishDate, -7));
    }
  };

  const fetchShifts = async () => {
    updateShowLoader(true);
    try {
      const data = await shiftService.getShiftPlans(startDate);

      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
        updateShowLoader(false);
        return;
      }

      setShiftPlans(convertShifts(data.d.shiftDetails));
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
    }

    updateShowLoader(false);
  };

  useEffect(() => {
    fetchShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  //@ts-ignore
  const exportFile = async () => {
    try {
      const data = await shiftService.getShiftPlansWeekReport(
        startDate.toDateString()
      );
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
          variant: "error",
        });
        return null;
      }

      return ExcelShiftPlans.exportWeekFile(data.d.shiftPlanReport);
    } catch (error) {
      console.error(error);
    }
  };

  if (!shiftPlans) return <CircularProgress />;

  return (
    <div>
      <Typography px={2} variant="subtitle1">
        זמינות
      </Typography>
      <DateSelect
        onNext={() => handleWeekChange("next")}
        onPrev={() => handleWeekChange("prev")}
        displayValue={`${dayjs(startDate).format("DD/MM/YYYY")} -
          ${dayjs(finishDate).format("DD/MM/YYYY")}`}
      />
      <Box sx={{ px: 2 }}>
        <>
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 3,
              mb: 1.5,
              px: 1,
            }}
          >
            <div style={{ width: "50px" }}></div>
            {["בוקר", "אמצע", "ערב", "לילה"].map((i) => (
              <Typography
                key={i}
                fontWeight="bold"
                fontSize={14}
                sx={{
                  width: "50px",
                  textAlign: "center",
                }}
              >
                {i}
              </Typography>
            ))}
          </Stack>

          <Stack gap={4}>
            {Object.keys(shiftPlans).map((key) => {
              const plan = shiftPlans[key as keyof ConvertedShifts];
              return (
                <ShiftPlansOfTheDay
                  key={key}
                  shifts={plan}
                  weekDay={key as keyof IDays}
                />
              );
            })}
          </Stack>
        </>
      </Box>
    </div>
  );
}
