import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { IWorkExpensesTypeSum } from '../../../Model/IWorkExpensesType';

export type IProps = {
  worker_ExpensesSum: IWorkExpensesTypeSum[];
  workerSelected: (wId: string) => void;
};

export default function WorkExpenseSumReportView({
  worker_ExpensesSum,
  workerSelected,
}: IProps) {
  const [workersExpensesSum, setWorkersExpensesSum] = useState<
    IWorkExpensesTypeSum[]
  >([]);

  useEffect(() => {
    setWorkersExpensesSum(worker_ExpensesSum);
  }, [worker_ExpensesSum]);

  function GetMoneyFormat(d: number) {
    return `₪${d
      .toFixed(1)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      .replace('.0', '')}`;
  }

  return (
    <div className="row" style={{ maxHeight: '600px', overflow: 'auto' }}>
      <div style={{ position: 'relative' }}>
        <div
          className="row"
          style={{
            position: 'sticky',
            top: '0',
            boxSizing: 'border-box',
            background: 'rgba(155,151,151 )',
            border: '1px solid #000000',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p className="sumLabel col-2">עובד</p>
          <p className="sumLabel col-2">הוצאות עבודה</p>
          <p className="sumLabel col-2">בונוסים</p>
          <p className="sumLabel col-2">אחוז מענה</p>
          <p className="sumLabel col-2">הדרכות</p>
          <p className="sumLabel col-2 bold">סה&quot;כ</p>
        </div>

        {workersExpensesSum &&
          workersExpensesSum.map((expense: IWorkExpensesTypeSum) => {
            return (
              <div
                key={expense.workerId}
                className="row"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                }}
              >
                <div
                  className="col-2 tableLblHeader"
                  style={{
                    fontWeight: expense.workerName === 'סהכ' ? 'bold' : '',
                  }}
                >
                  <Button
                    variant="text"
                    onClick={() => {
                      workerSelected(expense.workerId);
                    }}
                  >
                    {expense.workerName}
                  </Button>
                </div>
                <div
                  className="col-2 tableLblHeader"
                  style={{
                    fontWeight: expense.workerName === 'סהכ' ? 'bold' : '',
                  }}
                >
                  {GetMoneyFormat(expense.workExpense)}
                </div>
                <div
                  className="col-2 tableLblHeader"
                  style={{
                    fontWeight: expense.workerName === 'סהכ' ? 'bold' : '',
                  }}
                >
                  {GetMoneyFormat(expense.bonus)}
                </div>
                <div
                  className="col-2 tableLblHeader"
                  style={{
                    fontWeight: expense.workerName === 'סהכ' ? 'bold' : '',
                  }}
                >
                  {GetMoneyFormat(expense.answerPrecentge)}
                </div>
                <div
                  className="col-2 tableLblHeader"
                  style={{
                    fontWeight: expense.workerName === 'סהכ' ? 'bold' : '',
                  }}
                >
                  {GetMoneyFormat(expense.fieldTrip)}
                </div>
                <div
                  className="col-2 tableLblHeader"
                  style={{ fontWeight: 'bold' }}
                >
                  {GetMoneyFormat(expense.totalSum)}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
