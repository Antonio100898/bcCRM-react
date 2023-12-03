import {
  Autocomplete,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import { ExpenseAndShiftsWeek } from "../../components/ExpenseAndShiftsWeeks/expenseAndShiftsWeek";
import { ExcelShiftAndExpenses } from "../../components/Excel/ExcelShiftAndExpenses";
import { useUser } from "../../Context/useUser";
import { workerService } from "../../API/services";
import {
  IExpenseAndShift,
  IExpenseAndShiftDay,
  IExpenseAndShiftWeek,
} from "../../Model";

interface AutocompleteOption {
  label: string;
  id: number;
}

export default function WorkerExpenseAndShiftCalendar() {
  const { updateShowLoader, workers } = useUser();

  const [expenseAndShiftsWeeks, setExpenseAndShiftsWeeks] = useState<
    IExpenseAndShiftWeek[]
  >([]);
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [department, setDepartment] = useState("0");
  const [filterWorkerId, setFilterWorkerId] = useState(0);
  const [workersOption, setWorkersOption] = useState<AutocompleteOption[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [currentDay, setCurrentDay] = useState<IExpenseAndShiftDay>();

  const fetchExpensesAndShiftForMonth = async () => {
    updateShowLoader(true);
    try {
      const data = await workerService.getExpensesAndShiftForMonth(
        filterYear,
        filterMonth,
        department,
        filterWorkerId
      );
      if (data?.d.success)
        setExpenseAndShiftsWeeks(data.d.ExpenseAndShiftsWeeks);
    } catch (error) {
      console.error(error);
    }

    updateShowLoader(false);
  };

  useEffect(() => {
    const rows: AutocompleteOption[] = [];
    for (let i = 0; i < workers.length; i += 1) {
      rows.push({ label: workers[i].workerName, id: workers[i].Id });
    }
    rows.push({ label: "כולם", id: 0 });

    setWorkersOption(rows);

    fetchExpensesAndShiftForMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterYear, filterMonth, department, filterWorkerId]);

  const exportFile = () => {
    const a: IExpenseAndShift[] = expenseAndShiftsWeeks.reduce<
      IExpenseAndShift[]
    >((prev, week) => {
      return [
        ...prev,
        ...week.days.reduce<IExpenseAndShift[]>(
          (p, day) => [...p, ...day.workers],
          []
        ),
      ];
    }, []);
    return ExcelShiftAndExpenses.exportFile(a);
  };

  function GetMoneyFormat(d: number) {
    return `₪${d
      .toFixed(1)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      .replace(".0", "")}`;
  }

  const dayClicked = (day: IExpenseAndShiftDay) => {
    setCurrentDay(day);
    setShowDetails(true);
  };

  return (
    <div style={{ marginRight: 10, marginLeft: 10 }}>
      <h2>הוצאות עבודה ומשמרות</h2>

      <div className="row" style={{ marginTop: "15px" }}>
        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          <Select
            fullWidth
            variant="outlined"
            value={filterMonth}
            className="cboDateMonth"
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{ height: "56px" }}
          >
            <MenuItem value="1">01</MenuItem>
            <MenuItem value="2">02</MenuItem>
            <MenuItem value="3">03</MenuItem>
            <MenuItem value="4">04</MenuItem>
            <MenuItem value="5">05</MenuItem>
            <MenuItem value="6">06</MenuItem>
            <MenuItem value="7">07</MenuItem>
            <MenuItem value="8">08</MenuItem>
            <MenuItem value="9">09</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="11">11</MenuItem>
            <MenuItem value="12">12</MenuItem>
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
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2026">2026</MenuItem>
          </Select>
        </div>

        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          <Select
            className="department"
            label="מחלקה"
            variant="outlined"
            fullWidth
            value={department}
            style={{ height: "56px" }}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <MenuItem value="0">כולם</MenuItem>
            <MenuItem value="7">הנהלת חשבונות</MenuItem>
            <MenuItem value="2">טכני</MenuItem>
            <MenuItem value="1">כללי</MenuItem>
            <MenuItem value="16">ענן</MenuItem>
            <MenuItem value="8">שיווק</MenuItem>
            <MenuItem value="3">תוכנה</MenuItem>
            <MenuItem value="9">תמיכה</MenuItem>
            <MenuItem value="4">תפריטים</MenuItem>
          </Select>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          <Autocomplete
            fullWidth
            disablePortal
            id="combo-box-demo"
            options={workersOption}
            onChange={(_, newValue: AutocompleteOption | null) => {
              setFilterWorkerId(newValue?.id || 0);
            }}
            renderInput={(params) => (
              <TextField {...params} label="עובדים" value={filterWorkerId} />
            )}
          />
        </div>

        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          <Tooltip title="יצא לאקסל">
            <IconButton
              onClick={exportFile}
              style={{
                background: "#F3BE80",
                borderRadius: "12px",
                marginRight: "5px",
              }}
            >
              <ArticleIcon
                style={{ fontSize: 40, color: "rgba(255, 255, 255, 0.9)" }}
              />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: "row",
          marginTop: "15px",
          fontWeight: "bolder",
        }}
      >
        <div style={{ width: "230px" }}>ראשון</div>
        <div style={{ width: "230px" }}>שני</div>
        <div style={{ width: "230px" }}>שלישי</div>
        <div style={{ width: "230px" }}>רביעי</div>
        <div style={{ width: "230px" }}>חמישי</div>
        <div style={{ width: "230px" }}>שישי</div>
        <div style={{ width: "230px" }}>שבת</div>
      </div>

      <div style={{}}>
        {expenseAndShiftsWeeks &&
          expenseAndShiftsWeeks.map(
            (es: IExpenseAndShiftWeek, index: number) => {
              return (
                <div key={`${es.days.length}${index}`}>
                  <ExpenseAndShiftsWeek
                    key={Math.random()}
                    weekDays={es.days}
                    dayClicked={dayClicked}
                  />
                </div>
              );
            }
          )}
      </div>

      <div>
        <Dialog
          sx={{ textAlign: "right" }}
          fullWidth
          maxWidth="lg"
          open={showDetails}
          onClose={() => setShowDetails(false)}
        >
          <DialogContent>
            <div dir="rtl" style={{ fontFamily: "Rubik" }}>
              <div className="row" style={{ fontSize: "25px" }}>
                <div className="col-2">עובד</div>
                <div className="col-1">שעות</div>
                <div className="col-2">התחלה</div>
                <div className="col-2">סיום</div>
                <div className="col-1">סהכ הוצאות</div>
                <div className="col-1">הוצאות עבודה</div>
                <div className="col-1">בונוסים</div>
                <div className="col-2">פירוט</div>
              </div>
              <div className="row">
                {currentDay &&
                  currentDay.workers.map((worker: IExpenseAndShift) => {
                    return (
                      <div
                        className="row"
                        key={Math.random()}
                        style={{ border: "1px black" }}
                      >
                        <div className="col-2">{worker.workerName}</div>

                        <div className="col-1">
                          <div>
                            {worker.totalMinutes > 0 && (
                              <div>
                                {Math.floor(worker.totalMinutes / 60)
                                  .toString()
                                  .padStart(2, "0")}
                                :
                                {(worker.totalMinutes % 60)
                                  .toString()
                                  .padStart(2, "0")}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-2">
                          {worker.remark && worker.remark.split("-")[0]}
                        </div>
                        <div className="col-2">
                          {worker.remark && worker.remark.split("-")[1]}
                        </div>
                        <div className="col-1">
                          {GetMoneyFormat(worker.sumExpense)}
                        </div>
                        <div className="col-1">
                          {GetMoneyFormat(worker.category1Sum)}
                        </div>
                        <div className="col-1">
                          {GetMoneyFormat(worker.category2Sum)}
                        </div>
                        <div className="col-2">
                          <div>{worker.expensNames}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
