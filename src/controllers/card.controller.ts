import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import tokenService from "../services/token.service";
import { getCardData } from "../db/redis.db";

export const getCardDataController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const token = event.pathParameters?.token;
    tokenService.getHeaderPK(event.headers["Authorization"] || "");

    const data = await getCardData(token || "");

    if (!data || (data && Object.keys(data).length === 0 && data.constructor === Object)) {
      throw new Error("BadRequest: Datos de tarjeta no encontrados");
    } else {
      const res = {
        card_number: data.card_number,
        expiration_month: data.expiration_month,
        expiration_year: data.expiration_year,
        email: data.email,
      };

      return {
        statusCode: 200,
        body: JSON.stringify(res),
      };
    }
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
