import { Button, ButtonOwnProps } from "@mui/material";
import { PropsWithChildren } from "react";

type Props = {
  onClick?: () => void;
  type?: "button" | "reset" | "submit" | undefined;
};

const CustomButton = ({
  children,
  type,
  ...props
}: PropsWithChildren & ButtonOwnProps & Props) => {
  const { sx, onClick, ...restProps } = props;
  return (
    <Button
      sx={{
        borderRadius: "50px",
        fontWeight: "bold",
        fontSize: 25,
        backgroundColor: props.color || "primary.main",
        py: 0.5,
        color: "secondary.main",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: props.color || "primary.main",
          opacity: 0.9,
        },
        "&:disabled": {
          backgroundColor: props.color || "primary.main",
          opacity: 0.5,
        },
        ...sx,
      }}
      type={type}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
