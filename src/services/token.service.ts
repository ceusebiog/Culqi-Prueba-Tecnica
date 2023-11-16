export class TokenService {
  getHeaderPK = (bearerToken: string): string => {
    if (bearerToken && bearerToken.trim().length > 0) {
      const [type, pk] = bearerToken.split(" ") ?? [];
      if (type === "Bearer") {
        const pattern = /^pk_[A-Za-z0-9]{4}_[A-Za-z0-9]{16}$/;
        if (pattern.test(pk)) return pk;
      }
    }
    throw new Error("Unauthorized: Bearer PK es nulo o no es válido");
  };

  getCardType = (cardNumber: string): string => {
    const cardIsValid = this.luhnCheck(cardNumber || "");
    const cardType = this.detectCardType(cardNumber);

    if (!cardIsValid || cardType === "unknown") throw new Error("BadRequest: card_number es nulo o no es válido");
    else return cardType;
  };

  luhnCheck = (cardNumber: string): boolean | number => {
    const arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
    var len = cardNumber.length,
      bit = 1,
      sum = 0,
      val;

    if (len < 13 || len > 16) return false;

    while (len) {
      val = parseInt(cardNumber.charAt(--len), 10);
      sum += (bit ^= 1) ? arr[val] : val;
    }

    return sum && sum % 10 === 0;
  };

  detectCardType = (cardNumber: string): string => {
    const cardTypeRegex: Record<string, RegExp> = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
    };

    for (const type in cardTypeRegex) {
      if (cardTypeRegex[type].test(cardNumber)) {
        return type;
      }
    }
    return "unknown";
  };

  isValidCVV = (cvv: string, cardType: string): boolean => {
    switch (cardType) {
      case "visa":
      case "mastercard":
        if (/^[0-9]{3}$/.test(cvv)) return true;
        break;
      case "amex":
        if (/^[0-9]{4}$/.test(cvv)) return true;
        break;
    }

    throw new Error("BadRequest: cvv es nulo o no es válido");
  };

  isValidMonth = (month: string): boolean => {
    const monthRegex = /^(0?[1-9]|1[0-2])$/;

    if (monthRegex.test(month)) {
      const monthNumber = parseInt(month, 10);

      if (monthNumber >= 1 && monthNumber <= 12) return true;
    }

    throw new Error("BadRequest: expiration_month es nulo o no es válido");
  };

  isValidYear = (year: string): boolean => {
    const yearRegex = /^20\d{2}$/;

    if (yearRegex.test(year)) {
      const currentYear = new Date().getFullYear();
      const yearNumber = parseInt(year, 10);

      if (yearNumber >= currentYear && yearNumber <= currentYear + 5) return true;
    }

    throw new Error("BadRequest: expiration_year es nulo o no es válido");
  };

  isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|hotmail\.com|yahoo\.es)$/;

    if (emailRegex.test(email) && email.length >= 5 && email.length <= 100) return true;
    else throw new Error("BadRequest: email es nulo o no es válido");
  };
}

export default new TokenService();
