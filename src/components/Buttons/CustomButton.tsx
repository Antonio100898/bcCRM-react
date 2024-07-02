import { Button, ButtonOwnProps } from "@mui/material";
import { PropsWithChildren } from "react";

const CustomButton = ({
  children,
  ...props
}: PropsWithChildren & ButtonOwnProps) => {
  const { sx, ...restProps } = props;
  return (
    <Button
      {...restProps}
      variant="contained"
      sx={{
        borderRadius: "50px",
        color: "primary.main",
        fontWeight: "bold",
        fontSize: 25,
        backgroundColor: "secondary.main",
        py: 0.5,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
