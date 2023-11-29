import { useEffect, useState } from "react";

import { IshiftWeek } from "../../Model";
import ShiftPlan from "./ShiftPlan";

export type Props = {
  shiftsList: IshiftWeek[] | null;
  title: string;
  startOfWeek: Date;
  shiftTypeId: number;
  refreshList: () => void;
};

export function ShiftPlansWeek({
  shiftsList,
  title,
  shiftTypeId,
  startOfWeek,
  refreshList,
}: Props) {
  const [week, setWeeks] = useState<IshiftWeek[]>([]);
  useEffect(() => {
    // console.log(shiftsList);
    const wsData1: IshiftWeek[] | null =
      shiftsList &&
      shiftsList.filter((name: IshiftWeek) => {
        return name.shiftType === shiftTypeId;
      });

    // console.log("start Shift Type. Count: " + wsData1?.length);

    if (wsData1) setWeeks(wsData1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftsList]);

  function addDays(theDate: Date, days: number) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  return (
    <div
      style={{
        borderLeft: "0px",
        border: " 2px solid #FFE5C6",
        borderRadius: "8px 8px 0px 0px",
        marginBottom: "5px",
      }}
    >
      {title && title.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "Rubik",
              fontStyle: "normal",
              fontWeight: "700",
              fontSize: "25px",
              lineHeight: "35px",
              textAlign: "center",
              background: "#FFE5C6",
              border: "1px solid #FFE5C6",
            }}
          >
            {title}
          </p>
          <div style={{ display: "flex", flex: "row" }}>
            <div style={{ width: "14.2%", minWidth: "140px" }}>
              {week &&
                week.length > 0 &&
                week[0].sunday.map((shift) => {
                  return (
                    <ShiftPlan
                      key={shift.id}
                      shift={shift}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 0)}
                      refreshList={refreshList}
                    />
                  );
                })}
            </div>
            <div style={{ width: "14.2%", minWidth: "140px" }}>
              {week &&
                week.length > 0 &&
                week[0].monday.map((shift) => {
                  return (
                    <ShiftPlan
                      key={shift.id}
                      shift={shift}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 1)}
                      refreshList={refreshList}
                    />
                  );
                })}
            </div>
            <div style={{ width: "14.2%", minWidth: "140px" }}>
              {week &&
                week.length > 0 &&
                week[0].tuesday.map((shift) => {
                  return (
                    <ShiftPlan
                      key={shift.id}
                      shift={shift}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 2)}
                      refreshList={refreshList}
                    />
                  );
                })}
            </div>
            <div style={{ width: "14.2%", minWidth: "140px" }}>
              {week &&
                week.length > 0 &&
                week[0].wendsday.map((shift) => {
                  return (
                    <ShiftPlan
                      key={shift.id}
                      shift={shift}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 3)}
                      refreshList={refreshList}
                    />
                  );
                })}
            </div>
            <div style={{ width: "14.2%", minWidth: "140px" }}>
              {week &&
                week.length > 0 &&
                week[0].thursday.map((shift) => {
                  return (
                    <ShiftPlan
                      key={shift.id}
                      shift={shift}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 4)}
                      refreshList={refreshList}
                    />
                  );
                })}
            </div>
            <div style={{ width: "14.2%", minWidth: "140px" }}>
              {week &&
                week.length > 0 &&
                week[0].friday.map((shift) => {
                  return (
                    <ShiftPlan
                      key={shift.id}
                      shift={shift}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 5)}
                      refreshList={refreshList}
                    />
                  );
                })}
            </div>
            <div style={{ width: "14.2%", minWidth: "140px" }}>
              {week &&
                week.length > 0 &&
                week[0].saturday.map((shift) => {
                  return (
                    <ShiftPlan
                      key={shift.id}
                      shift={shift}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 6)}
                      refreshList={refreshList}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShiftPlansWeek;
