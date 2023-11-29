import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Button,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { api } from "../../API/Api";
import { IshiftDetail } from "../../Model";
import { useConfirm } from "../../Context/useConfirm";

export type Props = {
  open: boolean;
  shift: Partial<IshiftDetail>;
  handleClose: () => void;
};

export default function ShiftPlanEdit({ open, shift, handleClose }: Props) {
  const { confirm } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const [currentShift, setCurrentShift] =
    useState<Partial<IshiftDetail>>(shift);

  useEffect(() => {
    // console.log(shift);
    setCurrentShift(shift);
  }, [shift]);

  const onChange = useCallback(
    <K extends keyof IshiftDetail>(key: K, val: IshiftDetail[K]) => {
      setCurrentShift({ ...currentShift, [key]: val });
    },
    [currentShift]
  );

  const handleChange = (newValue: Dayjs | null) => {
    // console.log(newValue);
    onChange("startDateEN", newValue?.format() || "01/01/2000");
  };

  function GetDateTimeFormatEN(d: string) {
    return `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}/${new Date(
      d
    ).getFullYear()}`;
  }

  const updateShift = useCallback(async () => {
    if (currentShift.startDateEN === undefined) {
      enqueueSnackbar({
        message: "אנא בחר שעת סיום",
        variant: "error",
      });
      return;
    }

    currentShift.startDate = GetDateTimeFormatEN(currentShift.startDateEN);
    currentShift.finishTime = GetDateTimeFormatEN(currentShift.startDateEN);
    currentShift.finishTimeEN = GetDateTimeFormatEN(currentShift.startDateEN);
    currentShift.startDateEN = GetDateTimeFormatEN(currentShift.startDateEN);
    try {
      const data = await api.updateShiftPlan(currentShift);

      if (!data.d.success) {
        enqueueSnackbar({
          message: `נכשל לעדכן תקלה. ${data.d.msg}`,
          variant: "error",
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }

    handleClose();
  }, [currentShift, enqueueSnackbar, handleClose]);

  const cancelShift = useCallback(async () => {
    if (currentShift.id && (await confirm("האם את בטוחה שברצונך לבטל?"))) {
      try {
        const data = await api.cancelShiftPlan(currentShift.id);

        if (!data.d.success) {
          enqueueSnackbar({
            message: `נכשל לעדכן תקלה. ${data.d.msg}`,
            variant: "error",
          });
          return;
        }
      } catch (error) {
        console.error(error);
      }

      handleClose();
    }
  }, [confirm, currentShift.id, enqueueSnackbar, handleClose]);

  return (
    <Dialog
      dir="rtl"
      sx={{ textAlign: "right" }}
      fullWidth
      onClose={handleClose}
      maxWidth="xs"
      open={open}
    >
      <DialogContent>
        <div>
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
              format="DD/MM/YYYY"
              value={dayjs(currentShift.startDateEN)}
              onChange={handleChange}
            />
          </LocalizationProvider>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "5px",
            }}
          >
            {currentShift &&
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
              {currentShift ? "עדכן" : "הוסף חדש"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
