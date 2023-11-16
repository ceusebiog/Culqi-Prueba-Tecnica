import { TokenService } from "../src/services/token.service";

describe("TokenService", () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  describe("getHeaderPK", () => {
    test("debe retornar PK cuando el Bearer Token es válido", () => {
      const validBearerToken = "Bearer pk_test_LsRBKejzCOEEWOsw";
      expect(tokenService.getHeaderPK(validBearerToken)).toEqual("pk_test_LsRBKejzCOEEWOsw");
    });

    test("debe retornar un error cuando el Bearer Token es inválido", () => {
      expect(() => tokenService.getHeaderPK("invalidToken")).toThrow("Unauthorized: Bearer PK es nulo o no es válido");
    });
  });

  describe("getCardType", () => {
    test("debe retornar el tipo de tarjeta cuando el número de tarjeta es válido", () => {
      const validCardNumber = "4111111111111111";
      expect(tokenService.getCardType(validCardNumber)).toEqual("visa");
    });

    test("debe retornar un error cuando el número de tarjeta es inválido", () => {
      expect(() => tokenService.getCardType("invalidCard")).toThrow("BadRequest: card_number es nulo o no es válido");
    });
  });

  describe("luhnCheck", () => {
    test("debe retornar verdadero cuando el número de tarjeta es válido", () => {
      const validCardNumber = "4111111111111111";
      const result = tokenService.luhnCheck(validCardNumber);
      expect(result).toBe(true);
    });

    test("debe retornar falso cuando el número de tarjeta es inválido", () => {
      const invalidCardNumber = "4111111111111112";
      const result = tokenService.luhnCheck(invalidCardNumber);
      expect(result).toBe(false);
    });
  });

  describe("detectCardType", () => {
    test("debe retornar el tipo de tarjeta VISA", () => {
      const visaCardNumber = "4111111111111111";
      const result = tokenService.detectCardType(visaCardNumber);
      expect(result).toBe("visa");
    });

    test("debe retornar el tipo de tarjeta MASTERCARD", () => {
      const mastercardCardNumber = "5111111111111111";
      const result = tokenService.detectCardType(mastercardCardNumber);
      expect(result).toBe("mastercard");
    });

    test("debe retornar el tipo de tarjeta AMEX", () => {
      const amexCardNumber = "371111111111111";
      const result = tokenService.detectCardType(amexCardNumber);
      expect(result).toBe("amex");
    });

    test('debe retornar "unknown" para un número de tarjeta inválido', () => {
      const unknownCardNumber = "6011111111111111";
      const result = tokenService.detectCardType(unknownCardNumber);
      expect(result).toBe("unknown");
    });
  });

  describe("isValidCVV", () => {
    test("debe retornar verdadero para un CVV válido para VISA", () => {
      const validCVV = "123";
      const result = tokenService.isValidCVV(validCVV, "visa");
      expect(result).toBe(true);
    });

    test("debe retornar verdadero para un CVV válido para MASTERCARD", () => {
      const validCVV = "123";
      const result = tokenService.isValidCVV(validCVV, "mastercard");
      expect(result).toBe(true);
    });

    test("debe retornar verdadero para un CVV válido para AMEX", () => {
      const validCVV = "1234";
      const result = tokenService.isValidCVV(validCVV, "amex");
      expect(result).toBe(true);
    });

    test("debe retornar un error para un CVV inválido", () => {
      const invalidCVV = "12";
      expect(() => tokenService.isValidCVV(invalidCVV, "visa")).toThrow("BadRequest: cvv es nulo o no es válido");
    });
  });

  describe("isValidMonth", () => {
    test("debe retornar verdadero para un mes válido", () => {
      expect(tokenService.isValidMonth("01")).toBe(true);
      expect(tokenService.isValidMonth("12")).toBe(true);
    });

    test("debe retornar error para un mes inválido", () => {
      expect(() => tokenService.isValidMonth("13")).toThrow("BadRequest: expiration_month es nulo o no es válido");
      expect(() => tokenService.isValidMonth("00")).toThrow("BadRequest: expiration_month es nulo o no es válido");
      expect(() => tokenService.isValidMonth("abc")).toThrow("BadRequest: expiration_month es nulo o no es válido");
    });
  });

  describe("isValidYear", () => {
    test("debe retornar verdadero para un año válido", () => {
      const currentYear = new Date().getFullYear();
      expect(tokenService.isValidYear((currentYear + 1).toString())).toBe(true);
    });

    test("debe retornar error para un año inválido", () => {
      expect(() => tokenService.isValidYear("1999")).toThrow("BadRequest: expiration_year es nulo o no es válido");
      expect(() => tokenService.isValidYear("3000")).toThrow("BadRequest: expiration_year es nulo o no es válido");
      expect(() => tokenService.isValidYear("abc")).toThrow("BadRequest: expiration_year es nulo o no es válido");
    });
  });

  describe("isValidEmail", () => {
    test("debe retornar verdadero para un email válido", () => {
      expect(tokenService.isValidEmail("user@hotmail.com")).toBe(true);
      expect(tokenService.isValidEmail("test@gmail.com")).toBe(true);
    });

    test("debe retornar error para un email inválido", () => {
      expect(() => tokenService.isValidEmail("invalid.email")).toThrow("BadRequest: email es nulo o no es válido");
      expect(() => tokenService.isValidEmail("user@unknown")).toThrow("BadRequest: email es nulo o no es válido");
      expect(() => tokenService.isValidEmail("test@yahoo.com")).toThrow("BadRequest: email es nulo o no es válido");
    });
  });
});
