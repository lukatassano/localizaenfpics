export function call(phoneNumber: string): void {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  const telUrl = `tel:${cleanedPhoneNumber}`;
  window.location.href = telUrl;
}
