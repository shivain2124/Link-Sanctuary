import { z } from "zod";

const LinkSchema = z.object({
  title: z
    .string()
    .min(3, { error: "Title shouldn't be lesser than 3 characters" }),

  url: z.url({ error: "URL cannot be Empty!" }),

  description: z.string().optional(),

  parentId: z.string({ error: "Folder is required" }).min(1),
});

type ILinkSchema = z.infer<typeof LinkSchema>;

export type { ILinkSchema };
export { LinkSchema };
