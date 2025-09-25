export class PhoneNumberVO {
  private constructor(private readonly value: string) {}

  static create(phone: string): PhoneNumberVO {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length < 10 || cleaned.length > 10) {
      throw new Error("Invalid phone number");
    }

    return new PhoneNumberVO(cleaned);
  }
}
