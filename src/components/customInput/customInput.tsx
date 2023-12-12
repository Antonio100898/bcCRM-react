import { Box, SxProps, TextField, TextFieldProps, Theme } from "@mui/material";

type Props = TextFieldProps & {
  labelProps?: SxProps<Theme> | undefined;
};

const CustomInput = (props: Props) => {
  const { labelProps, label, ...inputProps } = props;

  return (
    <>
      <Box sx={{ ...labelProps, fontWeight: "bold" }}>{label}</Box>
      <TextField {...inputProps} />
    </>
  );
};
export default CustomInput;
