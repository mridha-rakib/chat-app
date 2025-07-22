import { z, ZodError } from "zod";

export const zParse = async (schema, req) => {
  try {
    const result = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
      headers: req.headers,
    });
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
    throw new Error("Validation failed");
  }
};
