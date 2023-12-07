import {
  Dialog,
  Slide,
  useMediaQuery,
  useTheme,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import FileContainer from "../components/FilesContainer/FilesContainer";
import CloseIcon from "@mui/icons-material/Close";

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

type Props = {
  isMobile: boolean;
  open: boolean;
  onClose: () => void;
  bigScreen: boolean;
  files: string[];
  deleteFile: (f: string) => Promise<void>;
};

function FilesDialog({
  isMobile,
  onClose,
  open,
  bigScreen,
  deleteFile,
  files,
}: Props) {
  const dialogPaperStyle = {
    maxWidth: bigScreen ? "1000px" : "600px",
    width: bigScreen ? "1000px" : "",
  };

  return (
    <Dialog
      onClose={onClose}
      fullScreen={isMobile}
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: dialogPaperStyle,
        sx: { justifyContent: "space-between" },
      }}
    >
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography>קבצים</Typography>
        </Toolbar>
      </AppBar>
      <FileContainer
        bigScreen={bigScreen}
        deleteFile={deleteFile}
        files={files}
      />
    </Dialog>
  );
}

export default FilesDialog;
