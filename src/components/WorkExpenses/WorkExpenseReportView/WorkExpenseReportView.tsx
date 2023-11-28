import './WorkExpenseReportView.styles.css';
import { useState, useEffect } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { Tooltip } from '@mui/material';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import CancelWorkerExpenseBtn from './CancelWorkerExpenseBtn';
import { IWorkExpensesType } from '../../../Model/IWorkExpensesType';
import WorkExpenseEdit from '../WorkExpensesEdit/WorkExpenseEdit';

export type Props = {
  headerName: string;
  worker_Expenses: IWorkExpensesType[];
  refreshlist: () => void;
  workExpensCategoryId: number;
};

export default function WorkExpenseReportView({
  headerName,
  worker_Expenses,
  refreshlist,
  workExpensCategoryId,
}: Props) {
  const [workerExpenses, setWorkerExpenses] = useState<IWorkExpensesType[]>([]);
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    const w = worker_Expenses.filter(
      (name: IWorkExpensesType) =>
        name.workExpensCategoryId === workExpensCategoryId
    );
    setWorkerExpenses(w);

    // console.log(w.length);
    let sum: number = 0;
    for (let i = 0; i < w.length; i += 1) {
      sum += w[i].expenseValue;
      // console.log(w[i].expenseValue);
    }
    // console.log("TotalSum: " + sum);

    setTotalSum(sum);
  }, [workExpensCategoryId, worker_Expenses]);

  return (
    <div
      className="row"
      style={{
        marginTop: '25px',
        boxSizing: 'border-box',
        border: '1px solid #000000',
      }}
    >
      <div>
        <div
          className="row"
          style={{
            boxSizing: 'border-box',
            background: 'rgba(0, 0, 0, 0.025)',
            border: '1px solid #000000',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p
            className="right col-9"
            style={{
              fontFamily: 'Rubik',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '28px',
              lineHeight: '38px',
              color: '#000000',
            }}
          >
            {headerName}
          </p>
          <div
            className="col-1"
            style={{
              background: '#FFFFFF',
              borderRight: '1px solid rgba(0, 0, 0, 0.5)',
            }}
          >
            <p className="sumLabel">סה&quot;כ</p>
          </div>

          <div
            className="col-2"
            style={{
              background: '#FFFFFF',
            }}
          >
            <p className="sumValueText">
              {`₪${totalSum
                .toFixed(1)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`}
            </p>
          </div>
        </div>
        <div className="row">
          <div id="tblWorkerExpenses">
            <div>
              {workerExpenses &&
                workerExpenses.map((expense: IWorkExpensesType) => {
                  return (
                    <div
                      key={expense.id}
                      className="row"
                      style={{
                        border: '1px dashed rgba(0, 0, 0, 0.25)',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      <div className="col-2 tableLblHeader right">
                        {expense.startExpenseDate.toString().split(' ')[0]}
                      </div>
                      <div className="col-3 tableLblHeader right">
                        {expense.workerName}
                      </div>
                      <div
                        className="col-2 tableLblHeader right"
                        style={{ display: 'flex', flex: 'row' }}
                      >
                        {expense.workExpensName}
                        {expense.freePass ? (
                          <Tooltip title="חופשי חודשי">
                            <AirlineSeatReclineExtraIcon
                              style={{
                                transform: 'scaleX(-1)',
                              }}
                            />
                          </Tooltip>
                        ) : (
                          ''
                        )}
                      </div>

                      <div className="col-3 tableLblHeader right">
                        {expense.remark}
                      </div>
                      <div className="col-1 tableLblHeader">
                        {`₪${expense.expenseValue}`}
                      </div>
                      <div className="col-1 tableLblHeader">
                        <div className="row">
                          <div className="col-2">
                            {expense.approved && (
                              <Tooltip title="הוצאה מאושרת">
                                <DoneIcon style={{ color: 'green' }} />
                              </Tooltip>
                            )}
                          </div>
                          <div className="col-4">
                            <WorkExpenseEdit
                              workerExpenses={expense}
                              refreshlist={refreshlist}
                            />
                          </div>
                          <div className="col-4">
                            <CancelWorkerExpenseBtn
                              workerExpenceId={expense.id}
                              refreshlist={refreshlist}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}
