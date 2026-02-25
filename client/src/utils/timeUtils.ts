export const generateTimeOptions = (step: number) => {
  const options = Array.from({ length: (24 * 60) / step }, (_, i) => {
    const totalMinutes = i * step;
    const h = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (totalMinutes % 60).toString().padStart(2, "0");
    return { value: `${h}:${m}`, label: `${h}:${m}`, icon: "icon-clock" };
  });

  const now = new Date();
  let hours = now.getHours();
  let minutes = Math.ceil(now.getMinutes() / step) * step;
  if (minutes === 60) {
    hours = (hours + 1) % 24;
    minutes = 0;
  }

  const currentTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  const idx = options.findIndex((o) => o.value === currentTime);

  if (idx === -1) return options;
  return [...options.slice(idx), ...options.slice(0, idx)];
};
