import "./WorkerExpenses.styles.css";
import {
  MenuItem,
  Select,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import { useEffect, useState, useCallback } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import { useSnackbar } from "notistack";
import { api } from "../../API/Api";
import { TOKEN_KEY } from "../../Consts/Consts";
import WorkersHeader from "../../components/Workers/WorkersHeader";
import { IWorkExpensesType } from "../../Model/IWorkExpensesType";
import AddWorkerExpenseToolBar from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseToolBar";
import AddWorkerExpenseBonusesToolBar from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseBonusesToolBar";
import AddWorkerExpenseGuideToolBar from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseGuideToolBar";
import AddWorkerExpenseToolBarKilomoter from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseToolBarKilomoter";
import AddWorkerExpenseToolBarReplayPrecentge from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseToolBarReplayPrecentge";
import { useUser } from "../../Context/useUser";
import { useConfirm } from "../../Context/useConfirm";

export default function WorkerExpenses() {
  const { confirm } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );

  const { updateShowLoader, user } = useUser();
  const [totalSum, setTotalSum] = useState(0);

  const [workerExpenses, setWorkerExpenses] = useState<IWorkExpensesType[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("1");

  const getWorkerExpenses = useCallback(() => {
    api
      .post("/GetWorkerExpenses", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        filterWorkerId: 0,
        year: filterYear,
        month: filterMonth,
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

        setWorkerExpenses(data.d.workerExpenses);
        setTotalSum(data.d.workExpensesSum);

        updateShowLoader(false);
      });
  }, [enqueueSnackbar, filterMonth, filterYear, updateShowLoader]);

  useEffect(() => {
    getWorkerExpenses();
  }, [filterYear, filterMonth, getWorkerExpenses]);

  const workerExpensTypeCategoryChanged = (
    event: React.MouseEvent<HTMLElement>,
    newCategoryId: string
  ) => {
    if (newCategoryId === null) {
      return;
    }

    setSelectedCategoryId(newCategoryId);
  };

  const deleteExpense = useCallback(
    async (expenseId: string) => {
      // const proceed = prompt("אנא כתוב yes במידה וברצונך למחוק");

      // if (proceed === "yes") {
      if (await confirm("האם אתה בטוח שברצונך למחוק?")) {
        api
          .post("/CancelWorkerExpenses", {
            workerKey: localStorage.getItem(TOKEN_KEY),
            expenseId,
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

            getWorkerExpenses();
            updateShowLoader(false);
          });
      }
    },
    [confirm, enqueueSnackbar, getWorkerExpenses, updateShowLoader]
  );

  const refreshlist = useCallback(() => {
    getWorkerExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterYear]);

  // function updateFilterMonth(m: any) {
  //   setFilterMonth(m);
  // }

  return (
    <div className="row" style={{ margin: 10 }}>
      <WorkersHeader />

      {/* <h2 className="col-12">החזרים</h2> */}
      <div id="addWorExpense" className="row">
        <div className="col-9 right">
          <ToggleButtonGroup
            color="primary"
            value={selectedCategoryId}
            exclusive
            aria-label="הוצאות עבודה"
            onChange={workerExpensTypeCategoryChanged}
          >
            <ToggleButton value="1">הוצאות עבודה</ToggleButton>

            {(user?.userType === 1 || user?.department === 9) && (
              <ToggleButton value="2">בונוסים</ToggleButton>
            )}

            {(user?.userType === 1 || user?.department === 4) && (
              <ToggleButton value="3">הדרכות</ToggleButton>
            )}

            {(user?.userType === 1 ||
              [16, 4].includes(user?.department || 0)) && (
              <ToggleButton value="4">קילומטר</ToggleButton>
            )}

            {(user?.userType === 1 || user?.department === 9) && (
              <ToggleButton value="5">אחוז מענה</ToggleButton>
            )}

            {user && (user.department === 16 || user.userType === 1) && (
              <ToggleButton value="6">בונוסים ענן</ToggleButton>
            )}
            {user && (user.department === 2 || user.userType === 1) && (
              <ToggleButton value="7">בונוסים טכנאים</ToggleButton>
            )}
          </ToggleButtonGroup>
        </div>
        <div className="col-3 left">
          <Select
            variant="outlined"
            value={filterMonth}
            className="cboDateMonth"
            onChange={(e) => setFilterMonth(e.target.value)}
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
          <Select
            variant="outlined"
            value={filterYear}
            className="cboDateMonth"
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <MenuItem value="2022">2022</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2026">2026</MenuItem>
          </Select>
        </div>
      </div>

      {selectedCategoryId === "1" && (
        <AddWorkerExpenseToolBar
          refreshlist={refreshlist}
          setFilterMonth={setFilterMonth}
        />
      )}
      {selectedCategoryId === "2" && (
        <AddWorkerExpenseBonusesToolBar
          workExpensCategoryId={2}
          refreshlist={refreshlist}
          setFilterMonth={setFilterMonth}
        />
      )}
      {selectedCategoryId === "3" && (
        <AddWorkerExpenseGuideToolBar
          refreshlist={refreshlist}
          setFilterMonth={setFilterMonth}
        />
      )}
      {selectedCategoryId === "4" && (
        <AddWorkerExpenseToolBarKilomoter
          refreshlist={refreshlist}
          setFilterMonth={setFilterMonth}
        />
      )}
      {selectedCategoryId === "5" && (
        <AddWorkerExpenseToolBarReplayPrecentge
          refreshlist={refreshlist}
          setFilterMonth={setFilterMonth}
          setFilterYear={setFilterYear}
        />
      )}
      {selectedCategoryId === "6" && (
        <AddWorkerExpenseBonusesToolBar
          workExpensCategoryId={6}
          refreshlist={refreshlist}
          setFilterMonth={setFilterMonth}
        />
      )}
      {selectedCategoryId === "7" && (
        <AddWorkerExpenseBonusesToolBar
          workExpensCategoryId={7}
          refreshlist={refreshlist}
          setFilterMonth={setFilterMonth}
        />
      )}

      <div id="tblWorkerExpenses" style={{ marginTop: 30 }}>
        <div id="lblsWorExpense" className="row">
          <div className="col-2 tableLblHeader right">
            <p>תאריך</p>
          </div>
          <div className="col-2 tableLblHeader right">
            <p>פירוט</p>
          </div>

          <div className="col-5 tableLblHeader right">
            <p>הערה</p>
          </div>
          <div className="col-2 tableLblHeader">
            <p>סכום</p>
          </div>
          <div className="col-2 tableLblHeader">
            <p />
          </div>
        </div>
        <div>
          {workerExpenses &&
            workerExpenses.map((expense: IWorkExpensesType) => {
              return (
                <div
                  key={expense.id}
                  className="row"
                  style={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}
                >
                  <div className="col-2 tableLblHeader right">
                    {expense.startExpenseDate.toString().split(" ")[0]}
                  </div>
                  <div className="col-2 tableLblHeader right">
                    {expense.workExpensName}
                    {expense.freePass ? (
                      <Tooltip title="חופשי חודשי">
                        <AirlineSeatReclineExtraIcon
                          style={{
                            transform: "scaleX(-1)",
                          }}
                        />
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="col-5 tableLblHeader right">
                    {expense.remark}
                  </div>
                  <div className="col-2 tableLblHeader">
                    {`₪${expense.expenseValue}`}
                  </div>
                  <div
                    className="col-1 tableLblHeader"
                    style={{
                      textAlign: "left",
                    }}
                  >
                    <IconButton
                      style={{
                        textAlign: "left",
                        background: "#FFFFFF",
                        border: "1px solid rgba(0, 0, 0, 0.25)",
                        boxShadow: "inset 0px 5px 10px rgba(0, 0, 0, 0.05)",
                        borderRadius: "40px",
                        marginLeft: "5px",
                      }}
                    >
                      <Tooltip
                        title="מחק"
                        onClick={() => {
                          deleteExpense(expense.id);
                        }}
                      >
                        <DeleteIcon style={{ fontSize: 25, color: "red" }} />
                      </Tooltip>
                    </IconButton>
                  </div>
                </div>
              );
            })}
        </div>
        <div>
          <div className="row">
            <div className="col-9 " />
            <div className="col-3">
              <div>
                <p
                  style={{
                    fontFamily: "Rubik",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "24px",
                    lineHeight: "33px",
                    textAlign: "right",
                  }}
                />
              </div>
              <div
                style={{
                  margin: "20",
                  boxSizing: "border-box",
                  width: "263.25px",
                  height: "46px",
                  background: "#FFFFFF",
                  border: "1px solid rgba(0, 0, 0, 0.25)",
                  boxShadow: "inset 0px 5px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontFamily: "Heebo",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "24px",
                    lineHeight: "35px",
                    textAlign: "center",
                    color: "rgba(0, 0, 0, 0.85)",
                  }}
                >
                  {`₪${totalSum}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
