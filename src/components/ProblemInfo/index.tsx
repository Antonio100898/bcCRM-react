import {
  Box,
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  Avatar,
  TextField,
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
}: Props) {
  return (
    <>
      <Box sx={{ display: "flex", gap: 1, mt: 1.5, mb: 1 }}>
        <FormInputWrapper label="IP">
          <NivTextField
            onChange={onIpChange}
            value={problemIp}
            variant="filled"
          />
        </FormInputWrapper>
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
      <Box>
        <FormInputWrapper label="תיוגים">
          <Select
            fullWidth
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
      </Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <FormInputWrapper label="תיאור תקלה">
          <TextField
            multiline
            fullWidth
            type="text"
            value={selfProblem?.desc}
          />
        </FormInputWrapper>
      </Box>
      <ProblemFiles
        fileInputRef={fileInputRef}
        deleteFile={deleteFile}
        fileInput={fileInput}
        fileLoading={fileLoading}
        fileProgress={fileProgress}
        files={files}
        handleUploadFile={handleUploadFile}
      />
      <Box sx={{ display: "flex", width: "100%" }}>
        {selfProblem && (
          <ProblemMessages
            refreshMessages={refreshMessages}
            messages={messages}
            problemId={selfProblem.id}
          />
        )}
      </Box>
    </>
  );
}
