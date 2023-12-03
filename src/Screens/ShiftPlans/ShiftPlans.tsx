import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Switch, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArticleIcon from "@mui/icons-material/Article";
import { useSnackbar } from "notistack";
import { ShiftPlansWeek } from "../../components/ShiftPlans/ShiftPlansWeek";
import { IshiftWeek } from "../../Model";
import { ExcelShiftPlans } from "../../components/Excel/ExcelShiftPlans";
import { useUser } from "../../Context/useUser";
import { shiftService } from "../../API/services";

export interface IdayO {
  date: string;
  isToday: boolean;
  dayName: string;
}

function getLastSunday(orOtherDay: number) {
  const date = new Date();
  const today = date.getDate();
  const currentDay = date.getDay();
  const newDate = date.setDate(today - (currentDay || orOtherDay));

  return new Date(newDate);
}

function getLastSundayOption(date: Date, orOtherDay: number) {
  const today = date.getDate();
  const currentDay = date.getDay();
  if (currentDay === orOtherDay) {
    return date;
  }
  const newDate = date.setDate(today - (currentDay || orOtherDay));

  return new Date(newDate);
}

function addDays(theDate: Date, days: number) {
  return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}

export default function ShiftPlans() {
  const { enqueueSnackbar } = useSnackbar();
  const { updateShowLoader } = useUser();
  const [shiftPlans, setShiftPlans] = useState<IshiftWeek[]>([]);
  const [startDate, setStartDate] = useState(getLastSunday(7));
  const [showAllPlans, setShowAllPlans] = useState(false);

  function getDays() {
    const days: IdayO[] = [];
    const daysName = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

    const t = new Date().toLocaleDateString("he");

    for (let index = 0; index < 7; index += 1) {
      const d = addDays(startDate, index).toLocaleDateString("he");
      days.push({ date: d, isToday: d === t, dayName: daysName[index] });
    }

    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const fetchShifts = async () => {
    updateShowLoader(true);
    try {
      const data = showAllPlans
        ? await shiftService.getShiftPlans(startDate)
        : await shiftService.getShiftPlansForWorker(startDate);

      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
        updateShowLoader(false);
        return;
      }

      setShiftPlans(data.d.shiftDetails);
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
  }, [startDate, showAllPlans]);

  const handleChange = (newValue: Dayjs | null) => {
    const d: Date = getLastSundayOption(newValue!.toDate(), 7);
    setStartDate(d);
  };

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

  return (
    <div style={{ marginRight: "5px" }}>
      <div className="row" style={{ justifyContent: "left" }}>
        <Tooltip title="יצא לאקסל" className="col-1">
          <IconButton
            onClick={exportFile}
            style={{
              borderRadius: "12px",
              margin: 5,
            }}
          >
            <ArticleIcon style={{ fontSize: 40, color: "#F3BE80" }} />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={showAllPlans ? "הצג את שלי" : "הצג את כולם"}
          className="col-1"
        >
          <Switch onChange={() => setShowAllPlans(!showAllPlans)} />
        </Tooltip>
      </div>
      <h2>זמינות </h2>

      <div className="row">
        <Tooltip title="שבוע אחורה" className="col-3 right">
          <IconButton
            onClick={() => {
              setStartDate(addDays(startDate, -7));
            }}
          >
            <ArrowLeftIcon
              style={{
                height: "46px",
                fontSize: "50px",
                background: "#FFF5E9",
                border: "1px solid rgba(0, 0, 0, 0.5)",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
                borderRadius: "8px",
                transform: "matrix(-1, 0, 0, 1, 0, 0)",
              }}
            />
          </IconButton>
        </Tooltip>
        <div className="col-6">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              format="DD/MM/YYYY"
              value={dayjs(startDate)}
              onChange={handleChange}
              slotProps={{
                textField: {
                  sx: {
                    fontFamily: "Rubik",
                    fontStyle: "normal",
                    fontWeight: "300",
                    fontSize: "26px",
                    lineHeight: "38px",
                    textAlign: "center",
                    background: "#FFF5E9",
                    border: "1px solid rgba(0, 0, 0, 0.75)",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px",
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>

        <Tooltip title="שבוע קדימה" className="col-3 left">
          <IconButton
            onClick={() => {
              setStartDate(addDays(startDate, 7));
            }}
          >
            <ArrowRightIcon
              style={{
                fontSize: "50px",
                background: "#FFF5E9",
                border: "1px solid rgba(0, 0, 0, 0.5)",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
                borderRadius: "8px",
                transform: "matrix(-1, 0, 0, 1, 0, 0)",
              }}
            />
          </IconButton>
        </Tooltip>
      </div>
      <br />
      <div style={{ overflow: "scroll" }}>
        <div
          style={{
            display: "flex",
            flex: "row",
            textAlign: "center",
            fontFamily: "Rubik",
            fontStyle: "normal",
            fontWeight: "700",
            fontSize: "26px",
            lineHeight: "35px",
          }}
        >
          {getDays().map((day: IdayO, index) => (
            <div
              key={`${day.date}${index}`}
              style={{
                width: "14.2%",
                minWidth: "140px",
                color: day.isToday ? "blue" : "black",
              }}
            >
              {day.dayName}
              <br /> {day.date}
            </div>
          ))}
        </div>
        <div>
          {shiftPlans && (
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
          )}
        </div>
      </div>
    </div>
  );
}
