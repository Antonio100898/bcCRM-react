import { Box, Switch, useTheme } from "@mui/material";
import { SetStateAction, useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { IProblem, IProblemType, IUser } from "../../Model";
import { TOKEN_KEY } from "../../Consts/Consts";
import { useConfirm } from "../../Context/useConfirm";
import { LoadingButton } from "@mui/lab";
import { problemService } from "../../API/services";

type Props = {
  problem: IProblem;
  trackingId: number | undefined;
  updateProblem: (value: IProblem) => void;
  updateProblemTracking: () => void;
  currentProblemTypesId?: number[];
  problemTypes: IProblemType[];
  user: IUser | null;
  setSelfProblemDialog: (value: SetStateAction<IProblem | null>) => void;
  onDialogClose: () => void;
  refreshDepartments: () => Promise<void>;
};

export default function ProblemActions({
  problem,
  currentProblemTypesId,
  problemTypes,
  updateProblem,
  user,
  setSelfProblemDialog,
  onDialogClose,
  updateProblemTracking,
  trackingId,
  refreshDepartments,
}: Props) {
  const [selfProblem, setSelfProblem] = useState<IProblem>({ ...problem });
  const [pendingClose, setPendingClose] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(false);

  const theme = useTheme();
  const { confirm } = useConfirm();

  useEffect(() => {
    setSelfProblem({ ...problem });
  }, [problem]);

  useEffect(() => {
    console.log(trackingId);
  }, [trackingId]);

  const stop = () => {
    setPendingUpdate(false);
    setPendingClose(false);
  };

  const stopPending = async () => {
    return new Promise((res) => {
      setTimeout(() => {
        res(stop());
      }, 500);
    });
  };

  const saveProblem = async (close: boolean, closeProblem: boolean) => {
    if (closeProblem) {
      setPendingClose(true);
      if (!(await confirm("האם את\\ה בטוח שברצונך לסגור את התקלה הזאת?"))) {
        await stopPending();
        return;
      }
      selfProblem.statusId = 2;
    } else {
      setPendingUpdate(true);
      selfProblem.statusId = 0;
    }
    selfProblem.workerKey = localStorage.getItem(TOKEN_KEY) || "";

    selfProblem.workerCreateName = user?.workerName || "";

    if (currentProblemTypesId) {
      const newProblemTypes: IProblemType[] = [];

      currentProblemTypesId.forEach((id) => {
        const newPt = problemTypes.find((pt) => pt.id === id);
        if (newPt) newProblemTypes.push(newPt);
      });

      selfProblem.problemTypesList = newProblemTypes;
    }

    try {
      const data = await problemService.updateProblem(selfProblem);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
          variant: "error",
        });
        await stopPending();
        return;
      }
      setSelfProblemDialog({
        ...selfProblem,
        id: data.d.problemId || 0,
        files: data.d.filesName,
        newFiles: [],
      });
      setSelfProblem({
        ...selfProblem,
        id: data.d.problemId || 0,
        files: data.d.filesName,
        newFiles: [],
      });

      enqueueSnackbar({
        message: "התקלה העודכנה בהצלחה!",
        variant: "success",
      });

      if (close) {
        updateProblem(selfProblem);
        onDialogClose();
      }
      await stopPending();
    } catch (error) {
      console.error(error);
    } finally {
      refreshDepartments();
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          background: "white",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingY: 1,
        }}
      >
        <LoadingButton
          disabled={pendingClose || pendingUpdate}
          loading={pendingClose}
          variant="outlined"
          sx={{
            fontSize: 18,
            height: "40px",
            width: "25%",
            color: "rgba(0, 0, 0, 0.87)",
          }}
          onClick={() => saveProblem(true, true)}
        >
          סגור
        </LoadingButton>
        <LoadingButton
          disabled={pendingClose || pendingUpdate}
          loading={pendingUpdate}
          variant="contained"
          sx={{ fontSize: 18, height: "40px", width: "25%" }}
          onClick={() => saveProblem(true, false)}
        >
          עדכן
        </LoadingButton>
        <Box sx={{ width: "25%" }}>
          <Box sx={{ color: theme.palette.primary.main }}>מעקב</Box>
          <Switch
            disabled={pendingClose || pendingUpdate}
            size="small"
            checked={trackingId !== 0}
            onChange={updateProblemTracking}
          />
        </Box>
      </Box>
    </Box>
  );
}
