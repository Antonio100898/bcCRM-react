import { useEffect, useState, useRef } from "react";
import {
  Typography,
  Box,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useConfirm } from "../../Context/useConfirm";
import { IDayInfo } from "../../Model";
import { shiftService } from "../../API/services";

export type Props = {
  weekDaysAll: IDayInfo[];
  shiftGroupId: number;
  handlePartChange: (action: "next" | "prev") => void;
  part: number;
};

export default function Days({
  weekDaysAll,
  shiftGroupId,
  handlePartChange,
  part,
}: Props) {
  const { prompt } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const [weekDays, setweekDays] = useState<IDayInfo[]>();
  const boxRef = useRef<HTMLDivElement>(null);
  const [isOnTop, setIsOnTop] = useState(false);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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
//@ts-ignore
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

  const getSlicedDays = () => {
    switch (part) {
      case 1:
        return weekDays!.slice(0, 3);
      case 2:
        return weekDays!.slice(3, 6);
      case 3:
        return weekDays!.slice(6);
      default:
        return weekDays!;
    }
  };

  const initialOffsetTop = boxRef.current?.offsetTop;

  const scrollHandle = () => {
    if (initialOffsetTop && boxRef.current?.offsetTop) {
      const top = boxRef.current?.offsetTop;
      if (top > initialOffsetTop) {
        setIsOnTop(true);
      } else setIsOnTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandle);
    return () => {
      window.removeEventListener("scroll", scrollHandle);
    };
  }, [initialOffsetTop]);

  return (
    <Box
      ref={boxRef}
      sx={{
        position: "sticky",
        top: "56px",
        backgroundColor: "white",
        zIndex: 1000,
        pt: 2,
        mt: 1,
        overflowX: "hidden",
      }}
    >
      {isTablet && (
        <>
          <IconButton
            sx={{
              position: "absolute",
              left: 0,
              display: part > 1 ? "block" : "none",
            }}
            onClick={() => handlePartChange("prev")}
          >
            <img src="/rightArrow.svg" />
          </IconButton>
          <IconButton
            sx={{
              position: "absolute",
              right: 0,
              display: part < 3 ? "block" : "none",
            }}
            onClick={() => handlePartChange("next")}
          >
            <img src="/leftArrow.svg" />
          </IconButton>
        </>
      )}
      <Stack px={2} pb={1} direction="row" gap="8px" justifyContent="center">
        {weekDays &&
          (isTablet ? getSlicedDays() : weekDays).map((day: IDayInfo) => (
            <Box sx={{ maxWidth: "200px" }} flex={1} key={day.dayValue}>
              <Typography textAlign="center" variant="body1" fontWeight="bold">
                {day.dayName}&apos;
              </Typography>
              <Typography textAlign="center" variant="body1">
                {day.dayValueEN.replaceAll("00:00", "")}
              </Typography>
            </Box>
          ))}
      </Stack>
      <Divider
        sx={{
          visibility: isOnTop ? "" : "hidden",
        }}
      />
    </Box>
  );
}
