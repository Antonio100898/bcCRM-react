import dayjs from "dayjs";

export function getTimeString(sTime: string | undefined) {
  const d = dayjs(sTime);
  const h = d.hour();
  let m = d.minute();
  if (m !== 0 && m !== 15 && m !== 30 && m !== 45) {
    if (m > 45) {
      m = 45;
    }
    if (m < 15) {
      m = 0;
    }
    if (m > 15 && m < 30) {
      m = 15;
    }
    if (m > 30 && m < 45) {
      m = 30;
    }
  }

  const s = `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}`;
  return s;
}