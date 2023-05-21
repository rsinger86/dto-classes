
export function isNumeric(n): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
}