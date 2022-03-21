export function toDecimal(value: number, places = 4) {
  return Number(`${Math.round(parseFloat(`${value}e${places}`))}e-${places}`);
}
