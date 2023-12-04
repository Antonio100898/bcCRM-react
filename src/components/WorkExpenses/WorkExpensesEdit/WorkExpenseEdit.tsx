import { useState } from "react";
import {
  Tooltip,
  IconButton,
  Box,
  DialogContent,
  Dialog,
  Button,
  TextField,
  ToggleButton,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import { IWorkExpensesType } from "../../../Model";
import { workerService } from "../../../API/services";

export type Props = {
  workerExpenses: IWorkExpensesType;
  refreshlist: () => void;
};

export default function WorkExpenseEdit({
  workerExpenses,
  refreshlist,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentExpence, setCurrentExpence] = useState<IWorkExpensesType>(
    workerExpenses!
  );

  const onChange = <K extends keyof IWorkExpensesType>(
    key: K,
    val: IWorkExpensesType[K]
  ) => {
    setCurrentExpence({ ...currentExpence, [key]: val });
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Use the prop.
    // hideDialog();
  };

  const handleChange = (newValue: Dayjs | null) => {
    onChange(
      "startExpenseDateEN",
      newValue?.format("DD/MM/YYYY") || "01/01/2000"
    );
  };

  function showExpenceEdit() {
    setOpenDialog(true);
  }

  const updateWorkerExpence = async () => {
    currentExpence.startExpenseDate = new Date(
      currentExpence.startExpenseDateEN
    );
    try {
      const data = await workerService.updateWorkerExpence(currentExpence);

      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
        return;
      }

      setOpenDialog(false);
      refreshlist();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <IconButton
        onClick={() => {
          showExpenceEdit();
        }}
      >
        <Tooltip title="ערוך הוצאה">
          <EditIcon style={{ color: "blue" }} />
        </Tooltip>
      </IconButton>

      <Dialog
        sx={{ textAlign: "center" }}
        maxWidth="xs"
        open={openDialog} // Use value directly here
        onClose={handleDialogClose}
      >
        <DialogContent>
          <div dir="rtl">
            <Box noValidate component="form">
              {currentExpence && (
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="תאריך"
                      format="DD/MM/YYYY"
                      value={dayjs(currentExpence.startExpenseDateEN)}
                      onChange={handleChange}
                    />
                  </LocalizationProvider>
                  <br />
                  {currentExpence.workExpensCategoryId === 1 && (
                    <div>
                      <Tooltip title="חופשי חודשי">
                        <ToggleButton
                          value="true"
                          fullWidth
                          selected={currentExpence.freePass}
                          onChange={() =>
                            onChange("freePass", currentExpence.freePass)
                          }
                        >
                          חופשי חודשי
                        </ToggleButton>
                      </Tooltip>

                      <br />
                    </div>
                  )}
                  <TextField
                    label="הערה"
                    fullWidth
                    value={currentExpence.remark}
                    onChange={(e) => onChange("remark", e.target.value)}
                  />

                  <br />

                  <TextField
                    label={
                      currentExpence.workExpensCategoryId === 4
                        ? "קילומטר"
                        : "סכום"
                    }
                    type="number"
                    fullWidth
                    value={currentExpence.expenseValue}
                    onChange={(e) =>
                      onChange("expenseValue", parseInt(e.target.value, 10))
                    }
                  />
                </div>
              )}

              <div>
                <Button
                  variant="outlined"
                  onClick={updateWorkerExpence}
                  style={{ marginTop: 40, fontSize: 20 }}
                >
                  עדכן
                </Button>
              </div>
            </Box>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
