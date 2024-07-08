import { Button, ButtonOwnProps } from "@mui/material";
import { PropsWithChildren } from "react";

type Props = {
  onClick?: () => void;
};

const CustomButton = ({
  children,
  ...props
}: PropsWithChildren & ButtonOwnProps & Props) => {
  const { sx, onClick, ...restProps } = props;
  return (
    <Button
      onClick={onClick}
      {...restProps}
      variant="contained"
      sx={{
        borderRadius: "50px",
        color: "primary.main",
        fontWeight: "bold",
        fontSize: 25,
        backgroundColor: "secondary.main",
        py: 0.5,
        "&:hover": {
          backgroundColor: "secondary.main",
          opacity: 0.9,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
