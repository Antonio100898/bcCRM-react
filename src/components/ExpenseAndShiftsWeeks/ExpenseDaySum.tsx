import React, { useState } from 'react';
import { IExpenseAndShiftDay } from '../../Model/IExpenseAndShiftWeek';

export type Props = {
  theDay: IExpenseAndShiftDay;
};

export function ExpenseDaySum({ theDay }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [day, setDay] = useState<IExpenseAndShiftDay>(theDay);

  function GetMoneyFormat(d: number) {
    return `₪${d
      .toFixed(1)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      .replace('.0', '')}`;
  }

  return (
    <div
      className="row"
      style={{
        background: 'aqua',
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px dashed black',
      }}
    >
      <div className="col-4">סהכ ({day.workers.length})</div>
      <div
        className="col-4"
        style={{
          textAlign: 'left',
        }}
      >
        {Math.floor(day.totalMinutes / 60)
          .toString()
          .padStart(2, '0')}
        :{(day.totalMinutes % 60).toString().padStart(2, '0')}
      </div>
      <div
        className="col-4"
        style={{
          textAlign: 'left',
          paddingLeft: '3px',
        }}
      >
        {GetMoneyFormat(day.totalSum)}
      </div>
    </div>
  );
}

export default ExpenseDaySum;
