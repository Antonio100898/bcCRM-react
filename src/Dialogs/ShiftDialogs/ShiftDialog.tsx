import { useEffect, useState } from "react";
import { shiftService } from "../../API/services";
import { IWorker, IshiftDetail } from "../../Model";
import CustomDialog from "../CustomDialog";
import { enqueueSnackbar } from "notistack";
import { useUser } from "../../Context/useUser";
import { getTimeString } from "../../helpers/getTimeString";
import { Dayjs } from "dayjs";
import { getDateTimeFormatEN } from "../../helpers/getDateTimeFormatEN";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { installationShiftDesc } from "../../Temp/InstallationShiftDesc";
import TimePicker from "../../components/TimePicker/TimePicker";
import SelectChip from "../../components/SelectChip/SelectChip";
import InstallationDetails from "./InstallationDetails";
import SelectsChipGroup from "../../components/SelectChipGroup/SelectsChipGroup";

type Props = {
  open: boolean;
  onClose: () => void;
  shift: Partial<IshiftDetail>;
  shiftGroupId: number;
  onShiftDetailsOpen: () => void;
  installation?: boolean;
};

const ShiftDialog = ({
  open,
  onClose,
  shift,
  shiftGroupId,
  onShiftDetailsOpen,
  installation,
}: Props) => {
  const [currentShift, setCurrentShift] = useState(shift);
  const [currentJobWorkers, setCurrentJobWorkers] = useState<IWorker[]>([]);
  const [startTime, setStartTime] = useState("00:00");
  const [finishTime, setFinishTime] = useState("00:00");
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedInstallationDesc, setSelectedInstallationDesc] = useState<
    string | null
  >(null);

  const { workers, user, isAdmin } = useUser();

  const theme = useTheme();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("md"));

  const fetchShiftPlans = async () => {
    setLoading(true);
    try {
      const data = await shiftService.getShiftPlansDetails(
        new Date(currentShift.startDateEN!).toDateString()
      );
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
          variant: "error",
        });
        return;
      }

      const shi: IshiftDetail[] = data.d.shiftPlanDetails;
      const result =
        workers &&
        workers
          .filter((name: IWorker) => name.departmentId === user?.department)
          .filter((worker: IWorker) => {
            const isPlan =
              shi.filter((a) => a.workerId === worker.Id).length > 0;

            return { ...worker, active: isPlan };
          });

      if (result) setCurrentJobWorkers(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const onChange = <K extends keyof IshiftDetail>(
    key: K,
    val: IshiftDetail[K]
  ) => {
    setCurrentShift({ ...currentShift, [key]: val });
  };

  // const handleChange = (newValue: Dayjs | null) => {
  //   onChange("startDateEN", newValue?.format() || "01/01/2000");
  // };

  const handleShiftDetailsClicked = (desc: string) => {
    if (!isBigScreen && selectedInstallationDesc === desc) onShiftDetailsOpen();
    else setSelectedInstallationDesc(desc);
  };

  const updateShift = async () => {
    if (
      currentShift.workerId === undefined ||
      currentShift.workerId === null ||
      currentShift.workerId === 0
    ) {
      enqueueSnackbar({
        message: "אנא בחר עובד",
        variant: "error",
      });
      return;
    }

    if (
      currentShift.finishTimeEN === undefined ||
      currentShift.startDateEN === undefined
    ) {
      enqueueSnackbar({
        message: "אנא בחר שעת סיום",
        variant: "error",
      });
      return;
    }

    currentShift.startDate = getDateTimeFormatEN(
      currentShift!.startDateEN,
      startTime
    );
    currentShift.finishTime = getDateTimeFormatEN(
      currentShift!.finishTimeEN,
      finishTime
    );
    try {
      const data = await shiftService.updateShiftDetails(
        currentShift,
        shiftGroupId
      );

      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
          variant: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
    onClose();
  };

  const cancelShift = async () => {
    if (currentShift.workerId === user?.workerId || isAdmin) {
      if (!(await confirm("האם את בטוחה שברצונך לבטל?"))) return;
      if (!currentShift?.id) {
        enqueueSnackbar({
          message: `משמרת לא קיימת`,
          variant: "error",
        });
        return;
      }
      try {
        const data = await shiftService.cancelShift(currentShift.id);

        if (!data?.d.success) {
          enqueueSnackbar({
            message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
            variant: "error",
          });
          return;
        }
      } catch (error) {
        console.error(error);
      } finally {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (open) {
      fetchShiftPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setCurrentShift(shift);
    setStartTime(getTimeString(shift.startDateEN));
    setFinishTime(getTimeString(shift.finishTimeEN));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift]);

  const handleClose = () => {
    setSelectedWorker(null);
    onClose();
  };

  return (
    <CustomDialog
      onSubmit={updateShift}
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
                  selected={currentShift.workerId === worker.Id}
                  label={`${worker.firstName} ${worker.lastName}`}
                />
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
                  onChange={(v) => onChange("startHour", v as string)}
                  value={currentShift.startHour || "00:00"}
                  label="שעת התחלה"
                />
                <TimePicker
                  onChange={(v) => onChange("finishHour", v as string)}
                  value={currentShift.finishHour || "00:00"}
                  label="שעת סיום"
                />
              </Stack>
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
                  adress={currentShift.address!}
                  customer={currentShift.contactName!}
                  isAdmin={isAdmin}
                  onChange={onChange}
                  phone={currentShift.phone!}
                  placeName={currentShift.placeName!}
                  wifi="wifi"
                  remark={currentShift.remark}
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
