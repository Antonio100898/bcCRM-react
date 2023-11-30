import {
  AppBar,
  Box,
  Collapse,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { TransitionProps } from "@mui/material/transitions";
import {
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import dayjs from "dayjs";
import { TransitionGroup } from "react-transition-group";
import { PlaceInfoDialog } from "./PlaceInfoDialog";
import { IProblem, IPlace, IDepartment, IMsgLine } from "../Model";
import { useUser } from "../Context/useUser";
import { ProblemAlert } from "../components/Problems/ProblemAlert";
import ProblemInfo from "../components/ProblemInfo";
import ProblemActions from "../components/ProblemActions";
import { problemService, workerService } from "../API/services";

export type ProblemDialogProps = {
  open: boolean;
  onClose: () => void;
  problem: IProblem | null;
  updateProblem: (value: IProblem) => void;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return <Slide direction={isMobile ? "right" : "up"} ref={ref} {...props} />;
});

export function ProblemDialog({
  onClose,
  open,
  problem,
  updateProblem,
}: ProblemDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const bigScreen = useMediaQuery("(min-width: 1200px)");
  const { user, workers, problemTypes, updateDepartments } = useUser();

  const [selfProblem, setSelfProblem] = useState<IProblem | null>(problem);
  const [placeDialogOpen, setPlaceDialogOpen] = useState(false);
  const [placeDialog, setPlaceDialog] = useState<IPlace | null>(null);
  const [workerDepartments, setWorkerDepartments] = useState<IDepartment[]>([]);
  const [messages, setMessages] = useState<IMsgLine[]>([]);
  const [currentProblemTypesId, setCurrentProblemTypesId] = useState<
    number[] | undefined
  >([]);

  const [tracking, setTracking] = useState<{
    historySummery: string;
    lastSupporter: string;
    trackingId: number;
  } | null>(null);

  const refreshMessages = async () => {
    if (selfProblem?.id) {
      try {
        const data = await problemService.getProblemMessages(selfProblem.id);

        if (data?.d.success) setMessages(data.d.msgLines);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleProblemTypesChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    if (value) {
      setCurrentProblemTypesId(value as SetStateAction<number[] | undefined>);
    }
  };

  const onChange = <K extends keyof IProblem>(key: K, val: IProblem[K]) => {
    if (!selfProblem) return;
    if (
      key === "toWorker" &&
      val !== selfProblem.toWorker &&
      workers.find((w) => w.Id === val)
    ) {
      setSelfProblem({ ...selfProblem, [key]: val });
      return;
    }

    setSelfProblem({ ...selfProblem, [key]: val });
  };

  const updateProblemTracking = async () => {
    if (selfProblem && tracking) {
      try {
        const data = await problemService.updateProblemTracking(
          selfProblem.id,
          tracking.trackingId
        );
        if (data?.d.success) {
          onChange("trackingId", data.d.trackingId);
          if (tracking?.historySummery) {
            setTracking({
              ...tracking,
              trackingId: data.d.trackingId,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openEditPlace = () => {
    if (!selfProblem) return;

    setPlaceDialog({
      id: selfProblem.placeId,
      customerName: selfProblem.customerName,
      bizNumber: "0",
      phone: selfProblem.phone,
      placeName: selfProblem.placeName,
      phoneId: selfProblem.phoneId,
      placeId: selfProblem.placeId,
      placeRemark: "",
      vip: selfProblem.vip,
      warrantyType: 0,
    });
    setPlaceDialogOpen(true);
  };

  const onClosePlaceEdit = () => {
    setPlaceDialogOpen(false);
    setPlaceDialog(null);
  };

  const handlePlaceUpdate = (place: IPlace) => {
    setSelfProblem((prev) => ({
      ...prev!,
      placeId: place.id,
      customerName: place.customerName,
      phone: place.phone,
      phoneId: place.phoneId,
      placeName: place.placeName,
      vip: place.vip,
    }));
  };

  const isChangeToWorkerEnable = (): boolean => {
    if (!selfProblem) return false;

    if (user?.userType === 1) return true;

    if (!selfProblem.isLocked) return true;

    if (
      selfProblem.isLocked &&
      (selfProblem.toWorker === user?.workerId ||
        selfProblem.workerCreateId === user?.workerId)
    )
      return true;

    return false;
  };

  const fetchProblemHistorySummary = useCallback(async () => {
    if (!selfProblem) return;
    try {
      const data = await problemService.getProblemHistorySummery(
        selfProblem.placeId,
        selfProblem.id
      );
      if (data?.d.success) {
        setTracking({
          historySummery: data.d.msg,
          lastSupporter: data.d.lastSuppoter,
          trackingId: data.d.trackingId,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [selfProblem]);

  const fetchDepartments = useCallback(async () => {
    if (user)
      try {
        const data = await workerService.getWorkerDepartments(user?.workerId);

        if (data?.d.success) {
          setWorkerDepartments(data.d.workerDepartments);
        }
      } catch (error) {
        console.error(error);
      }
  }, [user]);

  useEffect(() => {
    fetchProblemHistorySummary();
    fetchDepartments();
  }, [fetchDepartments, fetchProblemHistorySummary]);

  const fetchProblemSummary = async () => {
    try {
      const data = await problemService.getProblemSummary();
      if (data?.d.success) {
        updateDepartments(data.d.summery.departments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProblemSummary();
  }, [selfProblem]);

  useEffect(() => {
    setCurrentProblemTypesId(selfProblem?.problemTypesList.map((pt) => pt.id));
  }, [selfProblem]);

  const dialogPaperStyle = {
    maxWidth: bigScreen ? "1000px" : "600px",
    width: bigScreen ? "1000px" : "",
  };

  return (
    <Dialog
      fullScreen={isMobile}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        style: dialogPaperStyle,
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              ml: 2,
              flex: 1,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="h6"
                component="div"
                lineHeight={1}
                fontWeight="bold"
              >
                {selfProblem?.placeName}
              </Typography>
              <IconButton size="small" onClick={openEditPlace}>
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: bigScreen ? "flex-start" : "space-between",
                gap: 5,
              }}
            >
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selfProblem?.customerName && (
                  <Typography variant="body1">
                    {selfProblem.customerName}
                  </Typography>
                )}
                {selfProblem?.startTimeEN && (
                  <Typography variant="body1">
                    {dayjs(selfProblem.startTimeEN).format("HH:mm DD/MM")}
                  </Typography>
                )}
              </Box>
              <Box sx={{ marginLeft: 1 }}>
                {selfProblem?.phone && (
                  <Typography variant="body1">{selfProblem.phone}</Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 2 }}>
        <TransitionGroup sx={{ position: "relative" }}>
          {tracking !== null && (
            <Collapse>
              <ProblemAlert key={tracking.lastSupporter} {...tracking} />
            </Collapse>
          )}
          {selfProblem && (
            <>
              <ProblemInfo
                messages={messages}
                refreshMessages={refreshMessages}
                setMessages={setMessages}
                currentProblemTypesId={currentProblemTypesId}
                handleProblemTypesChange={handleProblemTypesChange}
                isChangeToWorkerEnable={isChangeToWorkerEnable}
                onChange={onChange}
                problemTypes={problemTypes}
                selfProblem={selfProblem}
                workerDepartments={workerDepartments}
                workers={workers}
                setSelfProblem={setSelfProblem}
              />
              <ProblemActions
                setTracking={setTracking}
                onDialogClose={onClose}
                user={user}
                currentProblemTypesId={currentProblemTypesId}
                problem={selfProblem}
                problemTypes={problemTypes}
                setSelfProblemDialog={setSelfProblem}
                updateProblem={updateProblem}
                updateProblemTracking={updateProblemTracking}
                trackingId={tracking?.trackingId}
              />
            </>
          )}
        </TransitionGroup>
      </DialogContent>
      <PlaceInfoDialog
        key={placeDialog?.phoneId}
        onClose={onClosePlaceEdit}
        open={placeDialogOpen}
        place={placeDialog}
        onPlaceUpdate={handlePlaceUpdate}
      />
    </Dialog>
  );
}
