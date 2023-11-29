import { IExpenseAndShiftDay } from "../../Model";
import { ExpenseAndShiftsDay } from "./ExpenseAndShiftsDay";
import { ExpenseDaySum } from "./ExpenseDaySum";

export type Props = {
  weekDays: IExpenseAndShiftDay[];
  dayClicked: (worker: IExpenseAndShiftDay) => void;
};

export function ExpenseAndShiftsWeek({ weekDays, dayClicked }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flex: "row",
        fontFamily: "Rubik",
      }}
    >
      {weekDays &&
        weekDays.map((day: IExpenseAndShiftDay) => {
          return (
            <div
              key={Math.random()}
              style={{
                height: "230px",
                width: "230px",
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignContent: "flex-start",
                position: "relative",
              }}
            >
              <div
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  paddingLeft: "10px",
                  fontSize: "20px",
                }}
              >
                {day.dayInMonth}
              </div>
              <div>
                <ExpenseAndShiftsDay
                  theDay={day}
                  dayClicked={() => dayClicked(day)}
                />
              </div>
              <ExpenseDaySum theDay={day} />
            </div>
          );
        })}
    </div>
  );
}

export default ExpenseAndShiftsWeek;
