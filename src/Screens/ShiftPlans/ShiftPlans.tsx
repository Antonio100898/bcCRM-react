import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { ExcelShiftPlans } from "../../components/Excel/ExcelShiftPlans";
import { useUser } from "../../Context/useUser";
import { shiftService } from "../../API/services";
import DateSelect from "../../components/DateSelect/DateSelect";
import { getWeekDate } from "../../helpers/getWeekDate";
import { CircularProgress, Typography, Box, Stack } from "@mui/material";
import { addDays } from "../../helpers/addDays";
import { ConvertedShifts, convertShifts } from "../../helpers/convertShifts";
import ShiftsOfDay from "../../components/Shifts/ShiftsOfDay";

export interface IdayO {
  date: string;
  isToday: boolean;
  dayName: string;
}

export default function ShiftPlans() {
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
      const data = await shiftService.getShiftPlansForWorker(startDate);

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
        startDate={startDate}
        finishDate={finishDate}
        handleWeekChange={handleWeekChange}
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
            <div style={{ width: "50px" }}></div>
            {["בוקר", "אמצע", "ערב", "לילה"].map((i) => (
              <Typography
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
              return <ShiftsOfDay key={key} shifts={plan} weekDay={key} />;
            })}
          </Stack>
          {/* {shiftPlans && (
            <ShiftPlansWeek
              refreshList={fetchShifts}
              shiftsList={shiftPlans}
              startOfWeek={startDate}
              title="בוקר"
              shiftTypeId={1}
            />
          )}

          {shiftPlans && (
            <ShiftPlansWeek
              refreshList={fetchShifts}
              shiftsList={shiftPlans}
              startOfWeek={startDate}
              title="צהריים"
              shiftTypeId={2}
            />
          )}

          {shiftPlans && (
            <ShiftPlansWeek
              refreshList={fetchShifts}
              shiftsList={shiftPlans}
              startOfWeek={startDate}
              title="ערב"
              shiftTypeId={3}
            />
          )}

          {shiftPlans && (
            <ShiftPlansWeek
              refreshList={fetchShifts}
              shiftsList={shiftPlans}
              startOfWeek={startDate}
              title="לילה"
              shiftTypeId={4}
            />
          )}

          {shiftPlans && (
            <ShiftPlansWeek
              refreshList={fetchShifts}
              shiftsList={shiftPlans}
              startOfWeek={startDate}
              title="בלתמ"
              shiftTypeId={5}
            />
          )} */}
        </>
      </Box>
    </div>
  );
}
