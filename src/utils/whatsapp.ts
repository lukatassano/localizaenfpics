export function openWhatsApp(phoneNumber: string): void {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanedPhoneNumber}`;
  window.open(whatsappUrl, '_blank');
}
