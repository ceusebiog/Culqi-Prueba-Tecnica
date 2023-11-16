import { APIGatewayProxyResult } from "aws-lambda";
import { createTokenController } from "../src/controllers/token.controller";
import * as redisDb from "../src/db/redis.db";
import tokenService from "../src/services/token.service";

jest.mock("../src/services/token.service");
jest.mock("../src/db/redis.db");

describe("Token Controllers", () => {
  let mockEvent: any;

  beforeEach(() => {
    mockEvent = {
      headers: {
        Authorization: "Bearer pk_test_LsRBKejzCOEEWOsw",
      },
      body: JSON.stringify({
        card_number: "4111111111111111",
        cvv: "123",
        expiration_month: "12",
        expiration_year: "2023",
        email: "test@example.com",
      }),
    };

    jest.resetAllMocks();
  });

  describe("createTokenController", () => {
    test("debe retornar un statusCode 200 y un token cuando la creación sea completado", async () => {
      const mockToken = "mockToken";
      const setCardDataMock = jest.spyOn(redisDb, "setCardData").mockResolvedValue(mockToken);

      const result = await createTokenController(mockEvent);

      expect(setCardDataMock).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ token: mockToken });
    });

    test("debe retornar un statusCode 400 y mensaje de error cuando el Bearer PK es nulo o no es válido", async () => {
      jest.spyOn(tokenService, "getHeaderPK").mockImplementation(() => {
        throw new Error("Unauthorized: Bearer PK es nulo o no es válido");
      });

      let result: APIGatewayProxyResult;
      result = await createTokenController(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: "Unauthorized: Bearer PK es nulo o no es válido" });
    });

    test("debe retornar un statusCode 400 y mensaje de error cuando el card_number es nulo o no es válido", async () => {
      jest.spyOn(tokenService, "getCardType").mockImplementation(() => {
        throw new Error("Unauthorized: card_number es nulo o no es válido");
      });

      let result: APIGatewayProxyResult;
      result = await createTokenController(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: "Unauthorized: card_number es nulo o no es válido" });
    });

    test("debe retornar un statusCode 400 y mensaje de error cuando el cvv es nulo o no es válido", async () => {
      jest.spyOn(tokenService, "isValidCVV").mockImplementation(() => {
        throw new Error("Unauthorized: cvv es nulo o no es válido");
      });

      let result: APIGatewayProxyResult;
      result = await createTokenController(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: "Unauthorized: cvv es nulo o no es válido" });
    });

    test("debe retornar un statusCode 400 y mensaje de error cuando el expiration_month es nulo o no es válido", async () => {
      jest.spyOn(tokenService, "isValidMonth").mockImplementation(() => {
        throw new Error("Unauthorized: expiration_month es nulo o no es válido");
      });

      let result: APIGatewayProxyResult;
      result = await createTokenController(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: "Unauthorized: expiration_month es nulo o no es válido" });
    });

    test("debe retornar un statusCode 400 y mensaje de error cuando el expiration_year es nulo o no es válido", async () => {
      jest.spyOn(tokenService, "isValidYear").mockImplementation(() => {
        throw new Error("Unauthorized: expiration_year es nulo o no es válido");
      });

      let result: APIGatewayProxyResult;
      result = await createTokenController(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: "Unauthorized: expiration_year es nulo o no es válido" });
    });

    test("debe retornar un statusCode 400 y mensaje de error cuando el email es nulo o no es válido", async () => {
      jest.spyOn(tokenService, "isValidEmail").mockImplementation(() => {
        throw new Error("Unauthorized: email es nulo o no es válido");
      });

      let result: APIGatewayProxyResult;
      result = await createTokenController(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: "Unauthorized: email es nulo o no es válido" });
    });

    test("debe retornar un statusCode 400 y mensaje de error cuando hubo un error al guardar los datos en Redis", async () => {
      const setCardDataMock = jest.spyOn(redisDb, "setCardData").mockImplementation(() => {
        throw new Error("InternalServerError: Error al guardar los datos en Redis");
      });

      const result = await createTokenController(mockEvent);

      expect(setCardDataMock).toHaveBeenCalled();
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: "InternalServerError: Error al guardar los datos en Redis" });
    });
  });
});
