import { utils, writeFileXLSX } from "@sheet/core";
import { IshiftDetail, IshiftWeekReportExcel } from "../../Model";

export type ReportObj = {
  workerName: string;
  dayName: string;
  startDate: Date;
  shiftName: string;
  remark: string;
};

function getDayName(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("he-il", { weekday: "long" });
}

export class ExcelShiftPlans {
  static exportFile(shiftPlans: IshiftDetail[]) {
    // console.log(wsData5);
    const wsData = shiftPlans.map((shift: IshiftDetail) => {
      const reportObj: ReportObj = {
        workerName: shift.workerName,
        dayName: getDayName(shift.startDateEN),
        startDate: new Date(shift.startDateEN),
        shiftName: shift.shiftName,
        remark: shift.remark,
      };

      return reportObj;
    });

    // console.log(wsData);
    const ws = utils.json_to_sheet(wsData);

    // console.log(ws);
    const wb = utils.book_new();

    utils.sheet_add_aoa(ws, [["עובד", "יום", "תאריך", "משמרת", "הערות"]], {
      origin: "A1",
    });
    utils.book_append_sheet(wb, ws, "זמינות עבודה");

    utils.sheet_set_range_style(ws, ws["!ref"]!, {
      alignment: { horizontal: "center" },
      incol: { style: "thin", color: { rgb: "000000" } },
      inrow: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
    });

    return writeFileXLSX(wb, "זמינות עבודה.xlsx");
  }

  static exportWeekFile(shiftPlans: IshiftWeekReportExcel[]) {
    const ws = utils.json_to_sheet(shiftPlans);

    // console.log(ws);
    const wb = utils.book_new();

    utils.sheet_add_aoa(
      ws,
      [
        [
          "workerName",
          "sunday",
          "monday",
          "tuesday",
          "wendsday",
          "thursday",
          "friday",
          "saturday",
        ],
      ],
      {
        origin: "A1",
      }
    );
    utils.book_append_sheet(wb, ws, "זמינות עבודה");

    utils.sheet_set_range_style(ws, ws["!ref"]!, {
      alignment: { horizontal: "center" },
      incol: { style: "thin", color: { rgb: "000000" } },
      inrow: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
    });

    return writeFileXLSX(wb, "זמינות עבודה.xlsx");
  }
}
