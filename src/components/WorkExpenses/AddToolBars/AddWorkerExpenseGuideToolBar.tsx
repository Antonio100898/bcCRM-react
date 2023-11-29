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
import { TOKEN_KEY } from "../../../Consts/Consts";
import { api } from "../../../API/Api";
import { useUser } from "../../../Context/useUser";

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

  useEffect(() => {
    api
      .post("/GetWorkExpensesTypesForWorker", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        filterWorkerId: 0,
      })
      .then(({ data }) => {
        if (!data.d) {
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

        setWorkerExpensesTypes(data.d.workExpensesTypes);
        setExpensType("18");
        updateShowLoader(false);
        refreshlist();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilterMonth(`${startExpensDate!.toDate().getMonth() + 1}`);
  }, [setFilterMonth, startExpensDate]);

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

  const saveWorkerExpence = () => {
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
      return e.workExpensType === parseInt(expensType, 10);
    });

    updateShowLoader(true);
    api
      .post("/AppendWorkerExpence", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        startExpenceDate: GetDateTimeFormatEN(startExpensDate!.toString()),
        finishExpenceDate: GetDateTimeFormatEN(finishExpensDate!.toString()),
        expenseType: expensType,
        sum: t[0].defValue,
        expenseTypeUnitValue: t[0].defValue,
        freePass: false,
        remark: remarkExpens,
      })
      .then(({ data }) => {
        if (!data.d) {
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
        setRemarkExpens("");
        refreshlist();
        updateShowLoader(false);
      });
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
                    key={expenseType.workExpensType}
                    value={expenseType.workExpensType}
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
