import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

export type PromptDialogProps = {
  defaultText: string;
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: (prompt: string) => void;
};

function PromptDialog({
  defaultText,
  message,
  open,
  setOpen,
  onConfirm,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultText);

  useEffect(() => {
    if (defaultText) setValue(defaultText);
  }, [defaultText]);

  return (
    <Dialog
      disableRestoreFocus
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
      fullWidth
    >
      <DialogContent dir="rtl">
        <Typography variant="h5">{message}</Typography>
        <TextField
          multiline
          autoFocus
          fullWidth
          sx={{ mt: 3 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions dir="rtl" sx={{ mx: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm(value);
            setValue('');
          }}
        >
          אישור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PromptDialog;
