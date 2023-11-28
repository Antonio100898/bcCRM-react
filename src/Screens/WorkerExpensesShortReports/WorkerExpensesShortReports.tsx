import './WorkerExpensesShortReports.styles.css';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { api } from '../../API/Api';
import { TOKEN_KEY } from '../../Consts/Consts';
import { ExcelC } from '../../components/Excel/ExcelC';
import WorkExpenseReportFilters from '../../components/WorkExpenses/WorkExpenseReportView/WorkExpenseReportFilters';
import WorkExpenseReportView from '../../components/WorkExpenses/WorkExpenseReportView/WorkExpenseReportView';
import {
  IWorkExpensesType,
  IWorkExpensesTypeSum,
} from '../../Model/IWorkExpensesType';
import WorkersExpensesSum from '../../components/WorkerExpensesShortReports/WorkersExpensesSum';
import { useUser } from '../../Context/useUser';

interface AutocompleteOption {
  label: string;
  id: number;
}

export default function WorkerExpensesShortReports() {
  const months = [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר',
  ];

  const { enqueueSnackbar } = useSnackbar();

  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterMonth, setFilterMonth] = useState<string>(
    months[new Date().getMonth()]
  );
  const [filterWorkerId, setFilterWorkerId] = useState('0');
  const [sortBy, setSortBy] = useState('startExpenseDate');

  const { updateShowLoader, workers } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    rows.push({ label: 'כולם', id: 0 });

    setFilterMonth(months[new Date().getMonth()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetWorkersExpense = useCallback(() => {
    api
      .post('/GetWorkersExpenses', {
        workerKey: localStorage.getItem(TOKEN_KEY),
        year: filterYear,
        months: filterMonth,
        filterWorkerId,
      })
      .then(({ data }) => {
        if (!data.d) {
          updateShowLoader(false);
          enqueueSnackbar({
            message: 'אין משתמש כזה',
            variant: 'error',
          });
          return;
        }

        if (!data.d.success) {
          updateShowLoader(false);
          enqueueSnackbar({
            message: data.d.msg,
            variant: 'error',
          });
          return;
        }

        // let aaaa: IWorkExpensesTypeSum[] = data.d.workerExpensesSum;
        // console.log(data.d.workerExpensesSum);
        setWorkersExpensesSum(data.d.workerExpensesSum);
        const list: IWorkExpensesType[] = data.d.workerExpenses;
        if (list.length > 0) {
          if (sortBy === 'startExpenseDate') {
            list.sort((a: IWorkExpensesType, b: IWorkExpensesType) => {
              return (
                new Date(a.startExpenseDate).getTime() -
                new Date(b.startExpenseDate).getTime()
              );
            });
          }

          if (sortBy === 'workExpensName') {
            list.sort((a: IWorkExpensesType, b: IWorkExpensesType) => {
              return a.workExpensName < b.workExpensName ? -1 : 1;
            });
          }

          if (sortBy === 'workerName') {
            list.sort((a: IWorkExpensesType, b: IWorkExpensesType) => {
              return a.workerName > b.workerName ? -1 : 1;
            });
          }

          if (sortBy === 'expenseValue') {
            list.sort((a: IWorkExpensesType, b: IWorkExpensesType) => {
              return a.expenseValue < b.expenseValue ? -1 : 1;
            });
          }
        }
        setWorkerExpenses(list);
        // setWorkerExpenses(data.d.workerExpenses);

        updateShowLoader(false);
      });
  }, [
    enqueueSnackbar,
    filterMonth,
    filterWorkerId,
    filterYear,
    sortBy,
    updateShowLoader,
  ]);

  useEffect(() => {
    GetWorkersExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterYear, filterWorkerId, sortBy]);

  const exportFile = useCallback(() => {
    return ExcelC.exportFile(workerExpenses, workersExpensesSum);
  }, [workerExpenses, workersExpensesSum]);

  const updateWorkesExpensesApprove = useCallback(() => {
    api
      .post('/UpdateWorkesExpensesApprove', {
        workerKey: localStorage.getItem(TOKEN_KEY),
        workerExpenses,
      })
      .then(({ data }) => {
        if (!data.d) {
          updateShowLoader(false);
          enqueueSnackbar({
            message: 'אין משתמש כזה',
            variant: 'error',
          });
          return;
        }

        if (!data.d.success) {
          updateShowLoader(false);
          enqueueSnackbar({
            message: data.d.msg,
            variant: 'error',
          });
          return;
        }

        GetWorkersExpense();
      });
  }, [GetWorkersExpense, enqueueSnackbar, updateShowLoader, workerExpenses]);

  const updateWorkerChange = useCallback((wId: string) => {
    setFilterWorkerId(wId);
  }, []);

  return (
    <div className="row" style={{ margin: 10 }}>
      <h2 className="col-12">דוחות מקוצר</h2>

      <div className="col-12">
        <WorkExpenseReportFilters
          exportFile={exportFile}
          updateWorkesExpensesApprove={updateWorkesExpensesApprove}
          updateYear={setFilterYear}
          updateMonth={setFilterMonth}
          updateWorker={setFilterWorkerId}
          updateSortBy={setSortBy}
        />
      </div>
      <div className="col-2" style={{ paddingTop: '25px' }}>
        <WorkersExpensesSum
          worker_ExpensesSum={workersExpensesSum}
          workerSelected={updateWorkerChange}
        />
      </div>
      <div className="col-10" style={{ maxHeight: '700px', overflow: 'auto' }}>
        {workerExpenses && (
          <WorkExpenseReportView
            headerName="הוצאות עבודה"
            worker_Expenses={workerExpenses}
            refreshlist={GetWorkersExpense}
            workExpensCategoryId={1}
          />
        )}
        {workerExpenses && (
          <WorkExpenseReportView
            headerName="בונוסים"
            worker_Expenses={workerExpenses}
            refreshlist={GetWorkersExpense}
            workExpensCategoryId={2}
          />
        )}
        {workerExpenses && (
          <WorkExpenseReportView
            headerName="הדרכות"
            worker_Expenses={workerExpenses}
            refreshlist={GetWorkersExpense}
            workExpensCategoryId={3}
          />
        )}
        {workerExpenses && (
          <WorkExpenseReportView
            headerName="קילומטר"
            worker_Expenses={workerExpenses}
            refreshlist={GetWorkersExpense}
            workExpensCategoryId={4}
          />
        )}
        {workerExpenses && (
          <WorkExpenseReportView
            headerName="אחוז מענה"
            worker_Expenses={workerExpenses}
            refreshlist={GetWorkersExpense}
            workExpensCategoryId={5}
          />
        )}
        {workerExpenses && (
          <WorkExpenseReportView
            headerName="בונוסים (ענן)"
            worker_Expenses={workerExpenses}
            refreshlist={GetWorkersExpense}
            workExpensCategoryId={6}
          />
        )}
        {workerExpenses && (
          <WorkExpenseReportView
            headerName="בונוסים טכנאים"
            worker_Expenses={workerExpenses}
            refreshlist={GetWorkersExpense}
            workExpensCategoryId={7}
          />
        )}
      </div>
    </div>
  );
}
