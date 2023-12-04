import { useEffect, useState } from "react";
import { InputLabel, Tooltip, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useConfirm } from "../../Context/useConfirm";
import { IDayInfo } from "../../Model";
import { shiftService } from "../../API/services";

export type Props = {
  weekDaysAll: IDayInfo[];
  shiftGroupId: number;
};

export default function DaysHeader({ weekDaysAll, shiftGroupId }: Props) {
  const { prompt } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const [weekDays, setweekDays] = useState<IDayInfo[]>();

  function GetDateTimeFormatEN(d: string) {
    const day = d.substring(0, 2);
    const m = d.substring(3, 5);
    const y = d.substring(6, 11);
    // console.log(day + "-" + m + "-" + y);
    return `${y}/${m}/${day}`;
  }

  useEffect(() => {
    setweekDays(weekDaysAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekDaysAll, shiftGroupId]);

  const updateDayRemark = async (day: IDayInfo) => {
    const newRemark = await prompt("הזן הערה", day.remark || "");
    if (newRemark === null || newRemark === "") {
      return;
    }

    const updatedDay: IDayInfo = {
      ...day,
      remark: newRemark.trim(),
      dayValue: GetDateTimeFormatEN(day.dayValueEN),
    };

    try {
      const data = await shiftService.updateShiftDayRemark(
        updatedDay,
        shiftGroupId
      );
      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
        return;
      }

      const newId = data.d.problemId!;

      if (weekDays) {
        setweekDays((wds) =>
          wds!.map((d) =>
            d.dayValueEN === updatedDay.dayValueEN
              ? { ...d, remark: updatedDay.remark || d.remark, id: newId }
              : d
          )
        );
      }
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flex: "row",
        textAlign: "center",
        fontFamily: "Rubik",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: "26px",
        lineHeight: "35px",
        marginRight: "40px",
        background: "#F5F5F5",
        minWidth: "1280px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "end",
          minWidth: "180px",
          paddingRight: "40px",
        }}
      >
        סוג עובד
      </div>
      {weekDays &&
        weekDays.map((day: IDayInfo) => (
          <div
            key={day.dayValue}
            style={{
              width: "175px",
              marginRight: "15px",
              color: day.isToday ? "blue" : "black",
            }}
          >
            <Typography variant="h5" fontWeight="bold" fontFamily="Rubik">
              {day.dayName}&apos;
            </Typography>
            <Typography
              variant="h6"
              fontFamily="Rubik"
              sx={{ color: day.holydayName ? "inherit" : "transparent" }}
            >
              {day.holydayName || "-"}
            </Typography>
            <Typography variant="h6" fontWeight="bold" fontFamily="Rubik">
              {day.dayValueEN.replaceAll("00:00", "")}
            </Typography>
            <div style={{ display: "flex", flex: "row", marginBottom: "5px" }}>
              <Tooltip title={day.remark}>
                <InputLabel
                  style={{
                    border: "1px dashed ",
                    width: "200px",
                    minHeight: "20px",
                  }}
                  onClick={() => {
                    updateDayRemark(day);
                  }}
                >
                  {day.remark}
                </InputLabel>
              </Tooltip>
            </div>
          </div>
        ))}
    </div>
  );
}
