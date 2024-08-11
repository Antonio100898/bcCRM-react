import { useEffect, useState } from "react";
import { shiftService } from "../../API/services";
import { IWorker, IshiftDetail } from "../../Model";
import CustomDialog from "../CustomDialog";
import { enqueueSnackbar } from "notistack";
import { useUser } from "../../Context/useUser";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import { installationShiftDesc } from "../../Temp/InstallationShiftDesc";
import SelectChip from "../../components/SelectChip/SelectChip";
import InstallationDetails from "./InstallationDetails";
import SelectsChipGroup from "../../components/SelectChipGroup/SelectsChipGroup";
import TimePicker from "../../components/TimePicker/TimePicker";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getDateTimeFormatEN } from "../../helpers/getDateTimeFormatEN";

type Props = {
  refreshList: () => void;
  open: boolean;
  onClose: () => void;
  shift: IshiftDetail;
  shiftGroupId: number;
  onShiftDetailsOpen: () => void;
  installation?: boolean;
  onChange: <K extends keyof IshiftDetail>(
    key: K,
    val: IshiftDetail[K]
  ) => void;
};

const ShiftDialog = ({
  open,
  onClose,
  shift,
  shiftGroupId,
  onShiftDetailsOpen,
  installation,
  onChange,
  refreshList,
}: Props) => {
  const [currentJobWorkers, setCurrentJobWorkers] = useState<IWorker[]>([]);
  const [missingShiftPlansWorkers, setMissingShiftPlansWorkers] =
    useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [selectedInstallationDesc, setSelectedInstallationDesc] = useState<
    string | null
  >(null);
  const [disableScroll, setDisableScroll] = useState(false);

  const handleDisableDialogScroll = (val: boolean) => {
    setDisableScroll(val);
  };
  const { workers, isAdmin } = useUser();

  const theme = useTheme();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("md"));

  const fetchShiftPlans = async () => {
    setLoading(true);
    try {
      const data = await shiftService.getShiftPlansDetails(
        new Date(shift.startDateEN!).toDateString(),
        shift.shiftTypeId || 0
      );
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
          variant: "error",
        });
        return;
      }
      const missingShiftsData = await shiftService.getWorkersMissingShiftsPlan(
        new Date(shift.startDateEN!).toDateString()
      );

      setMissingShiftPlansWorkers(
        Array.from(
          new Set<string>(
            missingShiftsData?.d.msg
              .split("\r\n")
              .filter((d) => d !== "" && d !== " ")
          )
        )
      );

      const shi: IshiftDetail[] = data.d.shiftPlanDetails;
      const result = workers.filter((w) =>
        shi.find((s) => s.workerId === w.Id)
      );
      if (result) setCurrentJobWorkers(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleShiftDetailsClicked = (desc: string) => {
    if (!isBigScreen && selectedInstallationDesc === desc) onShiftDetailsOpen();
    else setSelectedInstallationDesc(desc);
  };

  const updateShift = async () => {
    if (!shift.workerId) {
      enqueueSnackbar({
        message: "אנא בחר עובד",
        variant: "error",
      });
      return;
    }

    if (shift.finishTimeEN === undefined || shift.startDateEN === undefined) {
      enqueueSnackbar({
        message: "אנא בחר שעת סיום",
        variant: "error",
      });
      return;
    }
    try {
      const data = await shiftService.updateShiftDetails(
        {
          address: shift.address,
          color: null,
          contactName: shift.contactName,
          dayName: shift.dayName,
          finishHour: shift.finishHour,
          finishTime: shift.finishTime,
          finishTimeEN: shift.finishTimeEN,
          isShiftManager: false,
          jobTypeId: shift.jobTypeId,
          jobTypeName: shift.jobTypeName,
          phone: shift.phone,
          placeName: shift.placeName,
          shiftGroupId: shiftGroupId,
          shiftName: shift.shiftName,
          startHour: shift.startHour,
          workerName: shift.workerName,
          cancel: false,
          id: shift.id,
          remark: shift.remark,
          shiftTypeId: shift.shiftTypeId,
          startDate: getDateTimeFormatEN(shift.startDateEN, shift.startHour),
          startDateEN: shift.startDateEN,
          workerId: shift.workerId, 
        },
        shiftGroupId
      );
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל. ${data?.d.msg}`,
          variant: "error",
        });
      } else {
        enqueueSnackbar({
          variant: "success",
          message: "המשמרת עודכנה בהצלחה",
        });
        refreshList();
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cancelShift = async () => {
    if (isAdmin) {
      if (!(await confirm(" האם את בטוחה שברצונך לבטל?"))) return;
      if (!shift?.id) {
        enqueueSnackbar({
          message: `משמרת לא קיימת`,
          variant: "error",
        });
        return;
      }
      try {
        const data = await shiftService.cancelShift(shift.id);

        if (!data?.d.success) {
          enqueueSnackbar({
            message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
            variant: "error",
          });
          return;
        }

        enqueueSnackbar({
          message: `המשמרת בוטלה`,
          variant: "success",
        });

        refreshList();
        onClose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (open) {
      fetchShiftPlans();
    }
  }, [open]);
  //@ts-ignore
  const handleClose = () => {
    onClose();
  };

  return (
    <CustomDialog
      disableScroll={disableScroll}
      sx={{ maxWidth: "1200px", px: isBigScreen ? 4 : 0 }}
      fullScreen={!isBigScreen}
      onClose={onClose}
      open={open}
    >
      {loading ? (
        <Box width="100%" textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <Stack direction="row">
          <Stack gap={7} flex={1}>
            <SelectsChipGroup label="עובד">
              {currentJobWorkers.map((worker) => (
                <SelectChip
                  key={worker.Id}
                  onClick={() => onChange("workerId", worker.Id)}
                  selected={shift.workerId === worker.Id}
                  label={`${worker.firstName} ${worker.lastName}`}
                />
              ))}
            </SelectsChipGroup>
            <SelectsChipGroup label="לא הגישו">
              {missingShiftPlansWorkers &&
                missingShiftPlansWorkers.map((name) => (
                  <SelectChip key={name} label={name} />
                ))}
            </SelectsChipGroup>
            {installation && (
              <SelectsChipGroup label="תיאור משמרת">
                {installationShiftDesc.map((desc) => (
                  <SelectChip
                    selected={selectedInstallationDesc === desc}
                    onClick={() => handleShiftDetailsClicked(desc)}
                    key={desc}
                    label={desc}
                  />
                ))}
              </SelectsChipGroup>
            )}
            <Stack gap={1.5}>
              <Typography fontWeight="bold">שעות המשמרת</Typography>
              <Stack direction="row" justifyContent="space-between" gap={2}>
                <TimePicker
                  disableDialogScroll={handleDisableDialogScroll}
                  onChange={(v) => onChange("startHour", v as string)}
                  value={shift.startHour || "00:00"}
                  label="שעת התחלה"
                />
                <TimePicker
                  disableDialogScroll={handleDisableDialogScroll}
                  onChange={(v) => onChange("finishHour", v as string)}
                  value={shift.finishHour || "00:00"}
                  label="שעת סיום"
                />
              </Stack>
              {shift.id !== 0 && (
                <Tooltip title="בטל משמרת">
                  <IconButton
                    sx={{ alignSelf: "flex-start" }}
                    onClick={cancelShift}
                  >
                    <DeleteOutlineIcon color="error" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>
          {isBigScreen && installation && (
            <>
              <Divider
                orientation="vertical"
                sx={{
                  height: "inherit",
                  borderColor: "common.black",
                  mx: 6,
                }}
              />
              <Box width="300px">
                <InstallationDetails
                  adress={shift.address!}
                  customer={shift.contactName!}
                  isAdmin={isAdmin}
                  onChange={onChange}
                  phone={shift.phone!}
                  placeName={shift.placeName!}
                  wifi="wifi"
                  remark={shift.remark}
                />
              </Box>
            </>
          )}
        </Stack>
      )}
    </CustomDialog>
  );
};

export default ShiftDialog;
