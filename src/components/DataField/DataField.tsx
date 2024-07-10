import { Box, BoxProps } from "@mui/material";

const DataField = (props: React.PropsWithChildren & BoxProps) => {
  const { sx, children, ...restProps } = props;
  return (
    <Box
      sx={{
        bgcolor: "grey.400",
        p: 1,

        borderRadius: "6px",
        ...sx,
      }}
      {...restProps}
    >
      {children}
    </Box>
  );
};

export default DataField;
