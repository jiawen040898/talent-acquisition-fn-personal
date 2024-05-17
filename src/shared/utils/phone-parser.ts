export function parseNumber(inputPhoneStr: string): string {
    /** remove +, -, alphabets and spaces */
    const cleanedPhoneStr = inputPhoneStr
        .replace(/\s|-|\+/g, '')
        .replace(/\D/g, '')
        .replace(/ /g, '')
        .trim();
    return cleanedPhoneStr;
}
