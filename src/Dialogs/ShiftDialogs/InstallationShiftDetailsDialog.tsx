import CustomDialog from "../CustomDialog";
import { IshiftDetail } from "../../Model";
import InstallationDetails from "./InstallationDetails";

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
  onChange: <K extends keyof IshiftDetail>(
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
  return (
    <CustomDialog
      fullScreen={fullScreen}
      onClose={onClose}
      open={open}
      title="ליווי התחילת עבודה"
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
