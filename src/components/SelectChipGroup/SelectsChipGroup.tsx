import { Stack, Typography, SxProps, Theme } from "@mui/material";
import { PropsWithChildren } from "react";

type Props = {
  label?: string;
  sx?: SxProps<Theme>
};

const SelectsChipGroup = ({ children, label, sx }: PropsWithChildren & Props) => {
  return (
    <Stack sx={sx} gap={1.5}>
      {label && <Typography fontWeight="bold">{label}</Typography>}
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {children}
      </Stack>
    </Stack>
  );
};

export default SelectsChipGroup;
