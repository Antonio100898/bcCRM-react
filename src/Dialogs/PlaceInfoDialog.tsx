import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { IPlace } from "../Model";
import { useUser } from "../Context/useUser";

export type PlaceInfoDialogProps = {
  open: boolean;
  onClose: () => void;
  place: IPlace | null;
  onPlaceUpdate: (place: IPlace) => void;
};

export function PlaceInfoDialog({
  open,
  onClose,
  place,
  onPlaceUpdate,
}: PlaceInfoDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [selfPlace, setSelfPlace] = useState(place);
  const { user } = useUser();

  const handleChange = <T extends keyof IPlace>(key: T, value: IPlace[T]) => {
    if (!selfPlace) return;
    const update = { ...selfPlace, [key]: value };
    setSelfPlace(update);
  };

  const validateInput = <T extends keyof IPlace>(
    key: T,
    errorMessage: string
  ) => {
    if (!selfPlace) return false;
    if (
      typeof selfPlace[key] === "string" &&
      (selfPlace[key] as string).length
    ) {
      return true;
    }

    enqueueSnackbar({ message: errorMessage, variant: "error" });
    return false;
  };

  const handleSavePlace = async () => {
    if (!selfPlace) return;

    if (!validateInput("placeName", "אנא הזן שם מקום")) return;
    if (!validateInput("cusName", "אנא הזן שם לקוח")) return;
    if (!validateInput("phone", "אנא הזן טלפון")) return;
    //try {
    //  const data = await placeService.updatePlaceInfo({
    //    placeId: selfPlace.placeId,
    //    phone: selfPlace.phone,
    //    phoneId: selfPlace.phoneId,
    //    placeName: selfPlace.placeName,
    //    cusName: selfPlace.cusName,
    //    remark: selfPlace.remark,
    //    vip: selfPlace.vip,
    //  });
    //  if (!data?.d.success) {
    //    enqueueSnackbar({
    //      message: `נכשל לעדכן פרטי עסק. ${data?.d.msg}`,
    //      variant: "error",
    //    });
    //    return;
    //  }
    onPlaceUpdate(selfPlace);
    onClose();

    //} catch (error) {
    //  console.error(error)
    //}
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        component="div"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Typography variant="h6" flex={1}>
          {selfPlace?.placeId === 0 ? "הוספת עסק חדש" : "עריכת עסק"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <TextField
          sx={{ mt: 1 }}
          value={selfPlace?.placeName}
          onChange={(e) => handleChange("placeName", e.target.value)}
          label="שם עסק"
          fullWidth
        />
        <TextField
          value={selfPlace?.cusName}
          onChange={(e) => handleChange("cusName", e.target.value)}
          label="שם לקוח"
          fullWidth
        />
        <TextField value={selfPlace?.phone} label="טלפון" fullWidth />
        {user && user.userType === 1 && (
          <>
            <TextField
              value={selfPlace?.remark}
              onChange={(e) => handleChange("remark", e.target.value)}
              label="הערה"
              fullWidth
            />
            <FormControlLabel
              checked={selfPlace?.vip}
              control={
                <Checkbox
                  onChange={(e) => handleChange("vip", e.target.checked)}
                />
              }
              label="VIP"
              labelPlacement="start"
            />
          </>
        )}

        <Button variant="contained" fullWidth onClick={handleSavePlace}>
          {(selfPlace?.placeId || 0) > 0 ? "עדכן" : "הוסף חדש"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
