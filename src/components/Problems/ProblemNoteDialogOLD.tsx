import * as React from "react";
import "./ProblemNoteDialog.styles.css";
import {
  Box,
  Dialog,
  Button,
  DialogContent,
  Fab,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PhoneIcon from "@mui/icons-material/Phone";
import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
import LockIcon from "@mui/icons-material/Lock";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LoopIcon from "@mui/icons-material/Loop";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useSnackbar } from "notistack";
import { IProblemLog } from "../../Model/IProblemLog";
import { WorkersList } from "../WorkersList/WorkersList";
import { IWorker } from "../../Model/IWorker";
import { api } from "../../API/Api";
import { ISearchProblem } from "../../Model/ISearchProblem";
import { IMAGES_PATH_PROBLEMS, TOKEN_KEY } from "../../Consts/Consts";
import { CrmFile, IProblem, IProblemsResponse } from "../../Model/IProblem";
import { IProblemType } from "../../Model/IProblemType";
import { ProblemHistoryDialog } from "../../Dialogs/ProblemHistory";
import { useConfirm } from "../../Context/useConfirm";
import { useUser } from "../../Context/useUser";

export type Props = {
  fileLoading: boolean;
  setFileLoading: Dispatch<SetStateAction<boolean>>;
  problem: IProblem;
  abortController: AbortController;
  updateProblem: (problem: IProblem) => void;
};

export default function ProblemNoteDialog({
  problem,
  updateProblem,
  abortController,
  fileLoading,
  setFileLoading,
}: Props) {
  const { confirm } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const [fileInput, setFileInput] = useState<string>("");
  const [myProblem, setMyProblem] = React.useState({ ...problem });
  const [fileProgress, setFileProgress] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement | null>();
  const [dragActive, setDragActive] = useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [showHistoryLoading, setShowHistoryLoading] = React.useState(false);
  const [problemsHistory, setProblemsHistory] = React.useState<IProblem[]>([]);
  const {
    user,
    workers,
    updateRefreshProblems,
    updateRefreshProblemCount,
    problemTypes,
  } = useUser();
  const [showLogs, setShowLogs] = React.useState(false);
  const [logs, setLogs] = React.useState<IProblemLog[]>([]);
  // const [toWorkersOptions, setToWorkersOptions] = React.useState<any[]>([]);
  const [myProblemTypes, setMyProblemTypes] = useState<string[]>([]);

  React.useEffect(() => {
    const options: string[] = [];
    if (problem.problemTypesList) {
      problem.problemTypesList.forEach((obj: IProblemType) => {
        options.push(obj.problemTypeName);
      });
    }
    setMyProblemTypes(options);

    // setToWorkersOptions(options);

    api
      .post<IProblemsResponse>("/GetProblemHistorySummery", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        placeId: problem.placeId,
        problemId: problem.id,
      })
      .then(({ data }) => {
        if (!data.d.success) {
          enqueueSnackbar({
            message: `נכשל לעדכן תקלה. ${data.d.msg}`,
            variant: "error",
          });
        } else {
          const updatedProblem = {
            ...problem,
            historySummery: data.d.msg,
            lastSuppoter: data.d.lastSuppoter,
            trackingId: data.d.trackingId,
          };

          setMyProblem(updatedProblem);
        }
      });
  }, [enqueueSnackbar, problem, updateProblem]);

  const onChange = <K extends keyof IProblem>(key: K, val: IProblem[K]) => {
    setMyProblem({ ...myProblem, [key]: val });
  };

  const saveProblem = (close: boolean, closeProblem: boolean) => {
    if (closeProblem) {
      myProblem.statusId = 2;
    } else {
      myProblem.statusId = 0;
    }

    myProblem.workerKey = localStorage.getItem(TOKEN_KEY) || "";

    myProblem.workerCreateName = user?.workerName || "";
    // console.log(myProblem);
    // const options: string[] = [];
    const pTypes = new Map<string, number>();

    problemTypes.map((obj: IProblemType) => {
      return pTypes.set(obj.problemTypeName, obj.id);
    });

    const newPType: IProblemType[] = [];
    myProblemTypes.map((name: string) => {
      const ptId = pTypes.get(name);

      return newPType.push({
        id: ptId as number,
        problemTypeName: name,
        color: "",
      });
    });

    myProblem.problemTypesList = newPType;
    api
      .post<IProblemsResponse>("/UpdateProblem", {
        problem: { ...myProblem, crmFiles: null, newFiles: null },
      })
      .then(({ data }) => {
        if (!data.d.success) {
          enqueueSnackbar({
            message: `נכשל לעדכן תקלה. ${data.d.msg}`,
            variant: "error",
          });
          return;
        }

        setMyProblem({
          ...myProblem,
          id: data.d.problemId || 0,
          files: data.d.filesName,
          newFiles: [],
        });

        updateRefreshProblems(true);
        updateRefreshProblemCount(true);

        if (close) {
          updateProblem(myProblem);
        }
      });
  };

  const showProblemHistory = async () => {
    setShowHistory(true);
    setShowHistoryLoading(true);

    const searchProblem: Partial<ISearchProblem> = {
      place: true,
      daysBack: 90,
      searchValue: myProblem.placeName,
    };

    try {
      const { data } = await api.post("/SearchProblems", {
        search: {
          ...searchProblem,
          key: localStorage.getItem(TOKEN_KEY),
        },
      });
      setProblemsHistory(data.d.problems);
    } catch (error) {
      enqueueSnackbar({
        message: "אופס, משהו השתבש.. נסה שוב",
        variant: "error",
      });
    } finally {
      setShowHistoryLoading(false);
    }
  };

  React.useEffect(() => {
    if (myProblem.newFiles.length) {
      saveProblem(false, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myProblem.newFiles]);

  const toBase64 = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(`${reader.result}`);
      };
      reader.onerror = (error) => reject(error);
    });

  const deleteFile = async (f: string) => {
    setFileInput("");

    if (await confirm("האם אתה בטוח שברצונך למחוק את הקובץ?")) {
      api
        .post("/DeleteFile", {
          fileName: f,
          problemId: myProblem.id,
          workerKey: localStorage.getItem(TOKEN_KEY),
        })
        .then(({ data }) => {
          if (data.d.success) {
            setMyProblem((prevProblem) => ({
              ...prevProblem,
              files: prevProblem.files.filter((i) => i !== f),
            }));
            updateRefreshProblems(true);
          }
        });
    }
  };

  const setEmergency = () => {
    if (myProblem.emergencyId === 0) {
      onChange("emergencyId", 1);
    } else {
      onChange("emergencyId", 0);
    }
  };

  const setTakeCare = () => {
    onChange("takingCare", !myProblem.takingCare);
  };

  const setIsLocked = () => {
    onChange("isLocked", !myProblem.isLocked);
  };

  const toWorkerChanged = (workerId: number) => {
    if (myProblem.toWorker === workerId) {
      return;
    }
    const worker = workers.find((w) => w.Id === workerId);
    if (worker) {
      // SendNewLineBase(
      //   `${user?.workerName} העביר לעובד ${worker.workerName}`,
      //   1
      // );
      onChange("toWorker", workerId);
    }
  };

  const changeDepartmentByToWorker = () => {
    const worker = workers.find((w) => w.Id === myProblem.toWorker);
    if (worker) {
      // SendNewLineBase(
      //   `${user?.workerName} העביר לעובד ${worker.workerName}`,
      //   1
      // );
      onChange("departmentId", worker.departmentId);
    }
  };

  const openRDP = () => {
    if (myProblem && myProblem.ip) {
      try {
        fetch(`http://localhost:5150/api/rdp/192.168.${myProblem.ip}`);
      } catch (error) {
        /* empty */
      }
    }
  };

  const callToThisPhone = (phoneToCall: string) => {
    api
      .post<IProblemsResponse>("/CallThisNumber", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        phone: phoneToCall,
      })
      .then(() => {
        // if (!data.d.success) {
        //   alert("נכשל לחייג לטלפון. " + data.d.msg);
        //   return;
        // }
      });
  };

  function isChangeToWorkerEnable(): boolean {
    if (user?.userType === 1) return true;

    if (!myProblem.isLocked) return true;

    if (
      myProblem.isLocked &&
      (myProblem.toWorker === user?.workerId ||
        myProblem.workerCreateId === user?.workerId)
    )
      return true;

    return false;
  }

  function isLockEnable(): boolean {
    if (user?.userType === 1) return true;

    if (
      !myProblem.isLocked &&
      (myProblem.toWorker === user?.workerId ||
        myProblem.workerCreateId === user?.workerId)
    )
      return true;

    if (
      myProblem.isLocked &&
      (myProblem.toWorker === user?.workerId ||
        myProblem.workerCreateId === user?.workerId)
    )
      return true;

    return false;
  }

  const onShowLogs = (problemId: number) => {
    api
      .post("/GetProblemLogs", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        problemId,
      })
      .then(({ data }) => {
        setLogs(data.d.logs);
        setShowLogs(true);
      });
  };

  const updateProblemTracking = () => {
    api
      .post("/UpdateProblemTracking", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        problemId: myProblem.id,
        trackingId: myProblem.trackingId,
      })
      .then(({ data }) => {
        // console.log(data.d.trackingId);
        onChange("trackingId", data.d.trackingId);
      });
  };

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const {
      target: { value },
    } = event;

    const a: string[] =
      typeof value === "string" ? value.split(",") : (value as string[]);
    a.sort((b: string, c: string) => {
      return b < c ? -1 : 1;
    });
    setMyProblemTypes(a);
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    setDragActive(event.type === "dragenter" || event.type === "dragover");
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
          !(myProblem.files || []).includes(
            `${myProblem.id}_${inputFiles?.[i].name || "file.what"}`
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
            filename: `${isClipboard ? `${Date.now()}_` : ""}${myProblem.id}_${
              filteredFiles?.[i].name || "file.what"
            }`
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
        ...myProblem,
        crmFiles: [...(myProblem.crmFiles || []), ...files],
        files: [
          ...(myProblem.files || []),
          ...(files || []).map((f) => f.filename),
        ],
      };

      try {
        const { data } = await api.post(
          "/UploadProblemFiles",
          {
            problem: updatedProblem,
          },
          {
            signal: abortController.signal,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              setFileProgress(percentCompleted === 100 ? -1 : percentCompleted);
            },
          }
        );

        if (data.d.success) {
          setMyProblem({
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

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setDragActive(event.type === "dragover");

    if (event.dataTransfer.files && event.dataTransfer.files.length === 1) {
      uploadFiles(event.dataTransfer.files);
    }
  };

  const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setFileInput(e.target.value);
    uploadFiles(e.target.files);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) =>
    uploadFiles(e.clipboardData.files, true);

  return (
    <Box
      dir="rtl"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrop}
      onDrop={handleDrop}
    >
      {dragActive && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 128, 255, 0.25)",
            zIndex: 100000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" color="white" fontWeight="bold">
            שחרר קבצים כאן
          </Typography>
        </Box>
      )}
      <div style={{ padding: 0, background: "rgba(213, 213, 213, 0.15)" }}>
        <div
          className="row"
          style={{
            paddingTop: 10,
            paddingRight: 15,
            paddingLeft: 15,
          }}
        >
          <div className="row" style={{ height: 35 }}>
            <div className="col-8">
              <Tooltip title="שם עסק">
                <TextField
                  value={myProblem.placeName}
                  variant="standard"
                  InputProps={{
                    sx: {
                      "::before": {
                        borderBottom: 0,
                      },
                    },
                  }}
                  className="placeName"
                  onChange={(e) => onChange("placeName", e.target.value)}
                />
              </Tooltip>
              {myProblem.vip && (
                <Tooltip title="vip">
                  <StarIcon style={{ color: "goldenrod", fontSize: "30px" }} />
                </Tooltip>
              )}
            </div>
            <div className="col-4">
              <p className="dateTime">
                {`${new Date(myProblem.startTimeEN).getHours()}:${new Date(
                  myProblem.startTimeEN
                ).getMinutes()} ${new Date(myProblem.startTimeEN).getDate()}.${
                  new Date(myProblem.startTimeEN).getMonth() + 1
                }`}
                {/* {myProblem.startTime.toString().replaceAll("/", ".")} */}
              </p>
            </div>
          </div>
          <div className="col-6">
            <Tooltip title="שם לקוח">
              <TextField
                value={myProblem.customerName}
                variant="standard"
                InputProps={{
                  sx: {
                    "::before": {
                      borderBottom: 0,
                    },
                  },
                }}
                className="cusName"
                onChange={(e) => onChange("customerName", e.target.value)}
              />
            </Tooltip>
          </div>
          <div className="col-6">
            <p className="workerCreateName">{myProblem.workerCreateName}</p>
          </div>
        </div>

        <div
          id="divBody"
          className="row"
          style={{
            paddingRight: 15,
            paddingLeft: 15,
            paddingTop: 10,

            background: "#FAFAFA",
            borderRadius: "16px 16px 1px 0px",
            boxShadow: "box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="col-6 right">
            <Tooltip title="IP">
              <TextField
                style={{ width: "110px", marginLeft: 10 }}
                value={myProblem.ip}
                variant="standard"
                InputProps={{
                  sx: {
                    "::before": {
                      borderBottom: 0,
                    },
                  },
                }}
                className="ip"
                onChange={(e) => onChange("ip", e.target.value)}
              />
            </Tooltip>
            <Tooltip title="התחבר ללקוח">
              <IconButton onClick={openRDP}>
                <ConnectedTvIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className="col-6" style={{ textAlign: "left" }}>
            <Tooltip title="החזר למחלקה של המטפל">
              <IconButton onClick={changeDepartmentByToWorker}>
                <LoopIcon />
              </IconButton>
            </Tooltip>
            <Select
              className="department"
              label="מחלקה"
              variant="standard"
              value={myProblem.departmentId}
              style={{ borderBottom: 0, textAlign: "left" }}
              onChange={(e) =>
                onChange("departmentId", parseInt(`${e.target.value}`, 10))
              }
            >
              <MenuItem value="5">איפוסים</MenuItem>
              <MenuItem value="7">הנהלת חשבונות</MenuItem>
              <MenuItem value="2">טכני</MenuItem>
              <MenuItem value="11">יוזרים</MenuItem>
              <MenuItem value="1">כללי</MenuItem>
              <MenuItem value="16">ענן</MenuItem>
              <MenuItem value="10">ציוד</MenuItem>
              <MenuItem value="12">קיוסק</MenuItem>
              <MenuItem value="6">שדרוגים</MenuItem>
              <MenuItem value="8">שיווק</MenuItem>
              <MenuItem value="3">תוכנה</MenuItem>
              <MenuItem value="9">תמיכה</MenuItem>
              <MenuItem value="4">תפריטים</MenuItem>
              <MenuItem value="13">dejavoo</MenuItem>
            </Select>
          </div>
          <div className="col-6">
            <Tooltip title="טלפון">
              <TextField
                style={{ width: "110px", marginLeft: 10 }}
                value={myProblem.phone}
                variant="standard"
                InputProps={{
                  sx: {
                    "::before": {
                      borderBottom: 0,
                    },
                  },
                }}
              />
            </Tooltip>

            <Tooltip title="חייג לטלפון">
              <IconButton
                onClick={() => {
                  callToThisPhone(myProblem.phone);
                }}
              >
                <PhoneIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className="col-6" style={{ textAlign: "left" }}>
            <div
              style={{ display: "flex", flex: "row", justifyContent: "left" }}
            >
              <Tooltip title="החזר לשולח">
                <IconButton
                  onClick={() => toWorkerChanged(myProblem.workerCreateId)}
                  disabled={!isChangeToWorkerEnable()}
                >
                  <LoopIcon />
                </IconButton>
              </Tooltip>
              <Select
                label="להעביר ל"
                className="toWorker"
                variant="standard"
                disabled={!isChangeToWorkerEnable()}
                value={myProblem.toWorker}
                onChange={(e) =>
                  toWorkerChanged(parseInt(`${e.target.value}`, 10))
                }
              >
                {workers &&
                  workers.map((worker: IWorker) => {
                    return (
                      <MenuItem key={worker.Id} value={worker.Id}>
                        {worker.workerName}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
          </div>
        </div>

        <div className="col-12">
          <ProblemTypeMultiSelect
            value={myProblemTypes}
            onChange={handleChange}
          />
        </div>

        <Box className="col-12" sx={{ px: 2 }}>
          <WorkersList
            workersSelected={myProblem.toWorkers || []}
            setWorkersSelected={(selected) => onChange("toWorkers", selected)}
          />
        </Box>

        <div className="row">
          <div
            id="divDesc"
            className="col-6"
            style={{
              position: "relative",
              marginTop: "10px",
              paddingLeft: "5px",
              paddingRight: "15px",
            }}
          >
            <Tooltip title="תיאור תקלה">
              <TextField
                onPasteCapture={handlePaste}
                value={myProblem.desc}
                rows={5}
                multiline
                fullWidth
                className="inputBox desc"
                onChange={(e) => onChange("desc", e.target.value)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  boxShadow: "inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                  borderRadius: "8px",
                }}
              />
            </Tooltip>
            <Tooltip title="דחוף">
              <NotificationsActiveIcon
                onClick={setEmergency}
                style={{
                  position: "absolute",
                  bottom: "7px",
                  left: "25px",
                  color: "red",
                  opacity: myProblem.emergencyId === 0 ? 0.2 : 1,
                }}
              />
            </Tooltip>
            <Tooltip title="בטיפול">
              <AccessTimeIcon
                onClick={setTakeCare}
                style={{
                  position: "absolute",
                  bottom: "7px",
                  left: "55px",
                  color: "orange",
                  opacity: myProblem.takingCare ? 1 : 0.2,
                }}
              />
            </Tooltip>
            <Tooltip title="הצג לוגים">
              <VisibilityIcon
                style={{
                  position: "absolute",
                  bottom: "7px",
                  right: "25px",
                  opacity: 0.6,
                }}
                onClick={() => {
                  if (problem) onShowLogs(problem.id);
                }}
              />
            </Tooltip>

            {isLockEnable() && (
              <Tooltip title="נעול, רק היוצר והעובד שמטפל יכולים לשנות">
                {myProblem.isLocked ? (
                  <LockIcon
                    onClick={setIsLocked}
                    style={{
                      position: "absolute",
                      bottom: "7px",
                      left: "85px",
                      color: "blue",
                      opacity: 1,
                    }}
                  />
                ) : (
                  <LockOpenIcon
                    onClick={setIsLocked}
                    style={{
                      position: "absolute",
                      bottom: "7px",
                      left: "85px",
                      color: "blue",
                      opacity: 0.2,
                    }}
                  />
                )}
              </Tooltip>
            )}
          </div>

          <div
            id="divDesc"
            className="col-6"
            style={{
              marginTop: "10px",
              paddingLeft: "15px",
              paddingRight: "5px",
            }}
          >
            <Tooltip title="תיאור פיתרון">
              <div>
                {/* {myProblem.solution} */}
                <TextField
                  onPasteCapture={handlePaste}
                  value={myProblem.solution}
                  rows={5}
                  multiline
                  fullWidth
                  className="inputBox desc"
                  onChange={(e) => onChange("solution", e.target.value)}
                />
              </div>
            </Tooltip>
          </div>
        </div>
        {/* {showChat && (
          <div id="divChat" className="divChat">
            <div style={{ height: "250px", overflowY: "auto" }}>
              {chatLines &&
                chatLines.map((msg) => {
                  return (
                    <MsgLine
                      workerId={msg.workerId}
                      workerName={msg.workerName}
                      msg={msg.msg}
                      msgType={msg.msgType}
                      workerImgPath={msg.workerImgPath}
                      commitTime={msg.commitTime}
                      commitTimeEN={msg.commitTimeEN}
                    />
                  );
                })}
            </div>
          </div>
        )} */}

        <div className="row">
          <div
            className="col-8"
            style={{
              fontFamily: "Rubik",
              fontSize: "26px",
              offset: "0px, 4px rgba(0, 0, 0, 0.25)",
              paddingRight: "10px",
              marginBottom: "3px",
            }}
          >
            <p
              style={{
                fontWeight: "700",
                margin: "0 !important",
                marginBottom: "0px",
              }}
            >
              {myProblem.historySummery}
            </p>

            <p
              style={{
                fontWeight: "400",
                margin: "0 !important",
                marginBottom: "0px",
              }}
            >
              {myProblem.lastSuppoter}
            </p>

            {myProblem.updaterWorkerName && (
              <p
                style={{
                  fontWeight: "400",
                  margin: "0 !important",
                  marginBottom: "0px",
                }}
              >
                מעדכן אחרון: {myProblem.updaterWorkerName}
              </p>
            )}
          </div>
          <div className="col-4">
            {/* <ProblemTypes problem={myProblem} /> */}
          </div>
        </div>
        <Box sx={{ margin: 2, display: "flex", gap: 1 }}>
          {myProblem.files &&
            [...new Set(myProblem.files)].map((file, index) => {
              return (
                <Box key={`${file}${index}`} sx={{ position: "relative" }}>
                  <a
                    href={IMAGES_PATH_PROBLEMS + file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tooltip title={file}>
                      <img
                        src={IMAGES_PATH_PROBLEMS + file}
                        alt={file}
                        onError={(e) => {
                          e.currentTarget.src = "broken.png";
                        }}
                        style={{
                          backgroundColor: "#0E0E0E",
                          height: 80,
                          width: 142.2,
                          objectFit: "contain",
                          borderRadius: 8,
                        }}
                      />
                    </Tooltip>
                  </a>
                  <IconButton
                    color="info"
                    sx={{
                      zIndex: 1000,
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                    }}
                    onClick={() => {
                      deleteFile(file);
                    }}
                  >
                    <Tooltip title="מחק קובץ">
                      <DeleteIcon />
                    </Tooltip>
                  </IconButton>
                </Box>
              );
            })}
        </Box>
        <input
          type="file"
          multiple
          value={fileInput}
          ref={(r) => {
            fileInputRef.current = r;
          }}
          style={{ display: "none" }}
          onChange={handleUploadFile}
        />

        {fileLoading && (
          <LinearProgress
            variant={fileProgress < 0 ? "indeterminate" : "determinate"}
            value={fileProgress}
          />
        )}

        <div
          id="divFooter"
          className="row"
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingTop: 10,
            background: "white",
            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.05)",
            borderRadius: "0px 0px 16px 16px",
          }}
        >
          <div className="col-1">
            <Tooltip title="צרף קבצים">
              <Fab
                disabled={fileLoading}
                sx={{ margin: 0, boxShadow: 0 }}
                size="medium"
                onClick={() => fileInputRef.current?.click()}
              >
                <div>
                  <AttachFileIcon
                    style={{ fontSize: 25, color: "rgba(251, 50, 0, 0.6)" }}
                  />
                </div>
              </Fab>
            </Tooltip>
          </div>
          <div className="col-1">
            <Fab
              onClick={showProblemHistory}
              sx={{ margin: 0, boxShadow: 0 }}
              size="medium"
            >
              <Tooltip title="הצג הסטוריה">
                <HistoryIcon style={{ fontSize: 25, color: "black" }} />
              </Tooltip>
            </Fab>
          </div>

          <div className="col-7" style={{ textAlign: "left" }}>
            <Fab
              onClick={updateProblemTracking}
              sx={{ margin: 0, boxShadow: 0 }}
              size="medium"
            >
              <Tooltip title="תחת מעקב">
                <GpsFixedIcon
                  style={{
                    fontSize: 25,
                    color: "red",
                    opacity: myProblem.trackingId > 0 ? "1" : "0.1",
                  }}
                />
              </Tooltip>
            </Fab>
          </div>
          <div className="col-1" style={{ textAlign: "left" }}>
            <Fab
              size="medium"
              sx={{ margin: 0, boxShadow: 0 }}
              onClick={() => {
                onChange("callCustomerBack", !myProblem.callCustomerBack);
              }}
            >
              <Tooltip title="חזור ללקוח">
                <ContactPhoneIcon
                  style={{
                    fontSize: 25,
                    color: "blue",
                    opacity: myProblem.callCustomerBack ? "1" : "0.1",
                  }}
                />
              </Tooltip>
            </Fab>
          </div>

          <div className="col-1" style={{ textAlign: "left" }}>
            {myProblem &&
              (!myProblem.isLocked ||
                user?.userType === 1 ||
                (myProblem.isLocked &&
                  (myProblem.toWorker === user?.workerId ||
                    myProblem.workerCreateId === user?.workerId))) && (
                <Fab
                  disabled={fileLoading}
                  size="medium"
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
          </div>

          {/* לא נעולנעול אבל אני העובד שפתח/ העובד שזה עליו */}
          <div className="col-1 left">
            {myProblem &&
              (!myProblem.isLocked ||
                (myProblem.isLocked &&
                  (myProblem.toWorker === user?.workerId ||
                    myProblem.workerCreateId === user?.workerId))) && (
                <Fab
                  disabled={fileLoading}
                  size="medium"
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
          </div>
        </div>
      </div>

      {/* {showHistory && problemsHistory && (
        <ProblemHistory
          historyProblems={problemsHistory}
          hideHistory={hideHistory}
        />
      )} */}
      <ProblemHistoryDialog
        onClose={() => setShowHistory(false)}
        open={showHistory}
        loading={showHistoryLoading}
        onShowLogs={onShowLogs}
        problem={problem}
        problemsHistory={problemsHistory}
      />

      <Dialog
        dir="rtl"
        sx={{ textAlign: "right" }}
        fullWidth
        onClose={() => setShowLogs(false)}
        maxWidth="lg"
        open={showLogs}
      >
        <DialogContent>
          <div>
            <div className="row">
              <div className="col-2">עובד מעדכן</div>
              <div className="col-2">שם השדה</div>
              <div className="col-3">ערך ישן</div>
              <div className="col-3">ערך חדש</div>
              <div className="col-2">תאריך</div>
              {logs &&
                logs.map((log: IProblemLog) => {
                  return (
                    <div
                      key={log.commitTime}
                      className="row"
                      style={{ border: "1px black solid" }}
                    >
                      <div className="col-2">{log.workerName}</div>
                      <div className="col-2">{log.fieldName}</div>
                      <div className="col-3">{log.oldValue}</div>
                      <div className="col-3">{log.newValue}</div>
                      <div className="col-2">{log.commitTime}</div>
                    </div>
                  );
                })}
            </div>
            <div style={{ textAlign: "center" }}>
              <Button variant="contained" onClick={() => setShowLogs(false)}>
                סגור
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
