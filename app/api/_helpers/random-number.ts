import rn from "random-number";

export function randomNumber(
  min: number = 100000,
  max: number = 999999
): number {
  const options = {
    min: min,
    max: max,
    integer: true,
  };
  return rn(options);
}
