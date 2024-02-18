export const nullNumber = (value: any) => {
  return value === undefined || value === null || value <= 0;
}

export const nullString = (value: any) => {
  return value === undefined || value === null || value === "";
}