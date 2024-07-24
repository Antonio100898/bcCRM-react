import { useEffect, useState } from "react";
import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { useSnackbar } from "notistack";
import Days from "./Days";
import DateSelect from "../DateSelect/DateSelect";
import { useUser } from "../../Context/useUser";
import { useConfirm } from "../../Context/useConfirm";
import { shiftService } from "../../API/services";
import { IDayInfo, IshiftDetail, IshiftWeek } from "../../Model";
import ShiftsContainer from "./ShiftsContainer";
import InstallationShiftDetailsDialog from "../../Dialogs/ShiftDialogs/InstallationShiftDetailsDialog";
import ShiftDialog from "../../Dialogs/ShiftDialogs/ShiftDialog";
import { getWeekDate } from "../../helpers/getWeekDate";
import { addDays } from "../../helpers/addDays";
import dayjs from "dayjs";
import { getDateTimeFormatEN } from "../../helpers/getDateTimeFormatEN";

export default function Shifts() {
  const { enqueueSnackbar } = useSnackbar();
  const { confirm } = useConfirm();
  const { updateShowLoader, user, isAdmin } = useUser();
  const [shifts, setShfits] = useState<IshiftWeek[]>([]);
  const [myWeekDays, setweekDays] = useState<IDayInfo[]>([]);
  const [part, setPart] = useState<number>(1);
  const [currentShift, setCurrentShift] = useState<IshiftDetail | null>(null);
  const [showShiftDialog, setShowShiftDialog] = useState(false);
  const [
    showInstallationShiftDetailsDialog,
    setShowInstallationShiftDetailsDialog,
  ] = useState(false);
  const [startDate, setStartDate] = useState(getWeekDate("start"));
  const [finishDate, setFinishDate] = useState(getWeekDate("finish"));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleWeekChange = (move: "next" | "prev") => {
    if (move === "next") {
      setStartDate(addDays(startDate, 7));
      setFinishDate(addDays(finishDate, 7));
    } else {
      setStartDate(addDays(startDate, -7));
      setFinishDate(addDays(finishDate, -7));
    }
  };

  //department 4 = tafritim
  //shiftGroupId 2 = tafritim
  //shiftGroupId 1 = anan
  const shiftGroupId = user?.department === 4 ? 2 : 1;

  const showEmptyShift = (
    jobTypeId: number,
    shiftTypeId: number,
    date: Date
  ) => {
    let emptyShift: IshiftDetail = {
      id: 0,
      workerId: 199,
      jobTypeId: jobTypeId,
      shiftTypeId: shiftTypeId,
      placeName: "",
      phone: "",
      remark: "",
      contactName: "",
      startDate: new Date(date).toString(),
      startDateEN: new Date(date).toString(),
      address: "",
      dayName: "",
      finishHour: "",
      finishTime: "",
      finishTimeEN: "",
      jobTypeName: "",
      shiftName: "",
      startHour: "",
      workerName: "",
    };

    setCurrentShift(emptyShift);
    setShowShiftDialog(true);
  };

  const onChange = <K extends keyof IshiftDetail>(
    key: K,
    val: IshiftDetail[K]
  ) => {
    let startDate = "";
    let finishTime = "";
    if (key === "startHour" && currentShift) {
      startDate = getDateTimeFormatEN(currentShift.startDateEN, val.toString());
    }
    if (key === "finishHour" && currentShift) {
      finishTime = getDateTimeFormatEN(
        currentShift.startDateEN,
        val.toString()
      );
    }
    if (!finishTime && !startDate) {
      setCurrentShift({ ...currentShift!, [key]: val });
    } else {
      if (startDate)
        setCurrentShift({ ...currentShift!, [key]: val, startDate });
      if (finishTime)
        setCurrentShift({ ...currentShift!, [key]: val, finishTime });
    }
  };

  const handlePartChange = (action: "next" | "prev") => {
    switch (action) {
      case "next":
        if (part < 3) setPart((prev) => prev + 1);
        break;
      case "prev":
        if (part > 1) setPart((prev) => prev - 1);
        break;
    }
  };

  const appendDefultWeekShifts = async () => {
    try {
      const data = await shiftService.appendDefultWeekShifts(
        new Date(startDate).toDateString(),
        shiftGroupId
      );
      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
      } else {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
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

  const askAddDefaults = async (): Promise<boolean> => {
    if (
      await confirm(
        "לא נמצאו משמרות לשבוע זה, האם ברצונך להוסיף משמרות ברירת מחדל?"
      )
    ) {
      updateShowLoader(true);
      appendDefultWeekShifts();
      return true;
    }

    return false;
  };

  const fetchShifts = async () => {
    updateShowLoader(true);
    try {
      const data = await shiftService.getShiftDetails(startDate, shiftGroupId);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
        updateShowLoader(false);
        return;
      }
      setweekDays(data?.d.shiftsDays);
      setShfits(data?.d.shiftDetails);
      if (data.d.shiftDetails.length === 0) {
        if (await askAddDefaults()) {
          fetchShifts();
        }
      }
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
      console.error(error);
    }

    updateShowLoader(false);
  };

  useEffect(() => {
    fetchShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  // const showWorkersMissingShiftPlans = async () => {
  //   try {
  //     const data = await shiftService.getWorkersMissingShiftsPlan(
  //       new Date(startDate).toDateString()
  //     );
  //     if (!data?.d.success) {
  //       enqueueSnackbar({
  //         message: data?.d.msg,
  //         variant: "error",
  //       });
  //       if (data?.d.msg === "נכשל לעדכן תקלה. חסר פרטי משתמש") {
  //         enqueueSnackbar({
  //           message: "Log Out",
  //           variant: "error",
  //         });
  //       }
  //       return;
  //     }
  //   } catch (error) {
  //     if (error instanceof Error)
  //       enqueueSnackbar({
  //         message: error.message,
  //         variant: "error",
  //       });
  //     console.error(error);
  //   }
  //   updateShowLoader(false);
  // };

  return (
    <>
      <Box maxWidth={1400} mx={"auto"}>
        <Typography px={2} variant="subtitle1">
          סידור משמרות
        </Typography>
        <DateSelect
          onNext={() => handleWeekChange("next")}
          onPrev={() => handleWeekChange("prev")}
          displayValue={`${dayjs(startDate).format("DD/MM/YYYY")} -
          ${dayjs(finishDate).format("DD/MM/YYYY")}`}
        />
        {/* <div
        style={{
          display: "flex",
          flex: "row",
          justifyContent: "space-around",
        }}
      >
        {user?.userType === 1 && (
          <Tooltip title="קבוצת משמרות" placement="top-start">
            <Select
              label="קבוצת משמרות"
              variant="outlined"
              value={shiftGroupId}
              onChange={(e: SelectChangeEvent<number>) =>
                setShiftGroupId(parseInt(`${e.target.value}`, 10))
              }
              style={{ marginBottom: "5px" }}
            >
              <MenuItem value="1">ענן</MenuItem>
              <MenuItem value="2">תפריטים</MenuItem>
            </Select>
          </Tooltip>
        )}

        <Tooltip title={showShiftDetails ? "הצג פירוט" : "הסתר פירוט"}>
          <Switch onChange={() => setShowShiftDetails(!showShiftDetails)} />
        </Tooltip>

        <Tooltip title="מי לא הגיש משמרות השבוע">
          <IconButton
            onClick={showWorkersMissingShiftPlans}
            style={{
              background: "#F3BE80",
              borderRadius: "12px",
              margin: 5,
            }}
          >
            <SurfingOutlinedIcon
              style={{ fontSize: 40, color: "rgba(255, 255, 255, 0.9)" }}
            />
          </IconButton>
        </Tooltip>
      </div> */}
        <Days
          part={part}
          handlePartChange={handlePartChange}
          weekDaysAll={myWeekDays}
          shiftGroupId={shiftGroupId}
        />
        {shifts && (
          <Box my={2} px={2}>
            <ShiftsContainer
              setCurrentShift={setCurrentShift}
              setShowInstallationShiftDetailsDialog={
                setShowInstallationShiftDetailsDialog
              }
              setShowShiftDialog={setShowShiftDialog}
              showEmptyShift={showEmptyShift}
              part={part}
              refreshList={fetchShifts}
              shiftsList={shifts}
              startOfWeek={startDate}
              title="בוקר"
              shiftTypeId={1}
              shiftGroupId={shiftGroupId}
            />

            <ShiftsContainer
              setCurrentShift={setCurrentShift}
              setShowInstallationShiftDetailsDialog={
                setShowInstallationShiftDetailsDialog
              }
              setShowShiftDialog={setShowShiftDialog}
              showEmptyShift={showEmptyShift}
              part={part}
              refreshList={fetchShifts}
              shiftsList={shifts}
              startOfWeek={startDate}
              title="צהריים"
              shiftTypeId={2}
              shiftGroupId={shiftGroupId}
            />

            <ShiftsContainer
              setCurrentShift={setCurrentShift}
              setShowInstallationShiftDetailsDialog={
                setShowInstallationShiftDetailsDialog
              }
              setShowShiftDialog={setShowShiftDialog}
              showEmptyShift={showEmptyShift}
              part={part}
              refreshList={fetchShifts}
              shiftsList={shifts}
              startOfWeek={startDate}
              title="ערב"
              shiftTypeId={3}
              shiftGroupId={shiftGroupId}
            />

            <ShiftsContainer
              setCurrentShift={setCurrentShift}
              setShowInstallationShiftDetailsDialog={
                setShowInstallationShiftDetailsDialog
              }
              setShowShiftDialog={setShowShiftDialog}
              showEmptyShift={showEmptyShift}
              part={part}
              refreshList={fetchShifts}
              shiftsList={shifts}
              startOfWeek={startDate}
              title="לילה"
              shiftTypeId={4}
              shiftGroupId={shiftGroupId}
            />

            <ShiftsContainer
              setCurrentShift={setCurrentShift}
              setShowInstallationShiftDetailsDialog={
                setShowInstallationShiftDetailsDialog
              }
              setShowShiftDialog={setShowShiftDialog}
              showEmptyShift={showEmptyShift}
              part={part}
              refreshList={fetchShifts}
              shiftsList={shifts}
              startOfWeek={startDate}
              title="בלתמ"
              shiftTypeId={5}
              shiftGroupId={shiftGroupId}
            />
          </Box>
        )}
      </Box>
      {currentShift && (
        <ShiftDialog
          onChange={onChange}
          onShiftDetailsOpen={() => setShowInstallationShiftDetailsDialog(true)}
          installation={currentShift?.jobTypeId === 1}
          shift={currentShift}
          shiftGroupId={shiftGroupId}
          open={showShiftDialog && !showInstallationShiftDetailsDialog}
          onClose={() => setShowShiftDialog(false)}
        />
      )}
      {currentShift && currentShift?.jobTypeId === 1 && (
        <InstallationShiftDetailsDialog
          fullScreen={isAdmin && isMobile}
          onChange={onChange}
          adress={currentShift.address!}
          customer={currentShift.contactName!}
          isAdmin={isAdmin}
          phone={currentShift.phone!}
          placeName={currentShift.placeName!}
          wifi="wifi"
          remark={currentShift.remark}
          open={showInstallationShiftDetailsDialog && !showShiftDialog}
          onClose={() => setShowInstallationShiftDetailsDialog(false)}
        />
      )}
    </>
  );
}
