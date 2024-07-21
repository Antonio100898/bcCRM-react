import { utils, writeFileXLSX } from "@sheet/core";

export type PlaceProblemExcel = {
  startTime: string;
  workerCreateName: string;
  finishTime: string;
  updaterWorkerName: string;
  placeName: string;
  customerName: string;
  desc: string;
  solution: string;
  totalTime: string;
};

export class ExcelPlaceProblems {
  static exportFile(reportObjects: PlaceProblemExcel[]) {
    // console.log(wsData);
    const ws = utils.json_to_sheet(reportObjects);

    // console.log(ws);
    const wb = utils.book_new();

    utils.sheet_add_aoa(
      ws,
      [
        [
          "תאריך פתיחה",
          "יוצר",
          "תאריך סגירה",
          "מעדכן",
          "שם סניף",
          "שם לקוח",
          "תיאור",
          "פתרון",
          "תקופת טיפול",
        ],
      ],
      {
        origin: "A1",
      }
    );
    utils.book_append_sheet(wb, ws, "נתוני תקלות");

    utils.sheet_set_range_style(ws, ws["!ref"]!, {
      alignment: { horizontal: "center" },
      incol: { style: "thin", color: { rgb: "000000" } },
      inrow: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
    });

    return writeFileXLSX(wb, "נתוני תקלות.xlsx");
  }
}
