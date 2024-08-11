import CustomButton from "../../components/Buttons/CustomButton";
import CustomInput from "../../components/customInput/customInput";
import CustomDialog from "../CustomDialog";
import { DialogActions } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  remarkValue: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
};

const ShiftRemarkDialog = ({
  onClose,
  open,
  remarkValue,
  onChange,
  onSave,
}: Props) => {
  const Actions = () => {
    return (
      <DialogActions>
        <CustomButton  onClick={onSave} fullWidth sx={{ mb: 4, mx: 2 }}>
          שמירה
        </CustomButton>
      </DialogActions>
    );
  };
  return (
    <CustomDialog title="הערה" open={open} onClose={onClose} dialogActions={Actions()}>
      <CustomInput multiline fullWidth type="text" value={remarkValue} onChange={onChange} />
    </CustomDialog>
  );
};

export default ShiftRemarkDialog;
