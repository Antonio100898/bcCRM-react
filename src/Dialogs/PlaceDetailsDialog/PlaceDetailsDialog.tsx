import { FunctionComponent, useEffect, useState } from "react";
import CustomDialog, { CustomDialogProps } from "../CustomDialog";
import { IPhonePlace } from "../../Model";
import CustomInput from "../../components/customInput/customInput";
import CustomMultilineInput from "../../components/CustomInput/CustomMultilineInput";
import { Checkbox, Stack, Typography } from "@mui/material";
import FormInputWrapper from "../../components/BaseCompnents/FormInputWrapper";
import CustomButton from "../../components/Buttons/CustomButton";
import { placeService } from "../../API/services/placeService";
import { enqueueSnackbar } from "notistack";

interface PlaceDetailsDialogProps extends CustomDialogProps {
  phonePlace: IPhonePlace;
}

const PlaceDetailsDialog: FunctionComponent<PlaceDetailsDialogProps> = ({
  onClose,
  open,
  phonePlace,
}) => {
  const [currentPlace, setCurrentPlace] = useState<IPhonePlace>(phonePlace);

  useEffect(() => {
    setCurrentPlace(phonePlace);
  }, [phonePlace]);

  const handlePlaceNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentPlace((prev) => ({ ...prev, placeName: e.currentTarget?.value }));
  };
  const handleCustomerNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentPlace((prev) => ({
      ...prev,
      customerName: e.currentTarget.value,
    }));
  };
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentPlace((prev) => ({ ...prev, phone: e.currentTarget.value }));
  };

  const handleVipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPlace((prev) => ({ ...prev, vip: e.currentTarget.checked }));
  };

  const updatePlace = async () => {
    try {
      const data = await placeService.updatePhonePlace(currentPlace);
      if (!data?.d.success) {
        enqueueSnackbar({
          variant: "error",
          message: "לא מצליח לעדכן את העסק",
        });
      } else {
        enqueueSnackbar({
          variant: "success",
          message: "הצלחה",
        });
      }
    } catch (error) {
      enqueueSnackbar({
        variant: "error",
        message: "תקלה",
      });
    }
  };

  const Actions = () => {
    return (
      <>
        <CustomButton fullWidth onClick={updatePlace}>
          שמירה
        </CustomButton>
      </>
    );
  };

  return (
    <CustomDialog
      dialogActions={Actions()}
      onClose={onClose}
      open={open}
      title={phonePlace.id === 0 ? "הוספת עסק" : "עדכון עסק"}
    >
      <Stack gap={1}>
        <FormInputWrapper label="שם עסק">
          <CustomInput
            value={currentPlace.placeName}
            onChange={handlePlaceNameChange}
          />
        </FormInputWrapper>
        <FormInputWrapper label="שם לקוח">
          <CustomInput
            value={currentPlace.cusName}
            onChange={handleCustomerNameChange}
          />
        </FormInputWrapper>
        <FormInputWrapper label="מספר טלפון">
          <CustomInput
            value={currentPlace.phone}
            onChange={handlePhoneChange}
          />
        </FormInputWrapper>
        <FormInputWrapper label="הערה">
          <CustomMultilineInput
            value={currentPlace.placeRemark}
            onChange={handlePhoneChange}
          />
        </FormInputWrapper>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography>VIP</Typography>
          <Checkbox
            color="secondary"
            value={currentPlace.vip}
            checked={currentPlace.vip}
            onChange={handleVipChange}
          />{" "}
        </div>
      </Stack>
    </CustomDialog>
  );
};

export default PlaceDetailsDialog;
