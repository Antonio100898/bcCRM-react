import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export type ConfirmDialogProps = {
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: (confirm: boolean) => void;
};

function ConfirmDialog({
  message,
  open,
  setOpen,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={() => {
            setOpen(false);
            onConfirm(false);
          }}
          color="error"
        >
          ביטול
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm(true);
          }}
        >
          אישור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
