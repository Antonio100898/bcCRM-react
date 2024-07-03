import { Box, Stack, Typography, BoxProps } from "@mui/material";
import { PropsWithChildren, useRef } from "react";

type Props = {
  label?: string;
  value: string;
  fullWidth?: boolean;
};

const getHoursList = () => {
  let result = [];
  for (let i = 0; i <= 23; i++) {
    result.push(i);
  }
  return result;
};

const getMinutesList = () => {
  let result = [];
  for (let i = 0; i <= 45; i = i + 15) {
    result.push(i);
  }
  return result;
};

const ValuesScrollable = ({ children }: PropsWithChildren) => {
  return (
    <Box
      sx={{
        height: "136px",
        overflow: "scroll",
        scrollBehavior: "smooth",
        boxSizing: "border-box",
        pt: "51px",
        pb: "50px",
      }}
    >
      <Stack gap={2} alignItems="center">
        {children}
      </Stack>
    </Box>
  );
};

const ValueBox = ({ children, ...props }: BoxProps & PropsWithChildren) => {
  return (
    <Box sx={{ fontSize: 18, lineHeight: "18px", zIndex: 200 }} {...props}>
      {children}
    </Box>
  );
};

const TimePicker = ({ label, value, fullWidth }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box width="max-content">
      {label && <Typography>{label}</Typography>}
      <Stack
        dir="ltr"
        direction="row"
        justifyContent="center"
        gap={4}
        sx={{
          backgroundColor: "grey.400",
          width: fullWidth ? "100%" : "170px",
          height: "120px",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "92%",
            position: "absolute",
            backgroundColor: "white",
            height: 30,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          :
        </Box>
        <ValuesScrollable>
          {getHoursList().map((h) => (
            <ValueBox key={h}>{h === 0 ? "00" : h}</ValueBox>
          ))}
        </ValuesScrollable>

        <ValuesScrollable>
          {getMinutesList().map((m) => (
            <ValueBox key={m}>{m === 0 ? "00" : m}</ValueBox>
          ))}
        </ValuesScrollable>
      </Stack>
    </Box>
  );
};

export default TimePicker;
