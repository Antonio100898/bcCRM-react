import { Box, IconButton } from "@mui/material";

type Props = {
  showEmptyShift: () => void;
};

const EmptyShift = ({ showEmptyShift }: Props) => {
  return (
    <Box
      style={{
        width: "100%",
        justifyContent: "center",
        border: "2px dashed #A1A1A1",
        borderRadius: "8px",
      }}
    >
      <IconButton onClick={showEmptyShift}>
        <img src="plus.svg" />
      </IconButton>
    </Box>
  );
};

export default EmptyShift;
