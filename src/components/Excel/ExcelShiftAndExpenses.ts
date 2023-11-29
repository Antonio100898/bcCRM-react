import { utils, writeFileXLSX } from "@sheet/core";
import { IExpenseAndShift } from "../../Model";

export class ExcelShiftAndExpenses {
  static exportFile = (workerExpenses: IExpenseAndShift[]) => {
    // console.log(workerExpenses);
    const wsData1 = workerExpenses.map((expense: IExpenseAndShift) => {
      return [
        expense.workerName,
        expense.dDayEN.replace("00:00", ""),
        expense.sumExpense,
        expense.expensNames,
        `${Math.floor(expense.totalMinutes / 60)
          .toString()
          .padStart(2, "0")}:${(expense.totalMinutes % 60)
          .toString()
          .padStart(2, "0")}`,
        expense.remark,
      ];
    });

    // console.log(wsData5);
    const ws = utils.json_to_sheet(wsData1);

    const wb = utils.book_new();
    utils.sheet_add_aoa(
      ws,
      [["שם עובד", "תאריך", "הוצאות", "פירוט הוצאות", "שעות", "פירוט שעות"]],
      { origin: "A1" }
    );
    utils.book_append_sheet(wb, ws, "הוצאות ומשמרות");

    utils.sheet_set_range_style(ws, ws["!ref"]!, {
      alignment: { horizontal: "center" },
      incol: { style: "thin", color: { rgb: "000000" } },
      inrow: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
    });

    return writeFileXLSX(wb, "הוצאות עבודה ומשמרות.xlsx");
  };
}
