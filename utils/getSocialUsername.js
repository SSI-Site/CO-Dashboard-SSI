export default function getSocialUsername (value, network) {
    if (!value) return "";

    const rawValue = String(value).trim();
    const normalizedValue = /^https?:\/\//i.test(rawValue)
        ? rawValue
        : `https://${rawValue}`;

    try {
        const url = new URL(normalizedValue);
        const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
        const segments = url.pathname.split("/").filter(Boolean);

        if (network === "instagram") {
            if (hostname.includes("instagram.com") && segments.length > 0) {
                return `@${segments[0]}`;
            }
            return rawValue;
        }

        if (network === "linkedin") {
            if (
                hostname.includes("linkedin.com") &&
                segments.length > 1 &&
                segments[0] === "in"
            ) {
                return `@${segments[1]}`;
            }
            return rawValue;
        }
    } catch (error) {
        return rawValue;
    }

    return rawValue;
};