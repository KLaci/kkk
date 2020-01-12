export const recalculateSum = entries => {
  const date = new Date();
  for (let entry of entries) {
    if (entry.checkinTime > new Date(date.getFullYear(), date.getMonth(), 1)) {
      entry.sumTime =
        (entry.sumTime ?? 0) +
        (entry.checkoutTime.getTime() - entry.checkinTime.getTime());
    }
  }
};
