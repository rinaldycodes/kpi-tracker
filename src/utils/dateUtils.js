export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // format: "2025-05-20"
};
