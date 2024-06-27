import {
  Collapse,
  Dialog,
  DialogContent,
  Slide,
  useMediaQuery,
  useTheme,
  Box,
  CircularProgress,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { TransitionProps } from "@mui/material/transitions";
import { SetStateAction, forwardRef, useEffect, useState, useRef } from "react";
import { TransitionGroup } from "react-transition-group";
import { PlaceInfoDialog } from "../PlaceInfoDialog";
import {
  IProblem,
  IPlace,
  IDepartment,
  IMsgLine,
  CrmFile,
  IProblemLog,
  ISearchProblem,
  IProblemType,
} from "../../Model";
import { useUser } from "../../Context/useUser";
import { ProblemAlert } from "../../components/Problems/ProblemAlert";
import ProblemInfo from "./ProblemDialogInfo";
import ProblemActions from "./ProblemDialogActions";
import { fileService, problemService, workerService } from "../../API/services";
import { validateIp } from "../../helpers/ipValidate";
import { callService } from "../../API/services/callService";
import { AxiosProgressEvent } from "axios";
import { useSnackbar } from "notistack";
import { useConfirm } from "../../Context/useConfirm";
import { ProblemHistoryDialog } from "../ProblemHistory";
import ProblemLogsDialog from "../ProblemLogsDialog";
import { toBase64 } from "../../helpers/toBase64";
import FilesDialog from "../FilesDialog";
import DragActiveLayer from "./DragActiveLayer";
import ProblemDialogHeader from "./ProblemDialogHeader";

export type ProblemDialogProps = {
  open: boolean;
  onClose: () => void;
  problem: IProblem;
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

  const [loading, setLoading] = useState(false);
  const [selfProblem, setSelfProblem] = useState<IProblem>(problem);
  const [placeDialogOpen, setPlaceDialogOpen] = useState(false);
  const [placeDialog, setPlaceDialog] = useState<IPlace | null>(null);
  const [workerDepartments, setWorkerDepartments] = useState<IDepartment[]>([]);
  const [messages, setMessages] = useState<IMsgLine[]>([]);
  const [currentProblemTypesId, setCurrentProblemTypesId] = useState<
    number[] | undefined
  >([]);
  const [problemIp, setProblemIp] = useState(selfProblem.ip);
  const [tracking, setTracking] = useState<{
    historySummery: string;
    lastSupporter: string;
    trackingId: number;
  } | null>(null);
  const [callDisabled, setCallDisabled] = useState(!selfProblem.phone);
  const [logs, setLogs] = useState<IProblemLog[]>([]);
  const [fileProgress, setFileProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileInput, setFileInput] = useState<string>("");
  const [fileLoading, setFileLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHistoryLoading, setShowHistoryLoading] = useState(false);
  const [problemsHistory, setProblemsHistory] = useState<IProblem[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [openFilesDialog, setOpenFilesDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>();
  const abortController = useRef(new AbortController());

  const { confirm } = useConfirm();
  const {
    updateRefreshProblems,
    user,
    workers,
    problemTypes,
    updateDepartments,
  } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const onOpenFilesDialog = () => {
    if (!openFilesDialog) setOpenFilesDialog(true);
  };

  const onCloseFilesDialog = () => {
    if (openFilesDialog) setOpenFilesDialog(false);
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    setDragActive(event.type === "dragenter" || event.type === "dragover");
  };

  const deleteFile = async (f: string) => {
    setFileInput("");
    if (await confirm("האם אתה בטוח שברצונך למחוק את הקובץ?")) {
      try {
        const data = await fileService.deleteFile(f, selfProblem.id);
        if (data?.d.success) {
          setSelfProblem((prevProblem) => ({
            ...prevProblem,
            files: prevProblem.files.filter((i) => i !== f),
          }));
          updateRefreshProblems(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const uploadFiles = async (
    inputFiles: FileList | null,
    isClipboard = false
  ) => {
    if (inputFiles) {
      const promises: Promise<CrmFile>[] = [];
      const filteredFiles: File[] = [];

      for (let i = 0; i < inputFiles.length; i += 1) {
        if (
          isClipboard ||
          !(selfProblem.files || []).includes(
            `${selfProblem.id}_${inputFiles?.[i].name || "file.what"}`
              .replaceAll("-", "_")
              .replaceAll(" ", "_")
          )
        ) {
          filteredFiles.push(inputFiles?.[i]);
        } else {
          enqueueSnackbar(`הקובץ הזה כבר עלה ${inputFiles?.[i].name}`);
        }
      }

      for (let i = 0; i < filteredFiles.length; i += 1) {
        promises.push(
          toBase64(filteredFiles[i]).then((base64) => ({
            filename: `${isClipboard ? `${Date.now()}_` : ""}${
              selfProblem.id
            }_${filteredFiles?.[i].name || "file.what"}`
              .replaceAll("-", "_")
              .replaceAll(" ", "_"),
            content: base64,
          }))
        );
      }

      if (promises.length === 0) {
        setFileInput("");
        return;
      }

      setFileLoading(true);
      const files = await Promise.all(promises);

      const updatedProblem = {
        ...selfProblem,
        crmFiles: [...(selfProblem.crmFiles || []), ...files],
        files: [
          ...(selfProblem.files || []),
          ...(files || []).map((f) => f.filename),
        ],
      };

      try {
        const data = await fileService.uploadFiles(updatedProblem, {
          //@ts-ignore
          signal: abortController.signal,
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setFileProgress(percentCompleted === 100 ? -1 : percentCompleted);
          },
        });
        if (data?.d.success) {
          setSelfProblem({
            ...updatedProblem,
            files: [...new Set(data.d.filesName as string[])],
          });
        }
      } catch (error) {
        enqueueSnackbar({
          message: `נכשל לטעון קבצים.`,
          variant: "error",
        });
      } finally {
        setFileLoading(false);
        updateRefreshProblems(true);
      }
    }
  };

  // useEffect(() => {
  //   updateProblem(selfProblem);
  // }, [selfProblem.files]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setDragActive(event.type === "dragover");

    if (event.dataTransfer.files && event.dataTransfer.files.length === 1) {
      uploadFiles(event.dataTransfer.files);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileInput(e.target.value);
    uploadFiles(e.target.files);
  };

  const callClientPhone = async () => {
    if (!selfProblem?.phone) {
      enqueueSnackbar({
        variant: "error",
        message: "מספר טלפון ריק",
      });
      return;
    }
    setCallDisabled(true);
    try {
      const data = await callService.callClientPhone(selfProblem.phone);
      if (!data?.d.success) {
        enqueueSnackbar({
          variant: "error",
          message: data?.d.msg,
        });
      } else {
        enqueueSnackbar({
          variant: "success",
          message: "מתקשר ללקוח...",
        });
      }
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          variant: "error",
          message: error.message,
        });
    } finally {
      setCallDisabled(false);
    }
  };

  const showProblemHistory = async () => {
    setShowHistory(true);
    setShowHistoryLoading(true);

    const searchProblem: Partial<ISearchProblem> = {
      place: true,
      daysBack: 90,
      searchValue: selfProblem.placeName,
    };

    try {
      const data = await problemService.searchProblems(searchProblem);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
      } else {
        setProblemsHistory(data.d.problems);
      }
    } catch (error) {
      enqueueSnackbar({
        message: "אופס, משהו השתבש.. נסה שוב",
        variant: "error",
      });
    } finally {
      setShowHistoryLoading(false);
    }
  };

  const handleProblemIpChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const problemIp = event.currentTarget.value;
    if ((!problemIp && problemIp !== "") || !validateIp(problemIp)) return;
    setProblemIp(problemIp);
  };

  useEffect(() => {
    //if (problemIp) onChange("ip", problemIp);
  }, [problemIp]);

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
      onChange("problemTypesList", value as number[]);
    }
  };

  const onChange = <K extends keyof IProblem>(
    key: K,
    val: IProblem[K] | number[]
  ) => {
    if (!selfProblem) return;
    if (
      key === "toWorker" &&
      val !== selfProblem.toWorker &&
      workers.find((w) => w.Id === val)
    ) {
      setSelfProblem({
        ...selfProblem,
        [key]: val,
      });
      return;
    }
    if (key === "problemTypesList") {
      const copyOfVal: number[] = val as number[];
      if (copyOfVal && copyOfVal.length > 0) {
        const newProblemTypes: IProblemType[] = [];

        copyOfVal.forEach((id: number) => {
          const newPt = problemTypes.find((pt) => pt.id === id);
          if (newPt) newProblemTypes.push(newPt);
        });
        setSelfProblem({ ...selfProblem, problemTypesList: newProblemTypes });
        return;
      }
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
          setTracking({ ...tracking, trackingId: data.d.trackingId });
          refreshDepartments();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  function isLockEnable(): boolean {
    if (user?.userType === 1) return true;

    if (
      !selfProblem.isLocked &&
      (selfProblem.toWorker === user?.workerId ||
        selfProblem.workerCreateId === user?.workerId)
    )
      return true;

    if (
      selfProblem.isLocked &&
      (selfProblem.toWorker === user?.workerId ||
        selfProblem.workerCreateId === user?.workerId)
    )
      return true;

    return false;
  }

  const setEmergency = () => {
    if (selfProblem.emergencyId === 0) {
      onChange("emergencyId", 1);
    } else {
      onChange("emergencyId", 0);
    }
  };

  const setTakeCare = () => {
    onChange("takingCare", !selfProblem.takingCare);
  };

  const setIsLocked = () => {
    onChange("isLocked", !selfProblem.isLocked);
  };

  const openEditPlace = () => {
    if (!selfProblem) return;

    setPlaceDialog({
      cusName: selfProblem.customerName,
      bizNumber: "0",
      phone: selfProblem.phone,
      placeName: selfProblem.placeName,
      phoneId: selfProblem.phoneId,
      placeId: selfProblem.placeId,
      remark: "",
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
      placeId: place.placeId,
      customerName: place.cusName,
      phone: place.phone,
      phoneId: place.phoneId,
      placeName: place.placeName,
      vip: place.vip,
      remark: place.remark,
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

  const fetchProblemHistorySummary = async () => {
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
  };

  const onShowLogs = async (problemId: number) => {
    try {
      const data = await problemService.getProblemLogs(problemId);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
      } else {
        setLogs(data.d.logs);
        setShowLogs(true);
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

  const fetchDepartments = async () => {
    if (user)
      try {
        const data = await workerService.getWorkerDepartments(user?.workerId);

        if (data?.d.success) {
          setWorkerDepartments(data.d.workerDepartments);
        }
      } catch (error) {
        console.error(error);
      }
  };
  const setCallCustomerBack = () => {
    onChange("callCustomerBack", !selfProblem.callCustomerBack);
  };

  useEffect(() => {
    setLoading(true);
    fetchProblemHistorySummary();
    fetchDepartments();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const refreshDepartments = async () => {
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
    setCurrentProblemTypesId(selfProblem?.problemTypesList.map((pt) => pt.id));
  }, [selfProblem]);

  const dialogPaperStyle = {
    minWidth: bigScreen ? "1000px" : isMobile ? "" : "600px",
    height: isMobile ? "" : "800px",
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
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrop}
      onDrop={handleDrop}
    >
      {dragActive && <DragActiveLayer />}
      <ProblemDialogHeader
        customerName={selfProblem.customerName}
        onClose={onClose}
        openEditPlace={openEditPlace}
        phone={selfProblem.phone}
        placeName={selfProblem.placeName}
        startTimeEN={selfProblem.startTimeEN}
        workerCreateName={selfProblem.workerCreateName}
      />
      <DialogContent id="content" sx={{ p: 2 }}>
        <TransitionGroup sx={{ position: "relative" }}>
          {tracking?.historySummery && tracking.lastSupporter && (
            <Collapse>
              <ProblemAlert
                historysummery={tracking?.historySummery}
                lastsupporter={tracking?.lastSupporter}
              />
            </Collapse>
          )}
          {loading ? (
            <CircularProgress
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ) : (
            selfProblem &&
            tracking &&
            problemTypes && (
              <>
                <ProblemInfo
                  callClientPhone={callClientPhone}
                  onOpenFilesDialog={onOpenFilesDialog}
                  setCallCustomerBack={setCallCustomerBack}
                  isLockEnable={isLockEnable()}
                  setEmergency={setEmergency}
                  setIsLocked={setIsLocked}
                  setTakeCare={setTakeCare}
                  bigScreen={bigScreen}
                  onIpChange={handleProblemIpChange}
                  problemIp={problemIp}
                  messages={messages}
                  refreshMessages={refreshMessages}
                  currentProblemTypesId={currentProblemTypesId}
                  handleProblemTypesChange={handleProblemTypesChange}
                  isChangeToWorkerEnable={isChangeToWorkerEnable}
                  onChange={onChange}
                  problemTypes={problemTypes}
                  selfProblem={selfProblem}
                  workerDepartments={workerDepartments}
                  workers={workers}
                  deleteFile={deleteFile}
                  fileInput={fileInput}
                  fileLoading={fileLoading}
                  fileProgress={fileProgress}
                  files={selfProblem.files}
                  handleUploadFile={handleUploadFile}
                  fileInputRef={fileInputRef}
                  callDisabled={callDisabled}
                />
                <ProblemActions
                  bigScreen={bigScreen}
                  showProblemHistory={showProblemHistory}
                  refreshDepartments={refreshDepartments}
                  trackingId={tracking?.trackingId}
                  onDialogClose={onClose}
                  user={user}
                  currentProblemTypesId={currentProblemTypesId}
                  problem={selfProblem}
                  problemTypes={problemTypes}
                  setSelfProblemDialog={setSelfProblem}
                  updateProblem={updateProblem}
                  updateProblemTracking={updateProblemTracking}
                />
              </>
            )
          )}
        </TransitionGroup>
      </DialogContent>
      <PlaceInfoDialog
        key={placeDialog?.placeId}
        onClose={onClosePlaceEdit}
        open={placeDialogOpen}
        place={placeDialog}
        onPlaceUpdate={handlePlaceUpdate}
      />
      <ProblemHistoryDialog
        onClose={() => setShowHistory(false)}
        open={showHistory}
        loading={showHistoryLoading}
        onShowLogs={onShowLogs}
        problem={problem}
        problemsHistory={problemsHistory}
      />
      <ProblemLogsDialog
        logs={logs}
        onClose={() => setShowLogs(false)}
        showLogs={showLogs}
      />
      {selfProblem.files && !bigScreen && (
        <FilesDialog
          bigScreen={bigScreen}
          deleteFile={deleteFile}
          files={selfProblem.files}
          isMobile={isMobile}
          onClose={onCloseFilesDialog}
          open={openFilesDialog}
        />
      )}
    </Dialog>
  );
}
