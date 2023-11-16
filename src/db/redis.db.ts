import { createClient } from "redis";
import { ICreateToken } from "../controllers/token.controller";
import * as crypto from "crypto-js";

if (process.env.NODE_ENV !== "PROD") {
  require("dotenv").config();
}

const EXPIRATION_TIME = 15 * 60;
const CLIENT = createClient();
const SECRET_KEY: string = process.env.SECRET_KEY || "";

export const setCardData = async (data: ICreateToken) => {
  let key: string = "";

  try {
    await CLIENT.connect();

    do {
      key = generateRandomId();
    } while ((await CLIENT.exists(key)) === 1);

    data.token = key;

    const value = JSON.stringify(data);
    const encryptValue = crypto.AES.encrypt(value, SECRET_KEY).toString();
    await CLIENT.set(key, encryptValue, { EX: EXPIRATION_TIME });
    return key;
  } catch (error: any) {
    throw new Error(`InternalServerError: Error al guardar los datos en Redis: ${error.message}`);
  } finally {
    CLIENT.disconnect();
  }
};

export const getCardData = async (key: string) => {
  let data: any;

  try {
    await CLIENT.connect();

    const value = await CLIENT.get(key);
    const decryptValue = crypto.AES.decrypt(value || "", SECRET_KEY).toString(crypto.enc.Utf8);

    data = JSON.parse(decryptValue || "{}");
    return data;
  } catch (error: any) {
    throw new Error(`InternalServerError: Error al leer los datos de Redis: ${error.message}`);
  } finally {
    CLIENT.disconnect();
  }
};

const generateRandomId = () => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const idLength = 16;

  let randomId = "";

  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
};
