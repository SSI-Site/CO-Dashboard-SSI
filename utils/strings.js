export const truncateText = (value, maxLength = 20) => {
    if (!value) return "";

    const text = String(value);
    if (text.length <= maxLength) return text;

    return `${text.slice(0, maxLength - 1).trimEnd()}...`;
};