import "./WorkerExpensesReports.styles.css";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { IWorkExpensesType, IWorkExpensesTypeSum } from "../../Model";
import { ExcelC } from "../../components/Excel/ExcelC";
import WorkExpenseReportView from "../../components/WorkExpenses/WorkExpenseReportView/WorkExpenseReportView";
import WorkExpenseSumReportView from "../../components/WorkExpenses/WorkExpenseReportView/WorkExpenseSumReportView";
import WorkExpenseReportFilters from "../../components/WorkExpenses/WorkExpenseReportView/WorkExpenseReportFilters";
import { useUser } from "../../Context/useUser";
import { workerService } from "../../API/services";

interface AutocompleteOption {
  label: string;
  id: number;
}

export default function WorkerExpensesReports() {
  const { enqueueSnackbar } = useSnackbar();
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterMonth, setFilterMonth] = useState<string>(
    months[new Date().getMonth()]
  );
  const [filterWorkerId, setFilterWorkerId] = useState("0");
  const [sortBy, setSortBy] = useState("startExpenseDate");

  const { updateShowLoader, workers } = useUser();
  const [workerExpenses, setWorkerExpenses] = useState<IWorkExpensesType[]>([]);
  const [workersExpensesSum, setWorkersExpensesSum] = useState<
    IWorkExpensesTypeSum[]
  >([]);

  useEffect(() => {
    updateShowLoader(true);

    const rows: AutocompleteOption[] = [];
    for (let i = 0; i < workers.length; i += 1) {
      rows.push({ label: workers[i].workerName, id: workers[i].Id });
    }

    rows.push({ label: "כולם", id: 0 });

    setFilterMonth(months[new Date().getMonth()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWorkerExpenses = async () => {
    try {
      const data = await workerService.getWorkersExpenses(
        filterYear,
        filterMonth,
        filterWorkerId
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

      setWorkersExpensesSum(data.d.workerExpensesSum);
      const list: IWorkExpensesType[] = data.d.workerExpenses;
      if (list.length > 0) {
        if (sortBy === "startExpenseDate") {
          list.sort((a: IWorkExpensesType, b: IWorkExpensesType) => {
            return (
              new Date(a.startExpenseDate).getTime() -
              new Date(b.startExpenseDate).getTime()
            );
          });
        }

        if (sortBy === "workExpensName") {
          list.sort((a: IWorkExpensesType, b: IWorkExpensesType) => {
            return a.workExpensName < b.workExpensName ? -1 : 1;
          });
        }

        if (sortBy === "workerName") {
          list.sort((a: IWorkExpensesType, b: IWorkExpensesType) => {
            return a.workerName > b.workerName ? -1 : 1;
          });
        }

        if (sortBy === "expenseValue") {
          list.sort((a: IWorkExpensesType, b: IWorkExpensesType) => {
            return a.expenseValue < b.expenseValue ? -1 : 1;
          });
        }
      }
      setWorkerExpenses(list);
    } catch (error) {
      console.error(error);
    }

    updateShowLoader(false);
  };

  useEffect(() => {
    fetchWorkerExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterYear, filterWorkerId, sortBy]);

  const exportFile = () => {
    return ExcelC.exportFile(workerExpenses, workersExpensesSum);
  };

  const updateWorkesExpensesApprove = async () => {
    try {
      const data = await workerService.updateWorkesExpensesApprove(
        workerExpenses
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

      fetchWorkerExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const updateWorkerChange = (wId: string) => {
    setFilterWorkerId(wId);
  };

  return (
    <div className="row" style={{ margin: 10 }}>
      <h2 className="col-12">דוחות</h2>
      {/* <div className="row">
        <div
          className="col-xs-12 col-sm-12 col-md-3 col-lg-3 right"
          style={{ display: "flex" }}
        >
          <Autocomplete
            fullWidth
            disablePortal
            id="combo-box-demo"
            options={workersOption}
            onChange={(e: any, newValue: any | null) => {
              setFilterWorkerId(newValue.id);
            }}
            renderInput={(params) => (
              <TextField {...params} label="עובדים" value={filterWorkerId} />
            )}
          />
        </div>
        <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 right">
          <Select
            fullWidth
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            input={<OutlinedInput label="חודשים" />}
            style={{ height: "56px" }}
          >
            {months.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          <Select
            fullWidth
            variant="outlined"
            value={filterYear}
            className="cboDateMonth"
            onChange={(e) => setFilterYear(e.target.value)}
            style={{ height: "56px" }}
          >
            <MenuItem value={"2022"}>2022</MenuItem>
            <MenuItem value={"2023"}>2023</MenuItem>
            <MenuItem value={"2024"}>2024</MenuItem>
            <MenuItem value={"2025"}>2025</MenuItem>
            <MenuItem value={"2026"}>2026</MenuItem>
          </Select>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 right">
          <Tooltip title="סדר לפי" placement="left-start">
            <Select
              label="לסדר לפי"
              fullWidth
              variant="outlined"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ height: "56px" }}
            >
              <MenuItem value={"startExpenseDate"}>תאריך</MenuItem>
              <MenuItem value={"workerName"}>עובד</MenuItem>
              <MenuItem value={"workExpensName"}>הוצאה</MenuItem>
              <MenuItem value={"expenseValue"}>סכום</MenuItem>
            </Select>
          </Tooltip>
        </div>

        <div className="col-xs-2 col-sm-6 col-md-1 col-lg-1 left">
          <Tooltip title="יצא לאקסל">
            <IconButton
              onClick={exportFile}
              style={{
                background: "#F3BE80",
                borderRadius: "12px",
                margin: 5,
              }}
            >
              <ArticleIcon
                style={{ fontSize: 40, color: "rgba(255, 255, 255, 0.9)" }}
              />
            </IconButton>
          </Tooltip>
        </div>
        <div className="col-xs-2 col-sm-6 col-md-1 col-lg-1 left">
          <Tooltip title="אשר את כל ההוצאות">
            <IconButton
              onClick={updateWorkesExpensesApprove}
              style={{
                background: "#F3BE80",
                borderRadius: "12px",
                margin: 5,
              }}
            >
              <TaskAltIcon
                style={{
                  fontSize: 40,
                  color: "green",
                }}
              />
            </IconButton>
          </Tooltip>
        </div>
      </div> */}

      <WorkExpenseReportFilters
        exportFile={exportFile}
        updateWorkesExpensesApprove={updateWorkesExpensesApprove}
        updateYear={setFilterYear}
        updateMonth={setFilterMonth}
        updateWorker={setFilterWorkerId}
        updateSortBy={setSortBy}
      />

      <WorkExpenseSumReportView
        worker_ExpensesSum={workersExpensesSum}
        workerSelected={updateWorkerChange}
      />

      {workerExpenses && (
        <WorkExpenseReportView
          headerName="הוצאות עבודה"
          worker_Expenses={workerExpenses}
          refreshlist={fetchWorkerExpenses}
          workExpensCategoryId={1}
        />
      )}
      {workerExpenses && (
        <WorkExpenseReportView
          headerName="בונוסים"
          worker_Expenses={workerExpenses}
          refreshlist={fetchWorkerExpenses}
          workExpensCategoryId={2}
        />
      )}
      {workerExpenses && (
        <WorkExpenseReportView
          headerName="הדרכות"
          worker_Expenses={workerExpenses}
          refreshlist={fetchWorkerExpenses}
          workExpensCategoryId={3}
        />
      )}
      {workerExpenses && (
        <WorkExpenseReportView
          headerName="קילומטר"
          worker_Expenses={workerExpenses}
          refreshlist={fetchWorkerExpenses}
          workExpensCategoryId={4}
        />
      )}
      {workerExpenses && (
        <WorkExpenseReportView
          headerName="אחוז מענה"
          worker_Expenses={workerExpenses}
          refreshlist={fetchWorkerExpenses}
          workExpensCategoryId={5}
        />
      )}
      {workerExpenses && (
        <WorkExpenseReportView
          headerName="בונוסים (ענן)"
          worker_Expenses={workerExpenses}
          refreshlist={fetchWorkerExpenses}
          workExpensCategoryId={6}
        />
      )}
      {workerExpenses && (
        <WorkExpenseReportView
          headerName="בונוסים טכנאים"
          worker_Expenses={workerExpenses}
          refreshlist={fetchWorkerExpenses}
          workExpensCategoryId={7}
        />
      )}
    </div>
  );
}
