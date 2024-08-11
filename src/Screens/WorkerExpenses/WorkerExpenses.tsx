import {
  Typography,
  Box,
  Stack,
  Fab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import { IWorkExpensesType } from "../../Model";
import { useUser } from "../../Context/useUser";
import { useConfirm } from "../../Context/useConfirm";
import { workerService } from "../../API/services";
import DateSelect from "../../components/DateSelect/DateSelect";
import dayjs from "dayjs";
import DataField from "../../components/DataField/DataField";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import WorkerExpenseDialog from "../../Dialogs/WorkerExpenseDialog/WorkerExpenseDialog";
import UpdateWorkerExpenseDialog from "../../Dialogs/WorkerExpenseDialog/UpdateWorkerExpenseDialog";

export default function WorkerExpenses() {
  const [openNewExpenceDialog, setOpenNewExpenceDialog] = useState(false);
  const [openUpdateExpenseDialog, setOpenUpdateExpenseDialog] = useState(false);
  const [currentExpense, setCurrentExpense] =
    useState<IWorkExpensesType | null>(null);
  const { updateShowLoader, user } = useUser();
  const [totalSum, setTotalSum] = useState(0);
  const [workerExpenses, setWorkerExpenses] = useState<IWorkExpensesType[]>([]);
  //@ts-ignore
  const [selectedCategoryId, setSelectedCategoryId] = useState("1");
  //@ts-ignore
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { confirm } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const onExpenseClick = (id: string) => {
    setCurrentExpense(workerExpenses.find((e) => e.id === id)!);
    setOpenUpdateExpenseDialog(true);
  };

  const onCloseUpdateDialog = () => {
    setOpenUpdateExpenseDialog(false);
    setCurrentExpense(null);
  };

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
  //@ts-ignore
  const workerExpensTypeCategoryChanged = (
    _event: React.MouseEvent<HTMLElement>,
    newCategoryId: string
  ) => {
    if (newCategoryId === null) {
      return;
    }

    setSelectedCategoryId(newCategoryId);
  };
  //@ts-ignore
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

  const refreshList = useCallback(() => {
    getWorkerExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterYear]);

  return (
    <>
      <Box sx={{ px: 2 }}>
        <Typography variant="subtitle1">הוצאות</Typography>
        <DateSelect
          displayValue={getMonthNameByNumber(Number(filterMonth))}
          onNext={() => handleMonthChange("next")}
          onPrev={() => handleMonthChange("prev")}
        />
        <Stack gap={2} mt={4}>
          {workerExpenses.length > 0 && (
            <Stack direction="row" justifyContent="space-between" px={1}>
              <Typography fontSize={20} fontWeight={600}>
                הוצאות
              </Typography>
              <Typography fontSize={20} fontWeight={600}>
                {totalSum} ₪
              </Typography>
            </Stack>
          )}
          <Stack gap={1}>
            {workerExpenses.map((expense) => (
              <DataField
                key={expense.id}
                onClick={() => onExpenseClick(expense.id)}
              >
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack direction="row" gap={8}>
                    <Typography fontWeight={600}>
                      {dayjs(expense.startExpenseDateEN).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography>{expense.workExpensName}</Typography>
                  </Stack>
                  <Typography>{expense.expenseValue} ₪</Typography>
                </Stack>
              </DataField>
            ))}
          </Stack>
        </Stack>
        <Fab
          onClick={() => setOpenNewExpenceDialog(true)}
          sx={{ position: "fixed", right: 20, bottom: 30 }}
          size="large"
          color="warning"
        >
          <SpeedDialIcon />
        </Fab>
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

        {/* {selectedCategoryId === "1" && (
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
      )} */}
      </Box>
      <WorkerExpenseDialog
        refreshList={refreshList}
        open={openNewExpenceDialog}
        onClose={() => setOpenNewExpenceDialog(false)}
        fullScreen={isMobile}
      />
      <UpdateWorkerExpenseDialog
        expense={currentExpense}
        onClose={onCloseUpdateDialog}
        open={openUpdateExpenseDialog}
      />
    </>
  );
}
