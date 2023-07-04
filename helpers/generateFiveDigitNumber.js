exports.generateFiveDigitNumber = () => {
  const min = 10000; // Minimum 5-digit number (inclusive)
  const max = 99999; // Maximum 5-digit number (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
console.log(this.generateFiveDigitNumber());
