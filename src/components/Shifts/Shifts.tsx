import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SurfingOutlinedIcon from "@mui/icons-material/SurfingOutlined";
import { useSnackbar } from "notistack";
import Days from "./Days";
import DateSelect from "../../components/Shifts/DateSelect";
import { useUser } from "../../Context/useUser";
import { useConfirm } from "../../Context/useConfirm";
import { shiftService } from "../../API/services";
import { IDayInfo, IshiftWeek } from "../../Model";
import ShiftsContainer from "./ShiftsContainer";

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

  const appendDefultWeekShifts = async () => {
    try {
      const data = await shiftService.appendDefultWeekShifts(
        new Date(startDate).toDateString(),
        shiftGroupId
      );
      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
      } else {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
      }
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
      console.error(error);
    }
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

  const fetchShifts = async () => {
    updateShowLoader(true);
    try {
      const data = await shiftService.getShiftDetails(startDate, shiftGroupId);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
        updateShowLoader(false);
        return;
      }
      setweekDays(data?.d.shiftsDays);
      setShfits(data?.d.shiftDetails);
      if (data.d.shiftDetails.length === 0) {
        if (await askAddDefaults()) {
          fetchShifts();
        }
      }
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
      console.error(error);
    }

    updateShowLoader(false);
  };

  useEffect(() => {
    // console.log(shiftGroupId);
    fetchShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, setShowShiftDetails, shiftGroupId]);

  const showWorkersMissingShiftPlans = async () => {
    try {
      const data = await shiftService.getWorkersMissingShiftsPlan(
        new Date(startDate).toDateString()
      );
      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
        if (data?.d.msg === "נכשל לעדכן תקלה. חסר פרטי משתמש") {
          enqueueSnackbar({
            message: "Log Out",
            variant: "error",
          });
        }
        return;
      }
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
      console.error(error);
    }
    updateShowLoader(false);
  };

  return (
    <div>
      <Typography textAlign="center" variant="h2" fontWeight="bold">
        סידור משמרות
      </Typography>
      <DateSelect setDate={setStartDate} />
      {/* <div
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
      </div> */}

      <Days weekDaysAll={myWeekDays} shiftGroupId={shiftGroupId} />
      <div>
        <Typography fontSize={18} fontWeight="bold">
          הערה של יום:
        </Typography>
        <TextField />
      </div>
      <ButtonGroup sx={{ mt: "22px", fontSize: "20px" }}>
        <Button variant="contained">בוקר</Button>
        <Button>צהריים</Button>
        <Button>ערב</Button>
        <Button>לילה</Button>
      </ButtonGroup>
      <div style={{ marginTop: 20 }}>
        {shifts && (
          <div>
            <ShiftsContainer
              refreshList={fetchShifts}
              shiftsList={shifts}
              startOfWeek={startDate}
              title="בוקר"
              shiftTypeId={1}
              showDetails={showShiftDetails}
              shiftGroupId={shiftGroupId}
            />

            <ShiftsContainer
              refreshList={fetchShifts}
              shiftsList={shifts}
              startOfWeek={startDate}
              title="צהריים"
              shiftTypeId={2}
              showDetails={showShiftDetails}
              shiftGroupId={shiftGroupId}
            />

            <ShiftsContainer
              refreshList={fetchShifts}
              shiftsList={shifts}
              startOfWeek={startDate}
              title="ערב"
              shiftTypeId={3}
              showDetails={showShiftDetails}
              shiftGroupId={shiftGroupId}
            />

            <ShiftsContainer
              refreshList={fetchShifts}
              shiftsList={shifts}
              startOfWeek={startDate}
              title="לילה"
              shiftTypeId={4}
              showDetails={showShiftDetails}
              shiftGroupId={shiftGroupId}
            />

            <ShiftsContainer
              refreshList={fetchShifts}
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
  );
}
