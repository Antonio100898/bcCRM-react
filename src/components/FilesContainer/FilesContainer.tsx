import { Box, Tooltip, IconButton } from "@mui/material";
import { IMAGES_PATH_PROBLEMS } from "../../Consts/Consts";
import DeleteIcon from "@mui/icons-material/Delete";
import "./FilesContainer.style.css";

type Props = {
  files: string[];
  deleteFile: (f: string) => Promise<void>;
  bigScreen: boolean;
};

function FilesContainer({ deleteFile, files, bigScreen }: Props) {
  const styles = {
    filesContainer: {
      margin: 2,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: bigScreen ? 1 : 4,
    },
  };
  return (
    <Box sx={styles.filesContainer}>
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
                    className={`img ${bigScreen ? "img-small" : "img-large"}`}
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
  );
}

export default FilesContainer;
