import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { IshiftDetail } from "../../Model";
import DateSelect from "../../components/DateSelect/DateSelect";
import WorkerShift from "../../components/ShiftsPersonal/WorkerShift";
import { useUser } from "../../Context/useUser";
import { shiftService } from "../../API/services";
import { getWeekDate } from "../../helpers/getWeekDate";
import { addDays } from "../../helpers/addDays";
import dayjs from "dayjs";
import { Box, Typography, Stack } from "@mui/material";
import InstallationShiftDetailsDialog from "../../Dialogs/ShiftDialogs/InstallationShiftDetailsDialog";

export default function ShiftsPersonal() {
  const { enqueueSnackbar } = useSnackbar();
  const { updateShowLoader } = useUser();
  const [shifts, setShfits] = useState<IshiftDetail[]>([]);
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
  const [currentShift, setCurrentShift] = useState<IshiftDetail | null>(null);
  const [openShiftDetails, setOpenShiftDetails] = useState(false);

  const fetchShifts = async () => {
    updateShowLoader(true);
    try {
      const data = await shiftService.getShiftsForWorker(startDate);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
        updateShowLoader(false);
        return;
      }
      setShfits(data.d.workerShifts);
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
    }
    updateShowLoader(false);
  };

  const handleShiftClick = (shift: IshiftDetail) => {
    if (shift.jobTypeId === 1) {
      setCurrentShift(shift);
      setOpenShiftDetails(true);
    }
  };

  useEffect(() => {
    fetchShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="subtitle1">המשמרות שלי</Typography>
      <DateSelect
        onPrev={() => handleWeekChange("prev")}
        onNext={() => handleWeekChange("next")}
        displayValue={`${dayjs(startDate).format("DD/MM/YYYY")} -
          ${dayjs(finishDate).format("DD/MM/YYYY")}`}
      />
      <Stack style={{ marginTop: 24, gap: 8 }}>
        {shifts &&
          shifts
            .sort(
              (a, b) =>
                new Date(a.startDateEN).getTime() -
                new Date(b.startDateEN).getTime()
            )
            .map((shift: IshiftDetail) => (
              <WorkerShift
                key={shift.id}
                shift={shift}
                onClick={() => handleShiftClick(shift)}
              />
            ))}
      </Stack>
      {currentShift && currentShift.jobTypeId === 1 && (
        <InstallationShiftDetailsDialog
          isAdmin={false}
          open={openShiftDetails}
          adress={currentShift.address}
          customer={currentShift.contactName}
          remark={currentShift.remark}
          onClose={() => setOpenShiftDetails(false)}
          phone={currentShift.phone}
          placeName={currentShift.placeName}
          wifi="wifi"
        />
      )}
    </Box>
  );
}
