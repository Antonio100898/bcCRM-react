export function validateIp(s: string) {
  if (s === " " || s === "") return true;
  const rgx = /^[0-9]*\.?[0-9]*$/;
  return s.match(rgx);
}
