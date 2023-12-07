import { Box, Fab, Switch, Tooltip, useTheme } from "@mui/material";
import { SetStateAction, useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { IProblem, IProblemType, IUser } from "../../Model";
import { TOKEN_KEY } from "../../Consts/Consts";
import { useConfirm } from "../../Context/useConfirm";
import { problemService } from "../../API/services";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import LockIcon from "@mui/icons-material/Lock";
import HistoryIcon from "@mui/icons-material/History";

type Props = {
  problem: IProblem;
  trackingId: number | undefined;
  updateProblem: (value: IProblem) => void;
  updateProblemTracking: () => void;
  currentProblemTypesId?: number[];
  problemTypes: IProblemType[];
  user: IUser | null;
  setSelfProblemDialog: (value: SetStateAction<IProblem>) => void;
  onDialogClose: () => void;
  refreshDepartments: () => Promise<void>;
  showProblemHistory: () => Promise<void>;
  bigScreen: boolean;
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
  showProblemHistory,
  bigScreen,
}: Props) {
  const [selfProblem, setSelfProblem] = useState<IProblem>({ ...problem });
  const [pendingClose, setPendingClose] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(false);

  const theme = useTheme();
  const { confirm } = useConfirm();

  useEffect(() => {
    setSelfProblem({ ...problem });
  }, [problem]);

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
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: 1,
          paddingX: "5%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "30%",
            gap: "5%",
          }}
        >
          <Fab
            onClick={showProblemHistory}
            sx={{ margin: 0, boxShadow: 0 }}
            size={bigScreen ? "medium" : "large"}
          >
            <Tooltip title="הצג הסטוריה">
              <HistoryIcon style={{ fontSize: 25, color: "black" }} />
            </Tooltip>
          </Fab>{" "}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "70%",
            gap: "10%",
          }}
        >
          {(!selfProblem.isLocked ||
            user?.userType === 1 ||
            (selfProblem.isLocked &&
              (selfProblem.toWorker === user?.workerId ||
                selfProblem.workerCreateId === user?.workerId))) && (
            <Fab
              disabled={pendingClose || pendingUpdate}
              size={bigScreen ? "medium" : "large"}
              sx={{ margin: 0, boxShadow: 0 }}
              onClick={() => {
                saveProblem(true, false);
              }}
            >
              <Tooltip title="עדכן אל תסגור תקלה">
                <PendingActionsIcon
                  style={{ fontSize: 25, color: "rgba(251, 140, 0, 0.6)" }}
                />
              </Tooltip>
            </Fab>
          )}
          {(!selfProblem.isLocked ||
            (selfProblem.isLocked &&
              (selfProblem.toWorker === user?.workerId ||
                selfProblem.workerCreateId === user?.workerId))) && (
            <Fab
              disabled={pendingClose || pendingUpdate}
              size={bigScreen ? "medium" : "large"}
              sx={{ margin: 0, boxShadow: 0 }}
              onClick={() => {
                saveProblem(true, true);
              }}
            >
              <Tooltip title="עדכן ותסגור את התקלה">
                <LockIcon
                  style={{ fontSize: 25, color: "rgba(56, 142, 60, 0.7)" }}
                />
              </Tooltip>
            </Fab>
          )}
          <Box>
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
    </Box>
  );
}
