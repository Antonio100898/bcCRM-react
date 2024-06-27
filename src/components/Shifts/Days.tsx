import { useEffect, useState } from "react";
import { Typography, Box, Stack, useTheme, useMediaQuery } from "@mui/material";
import { useSnackbar } from "notistack";
import { useConfirm } from "../../Context/useConfirm";
import { IDayInfo } from "../../Model";
import { shiftService } from "../../API/services";

export type Props = {
  weekDaysAll: IDayInfo[];
  shiftGroupId: number;
};

export default function Days({ weekDaysAll, shiftGroupId }: Props) {
  const { prompt } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const [weekDays, setweekDays] = useState<IDayInfo[]>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Stack
      direction="row"
      sx={{
        position: "sticky",
        top: "56px",
        backgroundColor: "white",
        zIndex: 1000,
        px: 2,
        pt: 2,
        pb: 1
      }}
    >
      {weekDays &&
        (isMobile ? weekDays.slice(0, 3) : weekDays).map((day: IDayInfo) => (
          <Box flex={1} width="200px" key={day.dayValue}>
            <Typography textAlign="center" variant="body1" fontWeight="bold">
              {day.dayName}&apos;
            </Typography>
            <Typography textAlign="center" variant="body1">
              {day.dayValueEN.replaceAll("00:00", "")}
            </Typography>
          </Box>
        ))}
    </Stack>
  );
}
