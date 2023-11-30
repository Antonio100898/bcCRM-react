import { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SurfingOutlinedIcon from "@mui/icons-material/SurfingOutlined";
import { useSnackbar } from "notistack";
import { api } from "../../API/axoisConfig";
import { TOKEN_KEY } from "../../Consts/Consts";
import { IshiftWeek, IDayInfo } from "../../Model";
import { ShiftsContainer } from "../../components/Shifts/ShiftsContainer";
import DaysHeader from "../../components/Shifts/DaysHeader";
import "./Shifts.styles.css";
import DateSelect from "../../components/Shifts/DateSelect";
import { useUser } from "../../Context/useUser";
import { useConfirm } from "../../Context/useConfirm";

function getLastSunday(orOtherDay: number) {
  const date = new Date();
  const today = date.getDate();
  const currentDay = date.getDay();
  const newDate = date.setDate(today - (currentDay || orOtherDay));

  return new Date(newDate);
}

export default function Shifts() {
  const { enqueueSnackbar } = useSnackbar();
  const { confirm } = useConfirm();
  const { updateShowLoader, user } = useUser();
  const [shifts, setShfits] = useState<IshiftWeek[]>([]);
  const [myWeekDays, setweekDays] = useState<IDayInfo[]>([]);

  const [startDate, setStartDate] = useState(
    getLastSunday(new Date().getDay())
  );
  const [showShiftDetails, setShowShiftDetails] = useState(false);
  const [shiftGroupId, setShiftGroupId] = useState(
    user?.department === 4 ? 2 : 1
  );

  const appendDefultWeekShifts = () => {
    const workerKey = localStorage.getItem(TOKEN_KEY);

    // console.log("startDate: " + startDate);
    api
      .post("/AppendDefultWeekShifts", {
        workerKey,
        startTime: new Date(startDate).toDateString(),
        shiftGroupId,
      })
      .then(({ data }) => {
        if (!data.d.success) {
          enqueueSnackbar({
            message: data.d.msg,
            variant: "error",
          });
        }
        // setShfits(data.d.shiftDetails);
        // updateShowLoader(false);
      })
      .catch((error) => {
        // your error handling goes here
        enqueueSnackbar({
          message: error,
          variant: "error",
        });
      });
  };

  const askAddDefaults = async (): Promise<boolean> => {
    if (
      await confirm(
        "לא נמצאו משמרות לשבוע זה, האם ברצונך להוסיף משמרות ברירת מחדל?"
      )
    ) {
      updateShowLoader(true);
      appendDefultWeekShifts();
      return true;
    }

    return false;
  };

  const getShifts = async () => {
    updateShowLoader(true);
    const workerKey = localStorage.getItem(TOKEN_KEY);

    api
      .post("/GetShiftDetails", {
        workerKey,
        startTime: startDate,
        shiftGroupID: shiftGroupId,
      })
      .then(async ({ data }) => {
        if (!data.d.success) {
          enqueueSnackbar({
            message: data.d.msg,
            variant: "error",
          });
          return;
        }

        setweekDays(data.d.shiftsDays);
        setShfits(data.d.shiftDetails);
        updateShowLoader(false);

        if (data.d.shiftDetails.length === 0) {
          if (await askAddDefaults()) {
            getShifts();
          }
        }
      })
      .catch((error) => {
        // your error handling goes here
        enqueueSnackbar({
          message: error,
          variant: "error",
        });
      });
  };

  useEffect(() => {
    // console.log(shiftGroupId);
    getShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, setShowShiftDetails, shiftGroupId]);

  const showWorkersMissingShiftPlans = () => {
    const workerKey = localStorage.getItem(TOKEN_KEY);

    // console.log("startDate: " + startDate);
    api
      .post("/GetWorkersMissingShiftsPlan", {
        workerKey,
        start: new Date(startDate).toDateString(),
      })
      .then(({ data }) => {
        if (!data.d.success) {
          enqueueSnackbar({
            message: data.d.msg,
            variant: "error",
          });

          if (data.d.msg === "נכשל לעדכן תקלה. חסר פרטי משתמש") {
            enqueueSnackbar({
              message: "Log Out",
              variant: "error",
            });
          }
          return;
        }
        enqueueSnackbar({
          message: data.d.msg,
          variant: "error",
        });
        // console.log(data.d.msg);
        // GetShifts();
        // setShfits(data.d.shiftDetails);
        updateShowLoader(false);
      })
      .catch((error) => {
        // your error handling goes here
        enqueueSnackbar({
          message: error,
          variant: "error",
        });
      });
  };

  return (
    <div
      style={{
        marginRight: "5px",
        background: "#F5F5F5",
      }}
    >
      <h2>סידור משמרות</h2>
      <div
        style={{
          display: "flex",
          flex: "row",
          justifyContent: "space-around",
        }}
      >
        {user?.userType === 1 && (
          <Tooltip title="קבוצת משמרות" placement="top-start">
            <Select
              label="קבוצת משמרות"
              variant="outlined"
              value={shiftGroupId}
              onChange={(e: SelectChangeEvent<number>) =>
                setShiftGroupId(parseInt(`${e.target.value}`, 10))
              }
              style={{ marginBottom: "5px" }}
            >
              <MenuItem value="1">ענן</MenuItem>
              <MenuItem value="2">תפריטים</MenuItem>
            </Select>
          </Tooltip>
        )}

        <Tooltip title={showShiftDetails ? "הצג פירוט" : "הסתר פירוט"}>
          <Switch onChange={() => setShowShiftDetails(!showShiftDetails)} />
        </Tooltip>

        <Tooltip title="מי לא הגיש משמרות השבוע">
          <IconButton
            onClick={showWorkersMissingShiftPlans}
            style={{
              background: "#F3BE80",
              borderRadius: "12px",
              margin: 5,
            }}
          >
            <SurfingOutlinedIcon
              style={{ fontSize: 40, color: "rgba(255, 255, 255, 0.9)" }}
            />
          </IconButton>
        </Tooltip>
      </div>

      <DateSelect setDate={setStartDate} />

      <br />
      <div style={{ overflow: "scroll", position: "relative" }}>
        <div>
          <div
            style={{
              position: "relative",
            }}
          >
            <div style={{ position: "sticky", top: "0", zIndex: "1000" }}>
              <DaysHeader
                weekDaysAll={myWeekDays}
                shiftGroupId={shiftGroupId}
              />
            </div>
            <div style={{ marginTop: 20 }}>
              {shifts && (
                <div>
                  <ShiftsContainer
                    refreshList={getShifts}
                    shiftsList={shifts}
                    startOfWeek={startDate}
                    title="בוקר"
                    shiftTypeId={1}
                    showDetails={showShiftDetails}
                    shiftGroupId={shiftGroupId}
                  />

                  <ShiftsContainer
                    refreshList={getShifts}
                    shiftsList={shifts}
                    startOfWeek={startDate}
                    title="צהריים"
                    shiftTypeId={2}
                    showDetails={showShiftDetails}
                    shiftGroupId={shiftGroupId}
                  />

                  <ShiftsContainer
                    refreshList={getShifts}
                    shiftsList={shifts}
                    startOfWeek={startDate}
                    title="ערב"
                    shiftTypeId={3}
                    showDetails={showShiftDetails}
                    shiftGroupId={shiftGroupId}
                  />

                  <ShiftsContainer
                    refreshList={getShifts}
                    shiftsList={shifts}
                    startOfWeek={startDate}
                    title="לילה"
                    shiftTypeId={4}
                    showDetails={showShiftDetails}
                    shiftGroupId={shiftGroupId}
                  />

                  <ShiftsContainer
                    refreshList={getShifts}
                    shiftsList={shifts}
                    startOfWeek={startDate}
                    title="בלתמ"
                    shiftTypeId={5}
                    showDetails={showShiftDetails}
                    shiftGroupId={shiftGroupId}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
