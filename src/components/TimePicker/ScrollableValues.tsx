import { Box, BoxProps } from "@mui/material";
import {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Props = {
  centerY: number;
  handleValueBoxHeight: (height: number) => void;
  containerHeight: number;
  valueBoxHeight: number;
  step: number;
  first: number;
  last: number;
  onChange?: (value: string) => void;
  initValue: string;
  disableDialogScroll: (val: boolean) => void;
};

const ValueBox = forwardRef(
  ({ children, ...props }: BoxProps & PropsWithChildren, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          fontSize: 18,
          lineHeight: "18px",
          zIndex: 200,
          width: "100%",
          textAlign: "center",
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

const ScrollableValues = ({
  centerY,
  handleValueBoxHeight,
  containerHeight,
  valueBoxHeight,
  first,
  last,
  step,
  onChange,
  initValue,
  disableDialogScroll,
}: Props) => {
  const initialTop = valueBoxHeight + 16;
  const initIndex = Number(initValue) / step;

  const [top, setTop] = useState<number>(51 - initIndex * initialTop);
  const [beingTouched, setBeingTouched] = useState(false);
  const [originalOffset, setOriginalOffset] = useState(0);
  const [timeOfLastDragEvent, setTimeOfLastDragEvent] = useState(0);
  const [prevTouchY, setPrevTouchY] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  //@ts-ignore
  const [velocity, setVelocity] = useState(0);
  //@ts-ignore
  const [intervalId, setIntervalId] = useState<number>();
  const [scrollableHeight, setScrollableHeight] = useState(800);
  const valueBoxRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    const result = [] as number[];
    for (let i = first; i <= last; i = i + step) {
      result.push(i);
    }
    return result;
  }, [first, last, step]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    disableDialogScroll(true);
    e.stopPropagation();
    setBeingTouched(true);
    setOriginalOffset(e.currentTarget.offsetTop);
    setTouchStartY(e.targetTouches[0].clientY);
    setTimeOfLastDragEvent(Date.now());
    setIntervalId(undefined);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
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

  const centralize = () => {
    const step = valueBoxHeight + 16;
    const calculatedY = Math.round((centerY - top) / step);

    if (top > centerY) setTop(centerY);
    else if (top < -scrollableHeight + 60)
      setTop(-scrollableHeight + centerY + valueBoxHeight);
    else setTop(centerY - calculatedY * step);

    setTouchStartY(0);
    setBeingTouched(false);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    disableDialogScroll(false);
    e.stopPropagation();
    centralize();
    //setIntervalId(window.setInterval(animateSlidingToZero.bind(this), 33));
  };

  const handleOnWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (beingTouched) return;

    const scrollDown = e.deltaY > 0;

    if (
      (!scrollDown && top < centerY) ||
      (scrollDown && top > -scrollableHeight + centerY + valueBoxHeight)
    )
      setTop(
        (prev) =>
          prev + (e.deltaY < 0 ? valueBoxHeight + 16 : -(valueBoxHeight + 16))
      );
  };

  const handleItemClicked = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    e.stopPropagation();
    const step = valueBoxHeight + 16;
    setTop(centerY - index * step);
  };

  useEffect(() => {
    if (!beingTouched && onChange) {
      const height = valueBoxHeight + 16;
      const value =
        (((top - centerY) * step) / height) * (top - centerY < 0 ? -1 : 1);
      onChange((value < 10 ? `0${value}` : value).toString());
    }
  }, [top]);

  //   const animateSlidingToZero = () => {
  //     let vel = velocity;
  //     let t = Number(top);
  //     if (!beingTouched && Number(top) < -0.01) {
  //       vel += 10 * 0.033;

  //       t += velocity;
  //       if (t < -350) {
  //         window.clearInterval(intervalId);
  //         //this.handleRemoveSelf();
  //       }
  //       setTop(t);
  //       setVelocity(vel);
  //     } else if (!beingTouched) {
  //       t = 0;
  //       vel = 0;
  //       window.clearInterval(intervalId);

  //       setTop(t);
  //       setVelocity(vel);
  //       setIntervalId(undefined);
  //       setOriginalOffset(0);
  //     }
  //   };

  useEffect(() => {
    if (!valueBoxRef.current || !scrollableRef.current) return;
    const valueBoxHeight = valueBoxRef.current?.offsetHeight
      ? valueBoxRef.current?.offsetHeight
      : 18;
    const height = scrollableRef.current?.offsetHeight;
    handleValueBoxHeight(valueBoxHeight);
    setScrollableHeight(height);
    //setTop((containerHeight - valueBoxHeight) / 2);
  }, [containerHeight, valueBoxRef.current, scrollableRef.current]);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        cursor: "pointer",
        overflowY: "sroll",
      }}
      onWheel={handleOnWheel}
    >
      <Box
        ref={scrollableRef}
        sx={{
          position: "absolute",
          top: top,
          zIndex: 100,
          transition: "all 0.1s ease-out",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        gap={2}
        alignItems="center"
      >
        {items.map((item) => (
          <ValueBox
            onClick={(e) => handleItemClicked(e, items.indexOf(item))}
            className=".value-box"
            key={item}
            ref={valueBoxRef}
          >
            {item < 10 ? `0${item}` : item}
          </ValueBox>
        ))}
      </Box>
    </Box>
  );
};

export default ScrollableValues;
