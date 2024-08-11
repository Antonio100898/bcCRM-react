import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  title?: string;
  sx?: SxProps<Theme> | undefined;
  disableScroll?: boolean;
  dialogActions?: ReactNode;
};

const CustomDialog = ({
  open,
  onClose,
  fullScreen,
  children,
  title,
  sx,
  disableScroll,
  dialogActions,
}: Props & PropsWithChildren) => {
  return (
    <Dialog
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? "" : "20px",
          ...sx,
        },
      }}
      dir="rtl"
      fullWidth
      onClose={onClose}
      open={open}
    >
      <Box textAlign="end" p={1}>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      {title && (
        <DialogTitle
          sx={{ pt: 0, px: 4 }}
          component="span"
          fontSize={22}
          fontWeight="bold"
          color="text.primary"
        >
          {title}
        </DialogTitle>
      )}

      <DialogContent
        sx={{
          px: 4,
          width: "100%",
          height: "600px",
          overflow: disableScroll ? "hidden" : "",
        }}
      >
        {children}
      </DialogContent>
      {dialogActions && dialogActions}
    </Dialog>
  );
};

export default CustomDialog;
