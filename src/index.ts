import { Handler, APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from "aws-lambda";
import { createTokenController } from "./controllers/token.controller";
import { getCardDataController } from "./controllers/card.controller";

export const createTokenHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResult> => {
  try {
    const result = await createTokenController(event);

    return result;
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const getCardDataHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResult> => {
  try {
    const result = await getCardDataController(event);

    return result;
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
