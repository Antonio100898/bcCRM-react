import {
  Box,
  Typography,
  Toolbar,
  AppBar,
  IconButton,
  useMediaQuery,
  Stack,
  Paper,
} from "@mui/material";

import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

type Props = {
  onClose: () => void;
  openEditPlace: () => void;
  placeName: string;
  customerName: string;
  phone: string;
  startTimeEN: Date | string;
  workerCreateName: string;
};

const ProblemDialogHeader = ({
  onClose,
  openEditPlace,
  customerName,
  placeName,
  startTimeEN,
  workerCreateName,
}: Props) => {
  const bigScreen = useMediaQuery("(min-width: 1200px)");
  return (
    <AppBar sx={{ position: "relative" }}>
      <Toolbar sx={{ height: "100px", backgroundColor: "#f5f5f5" }}>
        <IconButton
        sx={{mr:2}}
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Stack
            textAlign="center"
            width="max-content"
            gap={1}
            justifyContent="center"
          >
            <Paper sx={{ px: 2 }}>
              <Typography variant="h6" fontWeight="bold" component="span">
                {placeName}
              </Typography>
            </Paper>
            {/* <span style={{ position: "absolute", marginRight: "1rem" }}>
              <IconButton size="small" onClick={openEditPlace}>
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </span> */}
            {customerName && (
              <Paper>
                <Typography variant="h6">{customerName}</Typography>
              </Paper>
            )}
          </Stack>
          <Box textAlign="center" width="max-content">
            <Typography variant="h6">
              {dayjs(startTimeEN).format("HH:mm DD/MM")}
            </Typography>
            <Typography variant="h6"> {workerCreateName}</Typography>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default ProblemDialogHeader;
