import { Box, TextField, TextFieldProps } from "@mui/material";

const CustomInput = (props: TextFieldProps) => {
  const { label, ...inputProps } = props;

  return (
    <>
      <Box sx={{ fontWeight: "bold" }}> {label}</Box>
      <TextField {...inputProps} />
    </>
  );
};
export default CustomInput;
