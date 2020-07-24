export const isDev = function() {
  return process.env.NODE_ENV === "development";
};
export const isFullDemo = function() {
  return false;
};
