import { getCardDataController } from "../src/controllers/card.controller";
import * as redisDb from "../src/db/redis.db";
import tokenService from "../src/services/token.service";

jest.mock("../src/services/token.service");
jest.mock("../src/db/redis.db");

describe("Card Controllers", () => {
  let mockEvent: any;

  beforeEach(() => {
    mockEvent = {
      pathParameters: { token: "mockToken" },
      headers: {
        Authorization: "Bearer pk_test_LsRBKejzCOEEWOsw",
      },
    };

    jest.resetAllMocks();
  });

  describe("getCardDataController", () => {
    test("debe retornar un statusCode 200 y los datos de la tarjeta cuando se complete la solicitud", async () => {
      const mockCardData = {
        card_number: "4111111111111111",
        expiration_month: "12",
        expiration_year: "2023",
        email: "test@example.com",
      };
      const getCardDataMock = jest.spyOn(redisDb, "getCardData").mockResolvedValue(mockCardData);

      const result = await getCardDataController(mockEvent);

      expect(getCardDataMock).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({
        card_number: mockCardData.card_number,
        expiration_month: mockCardData.expiration_month,
        expiration_year: mockCardData.expiration_year,
        email: mockCardData.email,
      });
    });

    test("debe retornar un statusCode 400 y mensaje de error cuando el Bearer PK es nulo o no es válido", async () => {
      jest.spyOn(tokenService, "getHeaderPK").mockImplementation(() => {
        throw new Error("Unauthorized: Bearer PK es nulo o no es válido");
      });

      const result = await getCardDataController(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: "Unauthorized: Bearer PK es nulo o no es válido" });
    });

    test("debe retornar un statusCode 400 y un mensaje de error cuando no se encuentre los datos", async () => {
      jest.spyOn(redisDb, "getCardData").mockResolvedValue(undefined);

      const result = await getCardDataController(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: "BadRequest: Datos de tarjeta no encontrados" });
    });
  });
});
