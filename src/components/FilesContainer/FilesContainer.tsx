import { Box, Tooltip, IconButton } from "@mui/material";
import { IMAGES_PATH_PROBLEMS } from "../../Consts/Consts";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  files: string[];
  deleteFile: (f: string) => Promise<void>;
};

function FilesContainer({ deleteFile, files }: Props) {
  return (
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
  );
}

export default FilesContainer;
