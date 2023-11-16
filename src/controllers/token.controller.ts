import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import TokenService from "../services/token.service";
import { setCardData } from "../db/redis.db";

export const createTokenController = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    TokenService.getHeaderPK(event.headers["Authorization"] || "");

    const { card_number, cvv, expiration_month, expiration_year, email }: ICreateToken = JSON.parse(event.body || "{}");

    const cardType = TokenService.getCardType(card_number);

    TokenService.isValidCVV(cvv, cardType);
    TokenService.isValidMonth(expiration_month);
    TokenService.isValidYear(expiration_year);
    TokenService.isValidEmail(email);

    const token: string = await setCardData({
      card_number,
      cvv,
      expiration_month,
      expiration_year,
      email,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export interface ICreateToken {
  token?: string;
  card_number: string;
  cvv: string;
  expiration_month: string;
  expiration_year: string;
  email: string;
}
