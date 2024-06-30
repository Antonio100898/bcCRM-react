import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  MenuList,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
  placeName: string;
  adress: string;
  customer: string;
  phone: string;
  wifi: string;
  remark?: string | undefined;
};
const EscortAndInstallationDialog = ({
  open,
  onClose,
  placeName,
  adress,
  customer,
  phone,
  wifi,
  remark,
}: Props) => {
  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "20px",
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
      <DialogTitle
        sx={{ pt: 0 }}
        component="span"
        fontSize={22}
        fontWeight="bold"
        color="text.primary"
      >
        ליווי תחילת עבודה
      </DialogTitle>

      <DialogContent>
        <MenuList>
          <ListItem>
            <ListItemIcon>
              <img src="/location.svg" />
            </ListItemIcon>
            <ListItemText>{placeName}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <img src="/navigation.svg" />
            </ListItemIcon>
            <ListItemText>{adress}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <img src="/user.svg" />
            </ListItemIcon>
            <ListItemText>{customer}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <img src="/phone.svg" />
            </ListItemIcon>
            <ListItemText>{phone}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <img src="/wifi.svg" />
            </ListItemIcon>
            <ListItemText>{wifi}</ListItemText>
          </ListItem>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemIcon>
              <img src="/note.svg" />
            </ListItemIcon>
            <ListItemText>{remark}</ListItemText>
          </ListItem>
        </MenuList>
      </DialogContent>
    </Dialog>
  );
};

export default EscortAndInstallationDialog;
