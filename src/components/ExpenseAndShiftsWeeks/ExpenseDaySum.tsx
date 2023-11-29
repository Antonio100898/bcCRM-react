import { IExpenseAndShiftDay } from "../../Model";

export type Props = {
  theDay: IExpenseAndShiftDay;
};

export function ExpenseDaySum({ theDay }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  function GetMoneyFormat(d: number) {
    return `₪${d
      .toFixed(1)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      .replace(".0", "")}`;
  }

  return (
    <div
      className="row"
      style={{
        background: "aqua",
        fontWeight: "bold",
        position: "absolute",
        bottom: 0,
        width: "100%",
        borderTop: "1px dashed black",
      }}
    >
      <div className="col-4">סהכ ({theDay.workers.length})</div>
      <div
        className="col-4"
        style={{
          textAlign: "left",
        }}
      >
        {Math.floor(theDay.totalMinutes / 60)
          .toString()
          .padStart(2, "0")}
        :{(theDay.totalMinutes % 60).toString().padStart(2, "0")}
      </div>
      <div
        className="col-4"
        style={{
          textAlign: "left",
          paddingLeft: "3px",
        }}
      >
        {GetMoneyFormat(theDay.totalSum)}
      </div>
    </div>
  );
}

export default ExpenseDaySum;
