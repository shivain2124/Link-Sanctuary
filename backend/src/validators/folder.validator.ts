import { z } from "zod";

const CreateFolderSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name should not be lesser than 2 characters" })
    .max(25),

  parentId: z.string().optional().nullable(),
});

export { CreateFolderSchema };
