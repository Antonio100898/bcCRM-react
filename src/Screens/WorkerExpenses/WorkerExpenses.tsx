import { Typography, IconButton, Tooltip, Box } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import { useSnackbar } from "notistack";
import { IWorkExpensesType } from "../../Model";
import AddWorkerExpenseToolBar from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseToolBar";
import AddWorkerExpenseBonusesToolBar from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseBonusesToolBar";
import AddWorkerExpenseGuideToolBar from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseGuideToolBar";
import AddWorkerExpenseToolBarKilomoter from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseToolBarKilomoter";
import AddWorkerExpenseToolBarReplayPrecentge from "../../components/WorkExpenses/AddToolBars/AddWorkerExpenseToolBarReplayPrecentge";
import { useUser } from "../../Context/useUser";
import { useConfirm } from "../../Context/useConfirm";
import { workerService } from "../../API/services";
import DateSelect from "../../components/DateSelect/DateSelect";

export default function WorkerExpenses() {
  const { confirm } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );

  const handleMonthChange = (move: "next" | "prev") => {
    if (move === "next") {
      Number(filterMonth) < 12 &&
        setFilterMonth((prev) => (Number(prev) + 1).toString());
    } else {
      Number(filterMonth) > 1 &&
        setFilterMonth((prev) => (Number(prev) - 1).toString());
    }
  };
  const getMonthNameByNumber = (num: number) => {
    switch (num) {
      case 1:
        return "ינואר";
      case 2:
        return "פברואר";
      case 3:
        return "מרץ";
      case 4:
        return "אפריל";
      case 5:
        return "מאי";
      case 6:
        return "יוני";
      case 7:
        return "יולי";
      case 8:
        return "אוגוסט";
      case 9:
        return "ספטמבר";
      case 10:
        return "אוקטובר";
      case 11:
        return "נובמבר";
      case 12:
        return "דצמבר";
      default:
        return "ינואר";
    }
  };

  const { updateShowLoader, user, isAdmin } = useUser();
  const [totalSum, setTotalSum] = useState(0);

  const [workerExpenses, setWorkerExpenses] = useState<IWorkExpensesType[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("1");

  const getWorkerExpenses = async () => {
    if (!user) return;
    try {
      const data = await workerService.getWorkersExpenses(
        filterYear,
        filterMonth,
        user?.workerId.toString()
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
      setWorkerExpenses(data.d.workerExpenses);
      setTotalSum(data.d.workExpensesSum);
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
    }
    updateShowLoader(false);
  };

  useEffect(() => {
    getWorkerExpenses();
  }, [filterYear, filterMonth]);

  const workerExpensTypeCategoryChanged = (
    _event: React.MouseEvent<HTMLElement>,
    newCategoryId: string
  ) => {
    if (newCategoryId === null) {
      return;
    }

    setSelectedCategoryId(newCategoryId);
  };

  const deleteExpense = async (expenseId: string) => {
    if (await confirm("האם אתה בטוח שברצונך למחוק?")) {
      try {
        const data = await workerService.cancelWorkerExpenses(expenseId);
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

        getWorkerExpenses();
      } catch (error) {
        if (error instanceof Error)
          enqueueSnackbar({
            message: error.message,
            variant: "error",
          });
      }
      updateShowLoader(false);
    }
  };

  const refreshlist = useCallback(() => {
    getWorkerExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterYear]);

  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="subtitle1">הוצאות</Typography>
      <DateSelect
        displayValue={getMonthNameByNumber(Number(filterMonth))}
        onNext={() => handleMonthChange("next")}
        onPrev={() => handleMonthChange("prev")}
      />
      {/* <ToggleButtonGroup
            color="primary"
            value={selectedCategoryId}
            exclusive
            aria-label="הוצאות עבודה"
            onChange={workerExpensTypeCategoryChanged}
          >
            <ToggleButton value="1">הוצאות עבודה</ToggleButton>

            {(isAdmin || user?.department === 9) && (
              <ToggleButton value="2">בונוסים</ToggleButton>
            )}

            {(isAdmin || user?.department === 4) && (
              <ToggleButton value="3">הדרכות</ToggleButton>
            )}

            {(isAdmin || [16, 4].includes(user?.department || 0)) && (
              <ToggleButton value="4">קילומטר</ToggleButton>
            )}

            {(isAdmin || user?.department === 9) && (
              <ToggleButton value="5">אחוז מענה</ToggleButton>
            )}

            {user && (user.department === 16 || isAdmin) && (
              <ToggleButton value="6">בונוסים ענן</ToggleButton>
            )}
            {user && (user.department === 2 || isAdmin) && (
              <ToggleButton value="7">בונוסים טכנאים</ToggleButton>
            )}
          </ToggleButtonGroup> */}

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
    </Box>
  );
}
