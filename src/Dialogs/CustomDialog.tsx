import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { PropsWithChildren } from "react";
import CustomButton from "../components/Buttons/CustomButton";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  title?: string;
};

const CustomDialog = ({
  open,
  onClose,
  fullScreen,
  children,
  title,
}: Props & PropsWithChildren) => {
  return (
    <Dialog
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? "" : "20px",
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

      <DialogContent sx={{ px: 4 }}>{children}</DialogContent>
      <DialogActions>
        <CustomButton fullWidth sx={{ mb: 4, mx: 2 }}>
          שמירה
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
