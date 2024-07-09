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
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import { useSnackbar } from "notistack";
import { IWorkExpensesType } from "../../../Model";
import { useUser } from "../../../Context/useUser";
import { workerService } from "../../../API/services";

export type Props = {
  refreshlist: () => void;
  setFilterMonth: Dispatch<SetStateAction<string>>;
};

export default function AddWorkerExpenseToolBar({
  refreshlist,
  setFilterMonth,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [expensType, setExpensType] = useState("1");
  const [sumExpens, setSumExpens] = useState("0");
  const [remarkExpens, setRemarkExpens] = useState("");
  const [expensDate, setExpensDate] = useState<Dayjs | null>(
    dayjs(new Date().toString())
  );
  const [freePass, setFreePass] = useState(false);
  const { updateShowLoader } = useUser();
  const [workerExpensesTypes, setWorkerExpensesTypes] = useState<
    IWorkExpensesType[]
  >([]);

  useEffect(() => {
    setFilterMonth(`${expensDate!.toDate().getMonth() + 1}`);
  }, [expensDate]);

  const fetchWorkExpensesTypesForWorker = async () => {
    try {
      const data = await workerService.getWorkExpensesTypesForWorker();
      console.log(data)
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
          (e) => e.workExpensType !== 27
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

  const handleChange = (newValue: Dayjs | null) => {
    setExpensDate(newValue);
  };

  const saveWorkerExpence = async () => {
    const sum = Number.parseFloat(sumExpens);
    if (sum <= 0) {
      enqueueSnackbar({
        message: "אנא הזן סכום",
        variant: "error",
      });
      return;
    }

    const t: IWorkExpensesType[] = workerExpensesTypes.filter((e) => {
      return e.workExpensType === parseInt(expensType, 10);
    });

    updateShowLoader(true);
    try {
      const data = await workerService.appendWorkerExpence(
        expensDate?.toDate(),
        expensDate?.toDate(),
        expensType,
        sum,
        t[0].defValue,
        freePass,
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

      setSumExpens("0");
      setRemarkExpens("");
      setFreePass(false);
    } catch (error) {
      console.error(error);
    }
    updateShowLoader(false);
    refreshlist();
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
              .filter((name) => name.workExpensCategoryId === 1)
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
            value={expensDate}
            onChange={handleChange}
          />
        </LocalizationProvider>
      </div>

      <div className="col-md-2 col-12">
        <TextField
          value={sumExpens}
          label="סכום"
          className="sumExpens"
          fullWidth
          type="number"
          onChange={(e) => setSumExpens(e.target.value)}
        />
      </div>

      <div className="col-md-1 col-12">
        <Tooltip title="חופשי חודשי">
          <IconButton
            onClick={() => {
              setFreePass(!freePass);
            }}
            style={{
              background: freePass ? "blue" : "",
              border: "1px solid rgba(0, 0, 0, 0.25)",
              boxShadow: "inset 0px 5px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
            }}
          >
            <AirlineSeatReclineExtraIcon
              style={{
                fontSize: 35,
                color: freePass ? "white" : "black",
                transform: "scaleX(-1)",
              }}
            />
          </IconButton>
          {/* <ToggleButton
            value="true"
            selected={freePass}
            onChange={() => {
              setFreePass(!freePass);
            }}
          >
            חופשי חודשי
          </ToggleButton> */}
        </Tooltip>
      </div>
      <div className="col-md-4 col-12">
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
