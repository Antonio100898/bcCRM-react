import {
  TextField,
  TextFieldVariants,
  TextFieldProps,
  OutlinedInputProps,
  InputProps,
  FilledInputProps,
} from "@mui/material";

const CustomInput = <Variant extends TextFieldVariants>(
  props: {
    variant?: Variant;
    InputProps?:
      | Partial<OutlinedInputProps>
      | Partial<InputProps>
      | Partial<FilledInputProps>
      | undefined;
  } & Omit<TextFieldProps, "variant">
) => {
  const { sx, InputProps, ...rest } = props;

  return (
    <TextField
      {...rest}
      sx={{
        textAlign: "start",
        "& label": {
          color: "black",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "transparent",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.light",
          },
        },
        ...sx,
      }}
      InputProps={{
        sx: {
          borderRadius: 50,
          backgroundColor: "grey.400",
          outlineColor: "none",
          ...InputProps?.sx,
        },
      }}
    />
  );
};

export default CustomInput;
