
/**
 * @desc    Generate a standardized receipt number
 * @format  RCP-YYYYMMDD-XXXXX (e.g., RCP-20240201-12345)
 */
const generateReceiptNumber = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digit random number
    return `RCP-${dateStr}-${randomNum}`;
};

module.exports = { generateReceiptNumber };
