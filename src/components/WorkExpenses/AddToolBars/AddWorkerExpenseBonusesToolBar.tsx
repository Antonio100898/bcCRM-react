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
import { useSnackbar } from "notistack";
import { IWorkExpensesType } from "../../../Model";
import { useUser } from "../../../Context/useUser";
import { workerService } from "../../../API/services";

export type Props = {
  workExpensCategoryId: number;
  refreshlist: () => void;
  setFilterMonth: Dispatch<SetStateAction<string>>;
};

export default function AddWorkerExpenseBonusesToolBar({
  workExpensCategoryId,
  refreshlist,
  setFilterMonth,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [expensType, setExpensType] = useState(
    workExpensCategoryId === 2 ? "7" : "31"
  );

  const [remarkExpens, setRemarkExpens] = useState("");
  const [startExpensDate, setStartExpensDate] = useState<Dayjs | null>(
    dayjs(new Date().toString())
  );

  const { updateShowLoader } = useUser();
  const [workerExpensesTypes, setWorkerExpensesTypes] = useState<
    IWorkExpensesType[]
  >([]);

  useEffect(() => {
    setFilterMonth(`${startExpensDate!.toDate().getMonth() + 1}`);
  }, [startExpensDate]);

  const fetchWorkExpensesTypesForWorker = async () => {
    try {
      const data = await workerService.getWorkExpensesTypesForWorker();
      if (!data?.d) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: "אין משתמש כזה",
          variant: "error",
        });
        updateShowLoader(false);
        return;
      }

      if (!data.d.success) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: data.d.msg,
          variant: "error",
        });
        updateShowLoader(false);
        return;
      }

      setWorkerExpensesTypes(data.d.workExpensesTypes);
    } catch (error) {
      console.error(error);
    }
    setRemarkExpens("");
    updateShowLoader(false);
    refreshlist();
  };

  useEffect(() => {
    fetchWorkExpensesTypesForWorker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (newValue: Dayjs | null) => {
    setStartExpensDate(newValue);
  };

  const saveWorkerExpence = async () => {
    const t: IWorkExpensesType[] = workerExpensesTypes.filter((e) => {
      return e.workExpensType === parseInt(expensType, 10);
    });

    updateShowLoader(true);
    try {
      const data = await workerService.appendWorkerExpence(
        startExpensDate?.toDate(),
        startExpensDate?.toDate(),
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
        updateShowLoader(false);
        return;
      }

      if (!data.d.success) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: data.d.msg,
          variant: "error",
        });
        updateShowLoader(false);
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
              .filter(
                (name) => name.workExpensCategoryId === workExpensCategoryId
              )
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
          <DesktopDatePicker
            label="תאריך"
            format="DD/MM/YYYY"
            value={startExpensDate}
            onChange={handleChange}
          />
        </LocalizationProvider>
      </div>

      <div className="col-md-7 col-12">
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
