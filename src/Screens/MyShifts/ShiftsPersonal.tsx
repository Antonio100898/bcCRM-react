import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { api } from "../../API/Api";
import { TOKEN_KEY } from "../../Consts/Consts";
import { IshiftDetail } from "../../Model";
import DateSelect from "../../components/Shifts/DateSelect";
import WorkerShift from "../../components/ShiftsPersonal/WorkerShift";
import { useUser } from "../../Context/useUser";

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

  const GetShifts = useCallback(() => {
    updateShowLoader(true);
    const workerKey = localStorage.getItem(TOKEN_KEY);

    api
      .post("/GetShiftsForWorker", {
        workerKey,
        startTime: startDate,
      })
      .then(({ data }) => {
        if (!data.d.success) {
          enqueueSnackbar({
            message: data.d.msg,
            variant: "error",
          });
          return;
        }

        setShfits(data.d.workerShifts);
        updateShowLoader(false);
      })
      .catch((error) => {
        // your error handling goes here

        enqueueSnackbar({
          message: error,
          variant: "error",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  useEffect(() => {
    GetShifts();
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
