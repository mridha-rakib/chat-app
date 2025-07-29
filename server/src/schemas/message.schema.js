import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine(
  (val) => {
    try {
      return mongoose.Types.ObjectId.isValid(val); // ✅ Use isValid() instead of constructor
    } catch {
      return false;
    }
  },
  {
    message: "Invalid ObjectId format",
  }
);


export const sendMessageSchema = z.object({
  body: z.object({
    message: z
      .string()
      .min(1, "Message cannot be empty")
      .max(1000, "Message must not exceed 1000 characters")
      .trim(),
  }),
  params: z.object({
    id: objectIdSchema,
  }),
});

export const getMessagesSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
