export function pureNumber(formattedNumber: string): string {
  return formattedNumber.replace(/[^A-Z0-9]/ig, '');
}
