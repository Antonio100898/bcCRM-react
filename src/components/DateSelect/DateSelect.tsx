import { Box, Typography, IconButton } from "@mui/material";

export type Props = {
  onNext: () => void;
  onPrev: () => void;
  displayValue: React.ReactNode;
};

export default function DateSelect({ onNext, onPrev, displayValue }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flex: "row",
        px: 1,
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.13)",
        border: "0.7px solid #DCDCDC",
        borderRadius: "50px",
        alignItems: "center",
        height: "40px",
        mx: "auto",
        mt: 4,
        width: "300px",
        justifyContent: "space-between",
      }}
    >
      <IconButton onClick={onPrev} size="small">
        <img src="/rightArrow.svg" />
      </IconButton>
      <Box sx={{ mx: 2 }}>
        <Typography component="span" fontWeight={600}>
          {displayValue}
        </Typography>
      </Box>
      <IconButton size="small" onClick={onNext}>
        <img src="/leftArrow.svg" />
      </IconButton>
    </Box>
  );
}
