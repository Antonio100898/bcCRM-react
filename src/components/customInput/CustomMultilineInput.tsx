
import {
  TextFieldVariants,
  TextFieldProps,
  OutlinedInputProps,
  InputProps,
  FilledInputProps,
} from "@mui/material";
import CustomInput from "./CustomInput";

const CustomMultilineInput = <Variant extends TextFieldVariants>(
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
    <CustomInput
      {...rest}
      multiline
      type="text"
      InputProps={{
        sx: {
          borderRadius: "5px",
          minHeight: "100px",
          py: 1,
          alignItems: "flex-start",
          ...InputProps?.sx,
        },
      }}
      sx={{ ...sx }}
    />
  );
};

export default CustomMultilineInput;
