import {
  Box,
  LinearProgress,
  Tooltip,
  Fab,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FilesContainer from "../FilesContainer/FilesContainer";

type Props = {
  fileInput: string;
  handleUploadFile: React.ChangeEventHandler<HTMLInputElement>;
  fileLoading: boolean;
  files: string[];
  deleteFile: (f: string) => Promise<void>;
  fileProgress: number;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null | undefined>;
  bigScreen: boolean;
  onOpenFilesDialog: () => void;
};

export default function ProblemFiles({
  fileInput,
  fileLoading,
  files,
  handleUploadFile,
  deleteFile,
  fileProgress,
  fileInputRef,
  bigScreen,
  onOpenFilesDialog,
}: Props) {
  return (
    <Box dir="rtl">
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
      <Box sx={{ display: "flex" }}>
        {bigScreen ? (
          <>
            <Tooltip title="צרף קבצים">
              <Fab
                disabled={fileLoading}
                sx={{ margin: "5px 0 0 0", boxShadow: 0 }}
                size="medium"
                onClick={() => fileInputRef.current?.click()}
              >
                <AttachFileIcon
                  style={{ fontSize: 25, color: "rgba(251, 50, 0, 0.6)" }}
                />
              </Fab>
            </Tooltip>
            <FilesContainer deleteFile={deleteFile} files={files} />{" "}
          </>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: 2,
              }}
            >
              <Button
                disabled={fileLoading}
                onClick={() => fileInputRef.current?.click()}
                variant="contained"
              >
                <Typography fontSize={16}>העלאת קובץ</Typography>
                <AttachFileIcon style={{ fontSize: 25, color: "black" }} />
              </Button>
              <Button onClick={onOpenFilesDialog} variant="contained">
                <Typography fontSize={16}>צפייה בקצים</Typography>
                <AttachFileIcon style={{ fontSize: 25, color: "black" }} />
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
