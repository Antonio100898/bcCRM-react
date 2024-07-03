export interface IOption {
  label: string;
  value: string;
}
export const getHoursOptions = () => {
  const hours: IOption[] = [];

  for (let i = 0; i < 24; i += 1) {
    for (let z = 0; z < 4; z += 1) {
      const s = `${`0${i}`.slice(-2)}:${`0${z * 15}`.slice(-2)}`;
      const a = { label: s, value: s };
      hours.push(a);
    }
  }

  return hours;
};
