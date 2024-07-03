import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Button,
  DialogTitle,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { IWorker, IshiftDetail } from "../../Model";
import { useConfirm } from "../../Context/useConfirm";
import { useUser } from "../../Context/useUser";
import { shiftService } from "../../API/services";
import { IOption } from "../../helpers/getHoursOptions";

export type Props = {
  open: boolean;
  shift: Partial<IshiftDetail>;
  handleClose: () => void;
  shiftGroupId: number;
};

export default function ShiftEdit({
  open,
  shift,
  handleClose,
  shiftGroupId,
}: Props) {
  const { confirm } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const { workers, user } = useUser();
  const [currentShift, setCurrentShift] =
    useState<Partial<IshiftDetail>>(shift);
  const [myWorkers, setMyWorkers] = useState<IWorker[]>([]);
  const [startTime, setStartTime] = useState("00:00");
  const [finishTime, setFinishTime] = useState("00:00");

  function GetTimeString(sTime: string | undefined) {
    const d = dayjs(sTime);
    const h = d.hour();
    let m = d.minute();
    if (m !== 0 && m !== 15 && m !== 30 && m !== 45) {
      if (m > 45) {
        m = 45;
      }
      if (m < 15) {
        m = 0;
      }
      if (m > 15 && m < 30) {
        m = 15;
      }
      if (m > 30 && m < 45) {
        m = 30;
      }
    }

    const s = `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}`;
    return s;
  }

  const fetchShiftPlans = async () => {
    try {
      const data = await shiftService.getShiftPlansDetails(
        new Date(currentShift.startDateEN!).toDateString()
      );
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
          variant: "error",
        });
        return;
      }

      const shi: IshiftDetail[] = data.d.shiftPlanDetails;
      const wsData1: IWorker[] =
        workers &&
        workers
          .filter((name: IWorker) => name.departmentId === user?.department)
          .filter((worker: IWorker) => {
            const isPlan =
              shi.filter((a) => a.workerId === worker.Id).length > 0;

            return { ...worker, active: isPlan };
          });

      if (wsData1) setMyWorkers(wsData1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setCurrentShift(shift);
    setStartTime(GetTimeString(shift.startDateEN));
    setFinishTime(GetTimeString(shift.finishTimeEN));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift]);

  useEffect(() => {
    if (open) {
      fetchShiftPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const getHoursOptions = () => {
    const hours: IOption[] = [];

    for (let i = 0; i < 24; i += 1) {
      for (let z = 0; z < 4; z += 1) {
        const s = `${`0${i}`.slice(-2)}:${`0${z * 15}`.slice(-2)}`;
        const a = { label: s, value: s };
        hours.push(a);
      }
    }

    return hours;
  };

  const onChange = <K extends keyof IshiftDetail>(
    key: K,
    val: IshiftDetail[K]
  ) => {
    setCurrentShift({ ...currentShift, [key]: val });
  };

  const handleChange = (newValue: Dayjs | null) => {
    onChange("startDateEN", newValue?.format() || "01/01/2000");
  };

  function GetDateTimeFormatEN(d: string, h: string) {
    return `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}/${new Date(
      d
    ).getFullYear()} ${h}`;
    // new Date(d).getHours() +
    // ":" +
    // new Date(d).getMinutes()
  }

  const updateShift = async () => {
    if (
      currentShift.workerId === undefined ||
      currentShift.workerId === null ||
      currentShift.workerId === 0
    ) {
      enqueueSnackbar({
        message: "אנא בחר עובד",
        variant: "error",
      });
      return;
    }

    if (
      currentShift.finishTimeEN === undefined ||
      currentShift.startDateEN === undefined
    ) {
      enqueueSnackbar({
        message: "אנא בחר שעת סיום",
        variant: "error",
      });
      return;
    }

    currentShift.startDate = GetDateTimeFormatEN(
      currentShift!.startDateEN,
      startTime
    );
    currentShift.finishTime = GetDateTimeFormatEN(
      currentShift!.finishTimeEN,
      finishTime
    );
    try {
      const data = await shiftService.updateShiftDetails(
        currentShift,
        shiftGroupId
      );

      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
          variant: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  const cancelShift = async () => {
    if (currentShift.workerId === user?.workerId || user?.userType === 1) {
      if (!(await confirm("האם את בטוחה שברצונך לבטל?"))) return;
      if (!currentShift?.id) {
        enqueueSnackbar({
          message: `משמרת לא קיימת`,
          variant: "error",
        });
        return;
      }
      try {
        const data = await shiftService.cancelShift(currentShift.id);

        if (!data?.d.success) {
          enqueueSnackbar({
            message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
            variant: "error",
          });
          return;
        }
      } catch (error) {
        console.error(error);
      } finally {
        handleClose();
      }
    }
  };

  return (
    <div>
      <Dialog
        dir="rtl"
        sx={{ textAlign: "right" }}
        fullWidth
        onClose={handleClose}
        maxWidth="xs"
        open={open}
      >
        <DialogTitle>הוספת משמרת</DialogTitle>
        <DialogContent>
          <div>
            <Select
              sx={{ mb: 1 }}
              label="עובד"
              variant="outlined"
              value={currentShift.workerId}
              onChange={(e) =>
                onChange("workerId", parseInt(`${e.target.value}`, 10))
              }
              style={{ width: "100%" }}
            >
              {myWorkers &&
                myWorkers.map((worker: IWorker) => {
                  return (
                    <MenuItem
                      key={worker.Id}
                      value={worker.Id}
                      style={{
                        color: worker.active ? "blue" : "black",
                        fontWeight: worker.active ? "bold" : "normal",
                      }}
                    >
                      {worker.workerName}
                    </MenuItem>
                  );
                })}
            </Select>

            <br />
            <Select
              label="תפקיד"
              variant="outlined"
              value={currentShift.jobTypeId}
              onChange={(e) =>
                onChange("jobTypeId", parseInt(`${e.target.value}`, 10))
              }
              style={{ width: "100%" }}
            >
              <MenuItem value={1}>ליווי והתקנה</MenuItem>
              <MenuItem value={2}>תומך</MenuItem>
              <MenuItem value={3}>מנהל</MenuItem>
              <MenuItem value={4}>התלמדות</MenuItem>
              <MenuItem value={5}>תפריטים</MenuItem>
            </Select>
            <br />
            <Select
              label="משמרת"
              variant="outlined"
              value={currentShift.shiftTypeId}
              onChange={(e) =>
                onChange("shiftTypeId", parseInt(`${e.target.value}`, 10))
              }
              style={{ width: "100%" }}
            >
              <MenuItem value={1}>בוקר</MenuItem>
              <MenuItem value={2}>צהריים</MenuItem>
              <MenuItem value={3}>ערב</MenuItem>
              <MenuItem value={4}>לילה</MenuItem>
              <MenuItem value={5}>בתל&quot;מ</MenuItem>
            </Select>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="תאריך"
                format="DD/MM/YYYY"
                value={dayjs(currentShift.startDateEN)}
                onChange={handleChange}
              />
            </LocalizationProvider>
            <div style={{ display: "flex", flex: "row" }}>
              <div style={{ width: "50%" }}>
                <Select
                  label="עד שעה"
                  variant="outlined"
                  value={finishTime}
                  onChange={(e) => setFinishTime(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {getHoursOptions().map((options: IOption) => (
                    <MenuItem key={options.label} value={options.value}>
                      {options.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div style={{ width: "50%" }}>
                <Select
                  label="משעה"
                  variant="outlined"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {getHoursOptions().map((options: IOption) => (
                    <MenuItem key={options.label} value={options.value}>
                      {options.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>

            <TextField
              value={currentShift?.remark}
              onChange={(e) => onChange("remark", e.target.value)}
              placeholder="הערה"
              multiline
              rows={2}
              fullWidth
              style={{
                background: "#FFFFFF",
                boxShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                borderRadius: "8px",
              }}
            />
            <TextField
              value={currentShift?.placeName}
              onChange={(e) => onChange("placeName", e.target.value)}
              label="עסק"
              fullWidth
              style={{
                background: "#FFFFFF",
                boxShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                borderRadius: "8px",
              }}
            />

            <TextField
              value={currentShift?.address}
              onChange={(e) => onChange("address", e.target.value)}
              label="כתובת"
              fullWidth
              style={{
                background: "#FFFFFF",
                boxShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                borderRadius: "8px",
              }}
            />

            <TextField
              value={currentShift?.contactName}
              onChange={(e) => onChange("contactName", e.target.value)}
              label="איש קשר"
              fullWidth
              style={{
                background: "#FFFFFF",
                boxShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                borderRadius: "8px",
              }}
            />

            <TextField
              value={currentShift?.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              label="טלפון"
              placeholder="טלפון"
              fullWidth
              style={{
                background: "#FFFFFF",
                boxShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                borderRadius: "8px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5px",
              }}
            >
              {user?.userType === 1 &&
                currentShift &&
                currentShift.id !== undefined &&
                currentShift.id > 0 && (
                  <Tooltip title="מחק">
                    <IconButton onClick={cancelShift}>
                      <DeleteIcon style={{ fontSize: 25, color: "red" }} />
                    </IconButton>
                  </Tooltip>
                )}

              <Button
                onClick={updateShift}
                style={{
                  width: "100%",
                  backgroundColor: "#FFAD4A",
                  fontFamily: "Rubik",
                  fontSize: "normal",
                }}
              >
                שמור
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
