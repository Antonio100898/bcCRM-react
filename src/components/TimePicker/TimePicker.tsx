import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ScrollableValues from "./ScrollableValues";

type TimePickerProps = {
  label?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  width?: string | number;

  /**
   * @value Time string like 10:45
   */
  value: string;
};

const TimePicker = ({ label, onChange, value, width }: TimePickerProps) => {
  const hours = value.split(":")[0];
  const minutes = value.split(":")[1];

  const [centerY, setCenterY] = useState(0);
  const [valueBoxHeight, setValueBoxHeight] = useState(18);
  const [containerHeight, setContainerHeight] = useState(120);
  const [hoursValue, setHoursValue] = useState(hours);
  const [minutesValue, setMinutesValue] = useState(minutes);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleValueBoxHeight = (height: number) => {
    setValueBoxHeight(height);
  };

  const handleHoursValueChange = (value: string) => {
    setHoursValue(value);
  };
  const handleMinutesValueChange = (value: string) => {
    setMinutesValue(value);
  };

  useEffect(() => {
    onChange && onChange(`${hoursValue}:${minutesValue}`);
  }, [hoursValue, minutesValue, onChange]);

  useEffect(() => {
    if (!containerRef.current) return;
    setContainerHeight(containerRef.current?.offsetHeight);
    setCenterY((containerRef.current?.offsetHeight - valueBoxHeight) / 2);
  }, [containerRef.current]);

  return (
    <Box flex={1}>
      {label && <Typography textAlign="center">{label}</Typography>}
      <Stack
        ref={containerRef}
        dir="ltr"
        direction="row"
        justifyContent="center"
        sx={{
          backgroundColor: "grey.400",
          width: width ? width : "100%",
          height: "120px",
          borderRadius: "5px",
          position: "relative",
          overflow: "hidden",
          px: "2.5%",
        }}
      >
        <Box
          sx={{
            width: "95%",
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
        <ScrollableValues
          initValue={hours}
          onChange={handleHoursValueChange}
          centerY={centerY}
          containerHeight={containerHeight}
          handleValueBoxHeight={handleValueBoxHeight}
          valueBoxHeight={valueBoxHeight}
          first={0}
          last={23}
          step={1}
        />
        <ScrollableValues
          initValue={minutes}
          onChange={handleMinutesValueChange}
          centerY={centerY}
          containerHeight={containerHeight}
          handleValueBoxHeight={handleValueBoxHeight}
          valueBoxHeight={valueBoxHeight}
          first={0}
          last={45}
          step={15}
        />
      </Stack>
    </Box>
  );
};

export default TimePicker;
