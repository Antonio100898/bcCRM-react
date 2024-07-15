import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import SelectChip from "../../components/SelectChip/SelectChip";
import SelectsChipGroup from "../../components/SelectChipGroup/SelectsChipGroup";
import CustomDialog from "../CustomDialog";
import {
  Box,
  Stack,
  SxProps,
  Theme,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormInputWrapper from "../../components/BaseCompnents/FormInputWrapper";
import { IWorkExpensesType } from "../../Model";
import { workerService } from "../../API/services";
import { enqueueSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";
import { useUser } from "../../Context/useUser";

type Props = {
  open: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  sx?: SxProps<Theme>;
  refreshList: () => void;
};

const expensesCategories = [
  {
    id: 1,
    name: "הוצאות עבודה",
  },
  {
    id: 2,
    name: "בונוסים",
  },
  {
    id: 4,
    name: "קילומטר",
  },
];

function GetDateTimeFormatEN(d: string) {
  return `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}/${new Date(
    d
  ).getFullYear()} ${new Date(d).getHours()}:${new Date(d).getMinutes()}`;
}

const WorkerExpenseDialog = ({ onClose, open, fullScreen, sx, refreshList }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<null | number>(1);
  const [selectedExpenseType, setSelectedExpenseType] = useState<null | string>(
    null
  );

  const [sum, setSum] = useState<string | 0>("");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date().toString()));
  const { updateShowLoader } = useUser();
  const [workerExpensesTypes, setWorkerExpensesTypes] = useState<
    IWorkExpensesType[]
  >([]);

  const { user } = useUser();

  const fetchWorkExpensesTypesForWorker = async () => {
    if (!user || !selectedCategory) return;
    try {
      const data = await workerService.getWorkExpensesTypesForWorker(
        user?.workerId
      );
      if (!data?.d) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: "אין משתמש כזה",
          variant: "error",
        });
        return;
      }

      if (!data.d.success) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: data.d.msg,
          variant: "error",
        });
        return;
      }
      setWorkerExpensesTypes(
        (data.d.workExpensesTypes as IWorkExpensesType[]).filter(
          (e) =>
            e.workExpensType !== 27 &&
            e.workExpensCategoryId === selectedCategory
        )
      );

      updateShowLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setSelectedExpenseType(null);
    setSum("0");
    user && open && fetchWorkExpensesTypesForWorker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, open, selectedCategory]);

  const handleDateChange = (newValue: Dayjs | null) => {
    // console.log(newValue);
    setDate(newValue);
  };

  const handleSumChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedCategory === 2) return;
    setSum(e.currentTarget.value);
  };

  const saveWorkerExpence = async () => {
    if (!(selectedCategory && selectedExpenseType && Number(sum) > 0)) {
      enqueueSnackbar({
        message: "חובה לבחור סוג ,תיאור הוצאה וסכום",
        variant: "error",
      });
      return;
    }
    const t: IWorkExpensesType[] = workerExpensesTypes.filter((e) => {
      return e.workExpensType === parseInt(selectedExpenseType, 10);
    });

    updateShowLoader(true);
    try {
      const data = await workerService.appendWorkerExpence(
        GetDateTimeFormatEN(date!.toString()),
        GetDateTimeFormatEN(date!.toString()),
        selectedExpenseType.toString(),
        sum,
        sum.toString(),
        false,
        remark
      );
      if (!data?.d) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: "תקלה",
          variant: "error",
        });
        return;
      }

      if (!data.d.success) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: data.d.msg,
          variant: "error",
        });
        return;
      }
      refreshList()
    } catch (error) {
      console.error(error);
    }
    setRemark("");
    updateShowLoader(false);
    onClose();
  };

  const handleExpenseTypeChange = (id: string) => {
    setSelectedExpenseType(id);
    selectedCategory === 2 && setSum(workerExpensesTypes.find((w) => w.id === id)?.defValue || 0);
  };

  useEffect(() => {
    if (!open) {
      setSelectedCategory(1);
      setSelectedExpenseType(null);
      setRemark("");
    }
  }, [open]);

  return (
    <CustomDialog
      onClose={onClose}
      open={open}
      fullScreen={fullScreen}
      onSubmit={saveWorkerExpence}
      sx={sx}
      title="הוצאה חדשה"
    >
      <Stack gap={6} mt={4}>
        <SelectsChipGroup label="סוג הוצאה">
          {expensesCategories.map((cat) => (
            <SelectChip
              onClick={() => setSelectedCategory(cat.id)}
              selected={selectedCategory === cat.id}
              label={cat.name}
              key={cat.id}
            />
          ))}
        </SelectsChipGroup>
        <SelectsChipGroup label="תיאור">
          {workerExpensesTypes.map((type) => (
            <SelectChip
              onClick={() => handleExpenseTypeChange(type.id)}
              selected={selectedExpenseType === type.id}
              label={type.workExpensName}
              key={type.id}
            />
          ))}
        </SelectsChipGroup>
        <Stack direction="row" gap={2}>
          <Box>
            <FormInputWrapper label="תאריך">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={handleDateChange}
                  value={date}
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
                value={sum}
                onChange={handleSumChange}
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
            value={remark}
            onChange={(e) => setRemark(e.currentTarget.value)}
            type="text"
            multiline
          />
        </FormInputWrapper>
      </Stack>
    </CustomDialog>
  );
};

export default WorkerExpenseDialog;
