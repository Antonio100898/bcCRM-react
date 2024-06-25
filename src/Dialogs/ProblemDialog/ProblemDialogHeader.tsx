import {
  Box,
  Typography,
  Toolbar,
  AppBar,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

type Props = {
  onClose: () => void;
  callDisabled: boolean;
  openEditPlace: () => void;
  placeName: string;
  customerName: string;
  phone: string;
  startTimeEN: Date | string;
  callClientPhone: () => Promise<void>;
};

const ProblemDialogHeader = ({
  onClose,
  callDisabled,
  openEditPlace,
  callClientPhone,
  customerName,
  phone,
  placeName,
  startTimeEN,
}: Props) => {
  const bigScreen = useMediaQuery("(min-width: 1200px)");
  return (
    <AppBar sx={{ position: "relative" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            ml: 2,
            flex: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography
              variant="h6"
              component="div"
              lineHeight={1}
              fontWeight="bold"
            >
              {placeName}
            </Typography>
            <IconButton size="small" onClick={openEditPlace}>
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: bigScreen ? "flex-start" : "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {customerName && (
                <Typography variant="body1">{customerName}</Typography>
              )}
              {startTimeEN && (
                <Typography variant="body1">
                  {dayjs(startTimeEN).format("HH:mm DD/MM")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginLeft: 5 }}>
              {phone && <Typography variant="body1">{phone}</Typography>}
            </Box>

            <IconButton disabled={callDisabled} onClick={callClientPhone}>
              <CallIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ProblemDialogHeader;
