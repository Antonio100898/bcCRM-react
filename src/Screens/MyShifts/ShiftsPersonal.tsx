import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { IshiftDetail } from "../../Model";
import DateSelect from "../../components/Shifts/DateSelect";
import WorkerShift from "../../components/ShiftsPersonal/WorkerShift";
import { useUser } from "../../Context/useUser";
import { shiftService } from "../../API/services";

function getLastSunday(orOtherDay: number) {
  const date = new Date();
  const today = date.getDate();
  const currentDay = date.getDay();
  const newDate = date.setDate(today - (currentDay || orOtherDay));

  return new Date(newDate);
}

export default function ShiftsPersonal() {
  const { enqueueSnackbar } = useSnackbar();
  const { updateShowLoader } = useUser();
  const [shifts, setShfits] = useState<IshiftDetail[]>([]);
  const [startDate, setStartDate] = useState(getLastSunday(7));

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

  useEffect(() => {
    fetchShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  return (
    <div>
      <h2>המשמרות שלי</h2>
      <DateSelect setDate={setStartDate} />
      <div style={{ marginTop: "10px" }}>
        {shifts &&
          shifts.map((day: IshiftDetail) => (
            <WorkerShift key={day.id} shift={day} />
          ))}
      </div>
    </div>
  );
}
