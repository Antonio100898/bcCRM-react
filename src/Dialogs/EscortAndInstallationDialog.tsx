import {
  MenuList,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import CustomDialog from "./CustomDialog";

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
  isAdmin,
}: Props) => {
  const list = [
    {
      icon: "/location.svg",
      value: placeName,
      label: "שם העסק",
    },
    {
      icon: "/navigation.svg",
      value: adress,
      label: "כתובת",
    },
    {
      icon: "/user.svg",
      value: customer,
      label: "איש קשר",
    },
    {
      icon: "/phone.svg",
      value: phone,
      label: "טלפון",
    },
    {
      icon: "/wifi.svg",
      value: wifi,
      label: "חברת תקשורת",
    },
    {
      icon: "/note.svg",
      value: remark,
      label: "הערות",
    },
  ];
  return (
    <CustomDialog
      fullScreen={isAdmin}
      onClose={onClose}
      open={open}
      title="ליווי התחילת עבודה"
    >
      <MenuList>
        {isAdmin
          ? list.map((item) => (
              <ListItem sx={{ alignItems: "flex-start", px: 0, my: 2 }}>
                <ListItemIcon sx={{ my: "4px" }}>
                  <img src={item.icon} />
                </ListItemIcon>
                {item.label === "הערות" ? (
                  <TextField
                    multiline
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        padding: "5px 14px",
                      },
                    }}
                    inputProps={{
                      style: {
                        minHeight: "80px",
                      },
                    }}
                    placeholder={item.label}
                  />
                ) : (
                  <TextField
                    fullWidth
                    inputProps={{
                      style: {
                        padding: "5px 10px",
                      },
                    }}
                    placeholder={item.label}
                  />
                )}
              </ListItem>
            ))
          : list.map((item) => (
              <ListItem sx={{ alignItems: "flex-start", my: 2 }}>
                <ListItemIcon sx={{ my: "4px" }}>
                  <img src={item.icon} />
                </ListItemIcon>
                <ListItemText>{item.value}</ListItemText>
              </ListItem>
            ))}
      </MenuList>
    </CustomDialog>
  );
};

export default EscortAndInstallationDialog;
