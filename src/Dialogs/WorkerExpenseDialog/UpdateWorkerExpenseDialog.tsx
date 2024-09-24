import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CustomDialog from "../CustomDialog";
import {
  Box,
  Stack,
  SxProps,
  Theme,
  TextField,
  Typography,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormInputWrapper from "../../components/BaseCompnents/FormInputWrapper";
import { IWorkExpensesType } from "../../Model";
import { workerService } from "../../API/services";
import { enqueueSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";
import CustomButton from "../../components/Buttons/CustomButton";

type Props = {
  open: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  sx?: SxProps<Theme>;
  refreshList: () => void;
  expense: IWorkExpensesType;
};

const UpdateWorkerExpenseDialog = ({
  onClose,
  open,
  fullScreen,
  sx,
  refreshList,
  expense,
}: Props) => {
  const [currentExpense, setCurrentExpense] = useState(expense);

  const onChange = <K extends keyof IWorkExpensesType>(
    key: K,
    val: IWorkExpensesType[K]
  ) => {
    setCurrentExpense({ ...currentExpense, [key]: val });
  };
  const handleDateChange = (newValue: Dayjs | null) => {
    onChange(
      "startExpenseDateEN",
      newValue?.format("DD/MM/YYYY") || "01/01/2000"
    );
  };

  const updateWorkerExpense = async () => {
    currentExpense.startExpenseDate = new Date(
      currentExpense.startExpenseDateEN
    );
    try {
      const data = await workerService.updateWorkerExpence(currentExpense);

      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
        return;
      }

      onClose();
      refreshList();
    } catch (error) {
      console.error(error);
    }
  };

  const Actions = () => {
    return (
      <DialogActions>
        <CustomButton
          fullWidth
          onClick={updateWorkerExpense}
          sx={{ mb: 4, mx: 2 }}
        >
          שמירה
        </CustomButton>
      </DialogActions>
    );
  };

  return (
    <CustomDialog
      onClose={onClose}
      open={open}
      fullScreen={fullScreen}
      sx={sx}
      title="הוצאה חדשה"
      dialogActions={Actions()}
    >
      <Stack gap={6} mt={4}>
        <Stack direction="row" gap={2}>
          <Box>
            <FormInputWrapper label="תאריך">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(currentExpense.startExpenseDateEN)}
                  onChange={handleDateChange}
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "6px",
                      textAlign: "center",
                    },
                  }}
                />
              </LocalizationProvider>
            </FormInputWrapper>
          </Box>
          <Stack direction="row-reverse" alignItems="flex-end" gap={1}>
            <Typography component="span" fontWeight={600} fontSize={20}>
              ₪
            </Typography>
            <FormInputWrapper label="סכום">
              <TextField
                value={currentExpense.expenseValue}
                onChange={(e) =>
                  onChange("expenseValue", Number(e.currentTarget.value))
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input": {
                    padding: "6px",
                  },
                }}
              />
            </FormInputWrapper>
          </Stack>
        </Stack>
        <FormInputWrapper label="הערה">
          <TextField
            value={currentExpense.remark}
            onChange={(e) => onChange("remark", e.currentTarget.value)}
            type="text"
            multiline
          />
        </FormInputWrapper>
      </Stack>
    </CustomDialog>
  );
};

export default UpdateWorkerExpenseDialog;
