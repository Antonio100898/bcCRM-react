import {
  Box,
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  Avatar,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import {
  IDepartment,
  IWorker,
  IProblem,
  IProblemType,
  IMsgLine,
} from "../../Model";
import FormInputWrapper from "../../components/BaseCompnents/FormInputWrapper";
import ProblemFiles from "./ProblemDialogFiles";
import { useState, useEffect } from "react";
import CustomCollapseTrigger from "../../components/CustomCollapseTrigger/CustomCollapse";
import { useUser } from "../../Context/useUser";
import ProblemMessages from "./ProblemMessages";
import CallIcon from "@mui/icons-material/Call";
import ProblemStatuses from "./ProblemStatuses";
import CustomMultilineInput from "../../components/CustomInput/CustomMultilineInput";
import CustomInput from "../../components/customInput/customInput";
import LoopIcon from "@mui/icons-material/Loop";

type Props = {
  onChange: <K extends keyof IProblem>(key: K, val: IProblem[K]) => void;
  workerDepartments: IDepartment[];
  isChangeToWorkerEnable: () => boolean;
  selfProblem: IProblem;
  currentProblemTypesId: number[] | undefined;
  handleProblemTypesChange: (event: SelectChangeEvent<number[]>) => void;
  problemTypes: IProblemType[];
  workers: IWorker[];
  messages: IMsgLine[];
  refreshMessages: () => Promise<void>;
  onIpChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  problemIp: string | undefined;
  fileInput: string;
  handleUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileLoading: boolean;
  files: string[];
  deleteFile: (f: string) => Promise<void>;
  fileProgress: number;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null | undefined>;
  bigScreen: boolean;
  isLockEnable: boolean;
  setEmergency: () => void;
  setIsLocked: () => void;
  setTakeCare: () => void;
  setCallCustomerBack: () => void;
  onOpenFilesDialog: () => void;
  callDisabled: boolean;
  callClientPhone: () => Promise<void>;
  isMobile: boolean;
  onReturnToSender: () => void;
};

export default function ProblemDialogInfo({
  currentProblemTypesId,
  handleProblemTypesChange,
  isChangeToWorkerEnable,
  onChange,
  problemTypes,
  selfProblem,
  workerDepartments,
  workers,
  messages,
  refreshMessages,
  onIpChange,
  problemIp,
  deleteFile,
  fileInput,
  fileLoading,
  fileProgress,
  files,
  handleUploadFile,
  fileInputRef,
  bigScreen,
  onOpenFilesDialog,
  callClientPhone,
  callDisabled,
  isMobile,
  setEmergency,
  setIsLocked,
  setTakeCare,
  setCallCustomerBack,
  isLockEnable,
  onReturnToSender,
}: Props) {
  const [openMessagesCollapse, setOpenMessagesCollapse] = useState(false);
  const [openFilesCollapse, setOpenFilesCollapse] = useState(false);

  const { user } = useUser();

  const handleOpenFilesCollapse = () => {
    setOpenFilesCollapse(!openFilesCollapse);
  };

  const handleMessagesCollapse = () => {
    setOpenMessagesCollapse(!openMessagesCollapse);
  };

  useEffect(() => {
    if (openMessagesCollapse)
      setTimeout(() => {
        document.getElementById("bottom-of-messages")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 500);
  }, [openMessagesCollapse]);

  return (
    <Box sx={{ marginBottom: 6 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <Box
            sx={{
              flex: isMobile ? 1 : undefined,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {selfProblem.phone && (
              <Stack direction="row" alignItems="center" gap={1}>
                <IconButton disabled={callDisabled} onClick={callClientPhone}>
                  <CallIcon />
                </IconButton>

                <Typography component="span" variant="h6">
                  {selfProblem.phone}
                </Typography>
              </Stack>
            )}
            {user?.workerType !== 0 && (
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                sx={{ ml: 1.5 }}
              >
                <Typography fontWeight="700">IP</Typography>
                <CustomInput
                  onChange={onIpChange}
                  value={problemIp}
                  InputProps={{
                    sx: {
                      "& .MuiOutlinedInput-input": {
                        p: 1,
                      },
                    },
                  }}
                />
              </Stack>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: isMobile ? 1 : undefined,
              width: isMobile ? "50%" : "450px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <FormInputWrapper label="מחלקה">
                <Select
                  fullWidth
                  variant="outlined"
                  value={selfProblem?.departmentId}
                  onChange={(e) =>
                    onChange("departmentId", parseInt(`${e.target.value}`, 10))
                  }
                >
                  {workerDepartments?.map((d) => {
                    return (
                      <MenuItem value={d.id} key={d.id}>
                        {d.departmentName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormInputWrapper>
              <FormInputWrapper label="עובד מטפל">
                <Select
                  fullWidth
                  variant="outlined"
                  disabled={!isChangeToWorkerEnable()}
                  value={selfProblem?.toWorker}
                  onChange={(e) =>
                    onChange("toWorker", parseInt(`${e.target.value}`, 10))
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
              </FormInputWrapper>
              <IconButton onClick={onReturnToSender} sx={{ alignSelf: "end" }}>
                <LoopIcon />
              </IconButton>
            </Box>
            {!isMobile && (
              <div style={{ marginTop: "1rem", marginLeft:  "3rem"}}>
                <ProblemStatuses
                  bigScreen={bigScreen}
                  setCallCustomerBack={setCallCustomerBack}
                  callCustomerBack={selfProblem.callCustomerBack}
                  emergencyId={selfProblem.emergencyId}
                  isLockEnable={isLockEnable}
                  isLocked={selfProblem.isLocked}
                  setEmergency={setEmergency}
                  setIsLocked={setIsLocked}
                  setTakeCare={setTakeCare}
                  takingCare={selfProblem.takingCare}
                />
              </div>
            )}
          </Box>
        </Stack>

        <FormInputWrapper label="תיוגים">
          <Select
            multiple
            value={currentProblemTypesId}
            onChange={handleProblemTypesChange}
            input={<OutlinedInput label="Chip" />}
            sx={{ position: "relative" }}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              PaperProps: {
                sx: {
                  minWidth: "max-content !important",
                },
              },
            }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    sx={{
                      m: "3px",
                      borderColor: problemTypes.find((p) => p.id === value)!
                        .color,
                    }}
                    label={
                      problemTypes.find((e) => e.id === value)?.problemTypeName
                    }
                    size="small"
                    variant="outlined"
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor: problemTypes.find((e) => e.id === value)
                            ?.color,
                        }}
                        style={{
                          marginRight: "5px",
                        }}
                      >
                        {" "}
                      </Avatar>
                    }
                  />
                ))}
              </Box>
            )}
          >
            {problemTypes &&
              problemTypes.map((problemType: IProblemType) => {
                return (
                  <MenuItem key={problemType.id} value={problemType.id}>
                    {problemType.problemTypeName}
                  </MenuItem>
                );
              })}
          </Select>
        </FormInputWrapper>
        <Stack
          sx={{
            display: "flex",
            flexDirection: bigScreen ? "row" : "column",
            width: "100%",
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, width: "100%" }}>
            <FormInputWrapper label="תיאור תקלה">
              <CustomMultilineInput
                onChange={(e) => onChange("desc", e.target.value)}
                fullWidth
                multiline
                type="text"
                value={selfProblem?.desc}
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "200px",
                    alignItems: "flex-start",
                  },
                }}
              />
            </FormInputWrapper>
          </Box>
          <Box sx={{ flex: 1, width: "100%" }}>
            <FormInputWrapper label="תיאור פתרון">
              <CustomMultilineInput
                onChange={(e) => onChange("solution", e.target.value)}
                fullWidth
                multiline
                type="text"
                value={selfProblem?.solution}
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "200px",
                    alignItems: "flex-start",
                  },
                }}
              />
            </FormInputWrapper>
          </Box>
        </Stack>

        <CustomCollapseTrigger
          counter={selfProblem.files?.length || 0}
          open={openFilesCollapse}
          label="קבצים"
          onHandleValueClick={handleOpenFilesCollapse}
        >
          <ProblemFiles
            onOpenFilesDialog={onOpenFilesDialog}
            bigScreen={bigScreen}
            fileInputRef={fileInputRef}
            deleteFile={deleteFile}
            fileInput={fileInput}
            fileLoading={fileLoading}
            fileProgress={fileProgress}
            files={files}
            handleUploadFile={handleUploadFile}
          />
        </CustomCollapseTrigger>

        <CustomCollapseTrigger
          counter={messages?.length || 0}
          open={openMessagesCollapse}
          label="הודעות"
          onHandleValueClick={handleMessagesCollapse}
        >
          <Box id="messages" sx={{ display: "flex", width: "100%" }}>
            <ProblemMessages
              refreshMessages={refreshMessages}
              messages={messages}
              problemId={selfProblem.id}
            />
          </Box>
        </CustomCollapseTrigger>
      </Box>
    </Box>
  );
}
