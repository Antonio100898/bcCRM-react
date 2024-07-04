import { Box, Stack, Typography, BoxProps } from "@mui/material";
import {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";

type TimePickerProps = {
  label?: string;
  value: string;
  fullWidth?: boolean;
};

type ValuesScrollableProps = {
  top: number | string;
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
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

const ValuesScrollable = forwardRef(
  (
    {
      children,
      handleTouchMove,
      handleTouchStart,
      handleTouchEnd,
      top,
    }: PropsWithChildren & ValuesScrollableProps,
    ref
  ) => {
    return (
      <Box
        ref={ref}
        sx={{
          position: "absolute",
          top: top,
          zIndex: 100,
          transition: "all 0.1s ease-out",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        gap={2}
        alignItems="center"
        onClick={() => console.log("r")}
      >
        {children}
      </Box>
    );
  }
);

const ValueBox = forwardRef(
  ({ children, ...props }: BoxProps & PropsWithChildren, ref) => {
    return (
      <Box
        ref={ref}
        sx={{ fontSize: 18, lineHeight: "18px", zIndex: 200, width: "100%", textAlign: "center" }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

const TimePicker = ({ label, value, fullWidth }: TimePickerProps) => {
  const [centerY, setCenterY] = useState(0);
  const [top, setTop] = useState<number>(centerY);
  const [beingTouched, setBeingTouched] = useState(false);
  const [originalOffset, setOriginalOffset] = useState(0);
  const [timeOfLastDragEvent, setTimeOfLastDragEvent] = useState(0);
  const [prevTouchY, setPrevTouchY] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [intervalId, setIntervalId] = useState<number>();
  const [valueBoxHeight, setValueBoxHeight] = useState(18);
  const [scrollableHeight, setScrollableHeight] = useState(800);
  const valueBoxRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollableRef.current) return;
    const valueBoxHeight = valueBoxRef.current?.offsetHeight
      ? valueBoxRef.current?.offsetHeight
      : 18;
    const height = scrollableRef.current?.offsetHeight;
    setScrollableHeight(height);
    setValueBoxHeight(valueBoxHeight);
    setCenterY((containerRef.current?.offsetHeight - valueBoxHeight) / 2);
    setTop((containerRef.current?.offsetHeight - valueBoxHeight) / 2);
  }, [containerRef.current, scrollableRef.current]);

  const animateSlidingToZero = () => {
    let vel = velocity;
    let t = Number(top);
    if (!beingTouched && Number(top) < -0.01) {
      vel += 10 * 0.033;

      t += velocity;
      if (t < -350) {
        window.clearInterval(intervalId);
        //this.handleRemoveSelf();
      }
      setTop(t);
      setVelocity(vel);
    } else if (!beingTouched) {
      t = 0;
      vel = 0;
      window.clearInterval(intervalId);

      setTop(t);
      setVelocity(vel);
      setIntervalId(undefined);
      setOriginalOffset(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setBeingTouched(true);
    setOriginalOffset(e.currentTarget.offsetTop);
    setTouchStartY(e.targetTouches[0].clientY);
    setTimeOfLastDragEvent(Date.now());
    setIntervalId(undefined);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (beingTouched) {
      const touchY = e.targetTouches[0].clientY;
      const currTime = Date.now();
      const elapsed = currTime - timeOfLastDragEvent;
      const velocity = (20 * (touchY - prevTouchY)) / elapsed;
      let deltaY = touchY - touchStartY + originalOffset;
      setVelocity(velocity);
      setTimeOfLastDragEvent(currTime);
      setPrevTouchY(touchY);

      const canScrollDown = deltaY > 0 && !(deltaY > 100);
      const canScrollUp =
        deltaY < 0 && !(deltaY < -scrollableHeight + valueBoxHeight);
      if (canScrollDown) setTop(deltaY);
      if (canScrollUp) setTop(deltaY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const step = valueBoxHeight + 16;
    const calculatedY = Math.round((centerY - top) / step);

    if (top > centerY) setTop(centerY);
    else if (top < -scrollableHeight + 60)
      setTop(-scrollableHeight + centerY + valueBoxHeight);
    else setTop(centerY - calculatedY * step);

    setTouchStartY(0);
    setBeingTouched(false);
    //setIntervalId(window.setInterval(animateSlidingToZero.bind(this), 33));
  };

  const handleItemClicked = (index: number) => {
    const step = valueBoxHeight + 16;
    setTop(centerY - index * step);
  }

  const arr = getHoursList();

  return (
    <Box width="max-content">
      {label && <Typography>{label}</Typography>}
      <Stack
        ref={containerRef}
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
          overflow: "hidden",
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
        <ValuesScrollable
          ref={scrollableRef}
          handleTouchEnd={handleTouchEnd}
          handleTouchStart={handleTouchStart}
          top={top}
          handleTouchMove={handleTouchMove}
        >
          {arr.map((item) => {
            return (
              <ValueBox
                onClick={() => handleItemClicked(arr.indexOf(item))}
                ref={valueBoxRef}
                key={item}
              >
                {item === 0 ? "00" : item}
              </ValueBox>
            );
          })}
        </ValuesScrollable>
      </Stack>
    </Box>
  );
};

export default TimePicker;
