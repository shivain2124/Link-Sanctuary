import { z } from "zod";

const SignUpSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { error: "Username must not be lesser than 3 characters" })
    .max(25, { error: "Username must not be greater than 25 characters" }),

  password: z.string().min(4, { error: "Password should be longer" }),

  confirmPassword: z.string(),
});

type ISignUpSchema = z.infer<typeof SignUpSchema>;

const LoginSchema = z.object({
  username: z.string().min(1, { error: "Field cannot be empty" }),
  password: z.string().min(1, { error: "Field cannot be empty" }),
});

type ILoginSchema = z.infer<typeof LoginSchema>;
