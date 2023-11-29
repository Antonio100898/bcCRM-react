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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSnackbar } from "notistack";
import { IWorkExpensesType } from "../../../Model";
import { TOKEN_KEY } from "../../../Consts/Consts";
import { api } from "../../../API/Api";
import { useUser } from "../../../Context/useUser";

export type Props = {
  refreshlist: () => void;
  setFilterMonth: Dispatch<SetStateAction<string>>;
  setFilterYear: Dispatch<SetStateAction<string>>;
};

export default function AddWorkerExpenseToolBarReplayPrecentge({
  refreshlist,
  setFilterMonth,
  setFilterYear,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [expensType, setExpensType] = useState("17");
  const [sumExpens, setSumExpens] = useState("0");
  const [remarkExpens, setRemarkExpens] = useState("");
  const [expensDate, setExpensDate] = useState<Dayjs | null>(
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
        updateShowLoader(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilterMonth(`${expensDate!.toDate().getMonth() + 1}`);
    setFilterYear(`${expensDate!.toDate().getFullYear()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expensDate]);

  // const handleChange = (newValue: Dayjs | null) => {
  //   setExpensDate(newValue);
  // };

  const saveWorkerExpence = () => {
    const sum = Number.parseFloat(sumExpens);
    if (sum <= 0) {
      enqueueSnackbar({
        message: "אנא הזן אחוז מענה",
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
        startExpenceDate: expensDate?.toDate(),
        finishExpenceDate: expensDate?.toDate(),
        expenseType: expensType,
        sum,
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

        setSumExpens("0");
        setRemarkExpens("");
        updateShowLoader(false);
        refreshlist();
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
              .filter((name) => name.workExpensCategoryId === 5)
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
      <div className="col-md-2 col-6">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["year", "month"]}
            label="חודש"
            minDate={dayjs("2022-01-01")}
            maxDate={dayjs("2025-01-01")}
            value={expensDate}
            onChange={(newValue: Dayjs | null) => {
              setExpensDate(newValue);
            }}
          />
        </LocalizationProvider>
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="תאריך"
            inputFormat="DD/MM/YYYY"
            value={expensDate}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider> */}
      </div>

      <div className="col-md-2 col-12">
        <TextField
          value={sumExpens}
          label="אחוז מענה"
          className="sumExpens"
          fullWidth
          type="number"
          onChange={(e) => setSumExpens(e.target.value)}
        />
      </div>

      <div className="col-md-5 col-12">
        <TextField
          value={remarkExpens}
          className="sumExpens"
          label="הערה"
          fullWidth
          onChange={(e) => setRemarkExpens(e.target.value)}
        />
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
