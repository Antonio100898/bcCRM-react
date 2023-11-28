import { utils, writeFileXLSX } from '@sheet/core';
import {
  IWorkExpensesType,
  IWorkExpensesTypeSum,
} from '../../Model/IWorkExpensesType';

export class ExcelC {
  static exportFile = (
    workerExpenses: IWorkExpensesType[],
    workerExpensesSum: IWorkExpensesTypeSum[]
  ) => {
    // console.log(workerExpenses);
    const wsData1 = workerExpenses
      .filter(
        (name: IWorkExpensesType) =>
          name.workExpensCategoryId === 1 || name.workExpensCategoryId === 4
      )
      .map((expense: IWorkExpensesType) => {
        return [
          expense.workerName,
          expense.workExpensName,
          expense.expenseValue,
          expense.remark,
          expense.startExpenseDate,
          expense.freePass ? 'כן' : 'לא',
        ];
      });

    const wsData2 = workerExpenses
      .filter(
        (name: IWorkExpensesType) =>
          name.workExpensCategoryId === 2 ||
          name.workExpensCategoryId === 6 ||
          name.workExpensCategoryId === 7
      )
      .map((expense: IWorkExpensesType) => {
        return [
          expense.workerName,
          expense.workExpensName,
          expense.expenseValue,
          expense.expenseTypeUnitValue,
          expense.remark,
          expense.startExpenseDate,
          expense.finishExpenseDate,
        ];
      });

    const wsData3 = workerExpenses
      .filter((name: IWorkExpensesType) => name.workExpensCategoryId === 3)
      .map((expense: IWorkExpensesType) => {
        return [
          expense.workerName,
          expense.workExpensName,
          expense.remark,
          expense.expenseValue,
          expense.expenseTypeUnitValue,
          expense.startExpenseDate,
          expense.finishExpenseDate,
        ];
      });

    const wsData5 = workerExpenses
      .filter((name: IWorkExpensesType) => name.workExpensCategoryId === 5)
      .map((expense: IWorkExpensesType) => {
        return [
          expense.workerName,
          expense.workExpensName,
          expense.expenseValue,
          expense.remark,
          expense.startExpenseDate,
        ];
      });

    // console.log(wsData5);
    const ws = utils.json_to_sheet(wsData1);
    const ws2 = utils.json_to_sheet(wsData2);
    const ws3 = utils.json_to_sheet(wsData3);
    const ws5 = utils.json_to_sheet(wsData5);

    // console.log(workerExpensesSum);
    const ws0 = utils.json_to_sheet(workerExpensesSum);

    const wb = utils.book_new();

    utils.sheet_add_aoa(
      ws0,
      [
        [
          'קוד עובד',
          'שם עובד',
          'סהכ',
          'הוצאות עבודה',
          'בונוסים',
          'הדרכות',
          'אחוז מענה',
          'תעודת זהות',
          'קוד עובד מרסל',
        ],
      ],
      { origin: 'A1' }
    );
    utils.book_append_sheet(wb, ws0, 'סיכום');

    utils.sheet_add_aoa(
      ws,
      [['שם עובד', 'הוצאה', 'סכום', 'הערה', 'מתאריך', 'חופשי חודשי']],
      { origin: 'A1' }
    );
    utils.book_append_sheet(wb, ws, 'הוצאות');

    utils.sheet_add_aoa(
      ws2,
      [
        [
          'שם עובד',
          'הוצאה',
          'סכום',
          'סכום מוגדר להוצאה',
          'הערה',
          'מתאריך',
          'עד תאריך',
        ],
      ],
      { origin: 'A1' }
    );
    utils.book_append_sheet(wb, ws2, 'בונוסים');

    utils.sheet_add_aoa(
      ws3,
      [
        [
          'שם עובד',
          'הוצאה',
          'מקום',
          'סכום',
          'סכום מוגדר להוצאה',
          'מתאריך',
          'עד תאריך',
        ],
      ],
      { origin: 'A1' }
    );
    utils.book_append_sheet(wb, ws3, 'הדרכות');

    utils.sheet_add_aoa(ws5, [['שם עובד', 'הוצאה', 'סכום', 'הערה', 'מתאריך']], {
      origin: 'A1',
    });
    utils.book_append_sheet(wb, ws5, 'אחוז מענה');

    utils.sheet_set_range_style(ws0, ws0['!ref']!, {
      alignment: { horizontal: 'center' },
      incol: { style: 'thin', color: { rgb: '000000' } },
      inrow: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
    });

    utils.sheet_set_range_style(ws, ws['!ref']!, {
      alignment: { horizontal: 'center' },
      incol: { style: 'thin', color: { rgb: '000000' } },
      inrow: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
    });

    return writeFileXLSX(wb, 'הוצאות עבודה.xlsx');
  };
}
