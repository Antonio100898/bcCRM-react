import {
  Box,
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  Avatar,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import {
  IDepartment,
  IWorker,
  IProblem,
  IProblemType,
  IMsgLine,
} from "../../Model";
import FormInputWrapper from "../BaseCompnents/FormInputWrapper";
import ProblemMessages from "../ProblemMessages";
import ProblemFiles from "../ProblemFiles";
import { NivTextField } from "../BaseCompnents/NivTextField/NivTextField";
import CustomInput from "../customInput/customInput";
import ProblemStatuses from "../ProblemStatuses/ProblemStatuses";
import { WorkersList } from "../WorkersList/WorkersList";
import { useState, useEffect } from "react";
import CustomCollapseTrigger from "../CustomCollapseTrigger/CustomCollapse";
import { useUser } from "../../Context/useUser";

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
};

export default function ProblemInfo({
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
  isLockEnable,
  setEmergency,
  setIsLocked,
  setTakeCare,
  onOpenFilesDialog,
  setCallCustomerBack,
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
        document.getElementById("show-all-messages")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
  }, [openMessagesCollapse]);

  return (
    <Box sx={{ marginBottom: 6 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1.5 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {user?.workerType !== 0 && (
            <FormInputWrapper label="IP">
              <NivTextField
                onChange={onIpChange}
                value={problemIp}
                variant="filled"
              />
            </FormInputWrapper>
          )}
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
        </Box>

        <FormInputWrapper label="תיוגים">
          <Select
            multiple
            value={currentProblemTypesId}
            onChange={handleProblemTypesChange}
            input={<OutlinedInput label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    style={{ margin: "3px" }}
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
                          border: "1px solid black",
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
        <WorkersList
          workersSelected={selfProblem.toWorkers || []}
          setWorkersSelected={(selected) => onChange("toWorkers", selected)}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: bigScreen ? "row" : "column",
            width: "100%",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Box sx={{ width: bigScreen ? "60%" : "100%" }}>
            <CustomInput
              onChange={(e) => onChange("desc", e.target.value)}
              label="תיאור תקלה"
              fullWidth
              multiline
              type="text"
              value={selfProblem?.desc}
            />
          </Box>
          <Box sx={{ flex: 1, width: "100%" }}>
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
          </Box>
        </Box>
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
