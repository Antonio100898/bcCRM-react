import "../WorkerExpenses.styles.css";
import {
  MenuItem,
  Select,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useSnackbar } from "notistack";
import { IWorkExpensesType } from "../../../Model";
import { useUser } from "../../../Context/useUser";
import { workerService } from "../../../API/services";

export type Props = {
  refreshlist: () => void;
  setFilterMonth: Dispatch<SetStateAction<string>>;
};

export default function AddWorkerExpenseGuideToolBar({
  refreshlist,
  setFilterMonth,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [expensType, setExpensType] = useState("18");
  const [remarkExpens, setRemarkExpens] = useState("");
  const [startExpensDate, setStartExpensDate] = useState<Dayjs | null>(
    dayjs(new Date().toString())
  );
  const [finishExpensDate, setFinishExpensDate] = useState<Dayjs | null>(
    dayjs(new Date().toString())
  );

  const { updateShowLoader } = useUser();
  const [workerExpensesTypes, setWorkerExpensesTypes] = useState<
    IWorkExpensesType[]
  >([]);

  const fetchWorkExpensesTypesForWorker = async () => {
    try {
      const data = await workerService.getWorkExpensesTypesForWorker();
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
          (e) => e.expenseType !== 27
        )
      );
      updateShowLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkExpensesTypesForWorker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilterMonth(`${startExpensDate!.toDate().getMonth() + 1}`);
  }, [startExpensDate]);

  const handleChange = (newValue: Dayjs | null) => {
    // console.log(newValue);
    setStartExpensDate(newValue);
  };

  const handleChangeFinish = (newValue: Dayjs | null) => {
    setFinishExpensDate(newValue);
  };

  function GetDateTimeFormatEN(d: string) {
    return `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}/${new Date(
      d
    ).getFullYear()} ${new Date(d).getHours()}:${new Date(d).getMinutes()}`;
  }

  const saveWorkerExpence = async () => {
    if (remarkExpens.length === 0) {
      enqueueSnackbar({
        message: "נא להזין את שם המקום",
        variant: "error",
      });
      return;
    }

    if (startExpensDate!.hour() > finishExpensDate!.hour()) {
      enqueueSnackbar({
        message: "זמן הסיום לא יכול להיות לפני זמן ההתחלה",
        variant: "error",
      });
      return;
    }

    const t: IWorkExpensesType[] = workerExpensesTypes.filter((e) => {
      return e.expenseType === parseInt(expensType, 10);
    });

    updateShowLoader(true);
    try {
      const data = await workerService.appendWorkerExpence(
        GetDateTimeFormatEN(startExpensDate!.toString()),
        GetDateTimeFormatEN(finishExpensDate!.toString()),
        expensType,
        t[0].defValue,
        t[0].defValue,
        false,
        remarkExpens
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
    } catch (error) {
      console.error(error);
    }
    setRemarkExpens("");
    refreshlist();
    updateShowLoader(false);
  };

  return (
    <div id="divAddControls" className="row" style={{ marginTop: 20 }}>
      <div className="col-md-2 col-12">
        <Select
          variant="outlined"
          value={expensType}
          className="cboDetail"
          fullWidth
          onChange={(e) => setExpensType(e.target.value)}
        >
          {workerExpensesTypes &&
            workerExpensesTypes
              .filter((name) => name.workExpensCategoryId === 3)
              .map((expenseType: IWorkExpensesType) => {
                return (
                  <MenuItem
                    key={expenseType.expenseType}
                    value={expenseType.expenseType}
                  >
                    {expenseType.workExpensName}
                  </MenuItem>
                );
              })}
        </Select>
      </div>
      <div className="col-md-3 col-12">
        <TextField
          value={remarkExpens}
          className="sumExpens"
          label="שם המקום"
          fullWidth
          onChange={(e) => setRemarkExpens(e.target.value)}
        />
      </div>
      <div className="col-md-2 col-6">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="תאריך"
            format="DD/MM/YYYY"
            value={startExpensDate}
            onChange={handleChange}
          />
        </LocalizationProvider>
      </div>

      <div className="col-md-2 col-6">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="משעה"
            value={startExpensDate}
            onChange={handleChange}
          />
        </LocalizationProvider>
      </div>

      <div className="col-md-2 col-6">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="עד שעה"
            value={finishExpensDate}
            onChange={handleChangeFinish}
          />
        </LocalizationProvider>
      </div>

      <div className="col-1">
        <IconButton
          onClick={saveWorkerExpence}
          style={{
            background: "#F3BE80",
            border: "1px solid rgba(0, 0, 0, 0.25)",
            boxShadow: "inset 0px 5px 10px rgba(0, 0, 0, 0.05)",
            borderRadius: "12px",
          }}
        >
          <Tooltip title="הוסף הוצאה חדשה">
            <SaveIcon
              style={{ fontSize: 35, color: "rgba(255, 255, 255, 0.9)" }}
            />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
}
