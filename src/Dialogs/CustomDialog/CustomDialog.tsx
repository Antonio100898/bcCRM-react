import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  SxProps,
  Theme,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  title?: string;
  sx?: SxProps<Theme> | undefined;
  dialogActions?: ReactNode;
};

const CustomDialog = ({
  open,
  onClose,
  fullScreen,
  children,
  title,
  sx,
  dialogActions,
}: Props & PropsWithChildren) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? "" : "20px",
          maxHeight: isMobile ? undefined : "860px",
          ...sx,
        },
      }}
      dir="rtl"
      fullWidth
      onClose={onClose}
      open={open}
    >
      <Box textAlign="end" sx={{ px: 4, pt: 2 }}>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      {title && (
        <DialogTitle
          sx={{ pt: 0, px: 4 }}
          component="span"
          fontSize={20}
          fontWeight="bold"
          color="text.primary"
        >
          {title}
        </DialogTitle>
      )}

      <DialogContent
        sx={{
          px: 4,
          scrollbarWidth: "none",
        }}
      >
        {children}
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid white",
          borderColor: "grey.300",
        }}
      >
        {dialogActions && dialogActions}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
