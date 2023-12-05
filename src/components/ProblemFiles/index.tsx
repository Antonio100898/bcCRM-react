import { IMAGES_PATH_PROBLEMS } from "../../Consts/Consts";
import {
  Box,
  Typography,
  LinearProgress,
  Tooltip,
  IconButton,
  Fab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";

type Props = {
  dragActive: boolean;
  fileInput: string;
  handleUploadFile: React.ChangeEventHandler<HTMLInputElement>;
  fileLoading: boolean;
  files: string[];
  deleteFile: (f: string) => Promise<void>;
  fileProgress: number;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null | undefined>;
};

export default function ProblemFiles({
  dragActive,
  fileInput,
  fileLoading,
  files,
  handleUploadFile,
  deleteFile,
  fileProgress,
  fileInputRef,
}: Props) {
  return (
    <Box dir="rtl">
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
      <Box sx={{ margin: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {files &&
          [...new Set(files)].map((file, index) => {
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
    </Box>
  );
}
