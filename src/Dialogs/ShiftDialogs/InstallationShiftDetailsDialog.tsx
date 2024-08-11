import CustomDialog from "../CustomDialog";
import { IshiftDetail } from "../../Model";
import InstallationDetails from "./InstallationDetails";
import CustomButton from "../../components/Buttons/CustomButton";
import { DialogActions } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  placeName: string;
  adress: string;
  customer: string;
  phone: string;
  wifi: string;
  remark?: string | undefined;
  isAdmin: boolean;
  onChange?: <K extends keyof IshiftDetail>(
    key: K,
    val: IshiftDetail[K]
  ) => void;
  fullScreen?: boolean;
};
const InstallationShiftDetailsDialog = ({
  open,
  onClose,
  isAdmin,
  onChange,
  placeName,
  adress,
  customer,
  phone,
  wifi,
  remark,
  fullScreen,
}: Props) => {
  const Actions = () => {
    return (
      <DialogActions>
        <CustomButton fullWidth onClick={() => {}} sx={{ mb: 4, mx: 2 }}>
          שמירה
        </CustomButton>
      </DialogActions>
    );
  };
  return (
    <CustomDialog
      fullScreen={fullScreen}
      onClose={onClose}
      open={open}
      title="ליווי התחילת עבודה"
      dialogActions={isAdmin ? Actions() : undefined}
    >
      <InstallationDetails
        adress={adress}
        customer={customer}
        isAdmin={isAdmin}
        onChange={onChange}
        phone={phone}
        placeName={placeName}
        wifi={wifi}
        remark={remark}
      />
    </CustomDialog>
  );
};

export default InstallationShiftDetailsDialog;
