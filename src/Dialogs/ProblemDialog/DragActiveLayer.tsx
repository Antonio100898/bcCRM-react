import {Box, Typography} from "@mui/material"

const DragActiveLayer = () => {
  return  <Box
  sx={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 128, 255, 0.25)",
    zIndex: 100000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Typography variant="h3" color="white" fontWeight="bold">
    שחרר קבצים כאן
  </Typography>
</Box>
};

export default DragActiveLayer;
