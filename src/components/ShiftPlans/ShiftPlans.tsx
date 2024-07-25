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
import ShiftsOfDay from "../Shifts/ShiftsOfDay";
import dayjs from "dayjs";
import { IDays, IShiftPlan } from "../../Model";
import { getShiftStartDate } from "../../helpers/getShiftStartDate";

export interface IdayO {
  date: string;
  isToday: boolean;
  dayName: string;
}

const defaultShiftPlan: IShiftPlan = {
  id: 0,
  cancel: false,
  remark: "",
  shiftTypeId: 0,
  workerId: 0,
  startDate: "",
  startDateEN: "",
};

export default function ShiftPlans() {
  const { enqueueSnackbar } = useSnackbar();
  const { updateShowLoader } = useUser();
  const [shiftPlans, setShiftPlans] = useState<ConvertedShifts>();
  const [startDate, setStartDate] = useState(getWeekDate("start"));
  const [finishDate, setFinishDate] = useState(getWeekDate("finish"));
  const [selectedShiftPlans, setSelectedShiftPlans] = useState<IShiftPlan[]>(
    []
  );

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
    setSelectedShiftPlans([]);
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

  const handleShiftPlanChange = (shiftTypeId: number, day: keyof IDays) => {
    const shiftStartTime = getShiftStartDate(startDate, shiftTypeId, day);
    if (selectedShiftPlans?.length === 0) {
      setSelectedShiftPlans([
        {
          ...defaultShiftPlan,
          startDate: shiftStartTime,
        },
      ]);
      return;
    }

    setSelectedShiftPlans((prev) =>
      prev?.find((plan) => plan.startDate === shiftStartTime)
        ? prev.filter((plan) => plan.startDate !== shiftStartTime)
        : [
            ...prev!,
            {
              ...defaultShiftPlan,
              startDate: shiftStartTime,
            },
          ]
    );
  };
  //@ts-ignore
  const onSave = async () => {
    if (selectedShiftPlans.length === 0) {
      enqueueSnackbar({
        message: "לא בחרת שום משמרת",
        variant: "error",
      });
      return;
    }
    try {
      const data = await shiftService.updateShiftPlan(selectedShiftPlans);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל. ${data?.d.msg}`,
          variant: "error",
        });
        return;
      }
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: `נכשל. ${error.message}`,
          variant: "error",
        });
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
                <ShiftsOfDay
                  selectedShiftPlans={selectedShiftPlans}
                  startDate={startDate}
                  onClick={handleShiftPlanChange}
                  key={key}
                  shifts={plan}
                  weekDay={key as keyof IDays}
                />
              );
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
