import TextField, { TextFieldProps } from "@mui/material/TextField";

export function NivTextField(props: TextFieldProps) {
  const { sx, ...shareProps } = props;
  return (
    <TextField
      sx={{
        "& .MuiInputLabel-root": {
          right: 35,
          transformOrigin: "top right",
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(19px, -9px) scale(0.75)",
        },
        " & .MuiOutlinedInput-root": {
          "& .MuiOutlinedInput-notchedOutline": {
            textAlign: "right",
          },
        },
        "& .MuiInputBase-input": {
          padding: "10px",
        },
        ...sx,
      }}
      {...shareProps}
    />
  );
}
