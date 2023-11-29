import { useState, useEffect } from "react";
import { Box, Tooltip } from "@mui/material";
import { IExpenseAndShift, IExpenseAndShiftDay } from "../../Model";
import "./ExpenseAndShiftsDay.styles.css";

export type Props = {
  theDay: IExpenseAndShiftDay;
  dayClicked: (worker: IExpenseAndShiftDay) => void;
};

export function ExpenseAndShiftsDay({ theDay, dayClicked }: Props) {
  const [day] = useState<IExpenseAndShiftDay>(theDay);
  const [, setTotalSum] = useState(0);

  useEffect(() => {
    let sum = 0;
    theDay.workers.forEach((worker: IExpenseAndShift) => {
      sum += worker.sumExpense;
    });

    // const sum = theDay.workers.reduce(
    //   (sum, current) => sum + current.sumExpense,
    //   0
    // );
    setTotalSum(sum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theDay]);

  function GetMoneyFormat(d: number) {
    return `₪${d
      .toFixed(1)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      .replace(".0", "")}`;
  }

  return (
    <div>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: "230px",
          maxHeight: "150px",
          overflowY: "auto",
          borderTop: "1px dashed black",
        }}
        onClick={() => dayClicked(day)}
      >
        {day &&
          day.workers.map((worker: IExpenseAndShift) => {
            return (
              <div
                key={worker.workerId}
                className="row"
                style={{
                  display: "flex",
                  flex: "row",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="col-6"
                  style={{
                    textAlign: "right",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    paddingRight: "3px",
                  }}
                >
                  {worker.workerName}
                </div>
                <Tooltip title={worker.remark} style={{ fontSize: "20px" }}>
                  <div
                    className="col-3"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {worker.totalMinutes > 0 && (
                      <div>
                        {Math.floor(worker.totalMinutes / 60)
                          .toString()
                          .padStart(2, "0")}
                        :
                        {(worker.totalMinutes % 60).toString().padStart(2, "0")}
                      </div>
                    )}
                  </div>
                </Tooltip>
                <div
                  className="col-3"
                  style={{ textAlign: "left", paddingLeft: "4px" }}
                >
                  <Tooltip title={worker.expensNames}>
                    <div> {GetMoneyFormat(worker.sumExpense)}</div>
                  </Tooltip>
                </div>
              </div>
            );
          })}
      </Box>
    </div>
  );
}

export default ExpenseAndShiftsDay;
