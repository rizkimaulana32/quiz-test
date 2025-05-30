export const shuffleOptions = (correct: string, incorrect: string[]) => {
  const options = [...incorrect, correct];
  return options.sort(() => Math.random() - 0.5);
};

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};
