import {
  MenuList,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { IshiftDetail } from "../../Model";

type Props = {
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
};

const InstallationDetails = ({
  adress,
  customer,
  isAdmin,
  onChange,
  phone,
  placeName,
  wifi,
  remark,
}: Props) => {
  const list = [
    {
      icon: "/location.svg",
      value: placeName,
      label: "שם העסק",
      onChange: (val: string) => onChange("placeName", val),
    },
    {
      icon: "/navigation.svg",
      value: adress,
      label: "כתובת",
      onChange: (val: string) => onChange("address", val),
    },
    {
      icon: "/user.svg",
      value: customer,
      label: "איש קשר",
      onChange: (val: string) => onChange("contactName", val),
    },
    {
      icon: "/phone.svg",
      value: phone,
      label: "טלפון",
      onChange: (val: string) => onChange("phone", val),
    },
    {
      icon: "/wifi.svg",
      value: wifi,
      label: "חברת תקשורת",
      onChange: (val: string) => console.log(val),
    },
    {
      icon: "/note.svg",
      value: remark,
      label: "הערות",
      onChange: (val: string) => onChange("remark", val),
    },
  ];
  return (
    <Box maxWidth={400}>
      <Typography fontSize={20} fontWeight="bold">
        פירוט
      </Typography>
      <MenuList disablePadding>
        {isAdmin
          ? list.map((item) => (
              <ListItem
                key={item.icon}
                sx={{ alignItems: "flex-start", px: 0, my: 2 }}
              >
                <ListItemIcon sx={{ my: "4px" }}>
                  <img src={item.icon} />
                </ListItemIcon>
                {item.label === "הערות" ? (
                  <TextField
                    onChange={(e) => item.onChange(e.currentTarget.value)}
                    value={item.value}
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
                    onChange={(e) => item.onChange(e.currentTarget.value)}
                    value={item.value}
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
              <ListItem key={item.icon} sx={{ alignItems: "flex-start" }}>
                <ListItemIcon sx={{ my: "4px" }}>
                  <img src={item.icon} />
                </ListItemIcon>
                <ListItemText>{item.value}</ListItemText>
              </ListItem>
            ))}
      </MenuList>
    </Box>
  );
};

export default InstallationDetails;
