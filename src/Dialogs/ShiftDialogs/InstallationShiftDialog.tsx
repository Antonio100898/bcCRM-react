import { useEffect, useState } from "react";
import { shiftService } from "../../API/services";
import { IWorker, IshiftDetail } from "../../Model";
import CustomDialog from "../CustomDialog";
import { enqueueSnackbar } from "notistack";
import { useUser } from "../../Context/useUser";
import { getTimeString } from "../../helpers/getTimeString";
import { Dayjs } from "dayjs";
import { getDateTimeFormatEN } from "../../helpers/getDateTimeFormatEN";
import { Chip, Stack, Typography } from "@mui/material";
import { installationShiftDesc } from "../../Temp/InstallationShiftDesc";
import TimePicker from "../../components/TimePicker/TimePicker";

type Props = {
  open: boolean;
  onClose: () => void;
  shift: Partial<IshiftDetail>;
  shiftGroupId: number;
  onShiftDetailsOpen: () => void;
};

const InstallationShiftDialog = ({
  open,
  onClose,
  shift,
  shiftGroupId,
  onShiftDetailsOpen,
}: Props) => {
  const [currentShift, setCurrentShift] = useState(shift);
  const [currentJobWorkers, setCurrentJobWorkers] = useState<IWorker[]>([]);
  const [startTime, setStartTime] = useState("00:00");
  const [finishTime, setFinishTime] = useState("00:00");
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);
  const [selectedInstallationDesc, setSelectedInstallationDesc] = useState<
    string | null
  >(null);

  const { workers, user } = useUser();

  const fetchShiftPlans = async () => {
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
  };

  const onChange = <K extends keyof IshiftDetail>(
    key: K,
    val: IshiftDetail[K]
  ) => {
    setCurrentShift({ ...currentShift, [key]: val });
  };

  const handleChange = (newValue: Dayjs | null) => {
    onChange("startDateEN", newValue?.format() || "01/01/2000");
  };

  const handleShiftDetailsClicked = (desc: string) => {
    if (selectedInstallationDesc === desc) onShiftDetailsOpen();
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
    if (currentShift.workerId === user?.workerId || user?.userType === 1) {
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

  return (
    <CustomDialog fullScreen onClose={onClose} open={open}>
      <Stack gap={7}>
        <Stack gap={1.5}>
          <Typography fontWeight="bold">עובד</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {currentJobWorkers.map((worker) => (
              <Chip
                key={worker.Id}
                onClick={() => setSelectedWorker(worker.Id)}
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  backgroundColor:
                    selectedWorker === worker.Id ? "primary.main" : "",
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                }}
                label={`${worker.firstName} ${worker.lastName}`}
              />
            ))}
          </Stack>
        </Stack>
        <Stack gap={1.5}>
          <Typography fontWeight="bold">תיאור משמרת</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {installationShiftDesc.map((desc) => (
              <Chip
                onClick={() => handleShiftDetailsClicked(desc)}
                key={desc}
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  backgroundColor:
                    selectedInstallationDesc === desc ? "primary.main" : "",
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                }}
                label={desc}
              />
            ))}
          </Stack>
        </Stack>
        <Stack gap={1.5}>
          <Typography fontWeight="bold">שעות המשמרת</Typography>
          <TimePicker value="00:00" />
        </Stack>
      </Stack>
    </CustomDialog>
  );
};

export default InstallationShiftDialog;
