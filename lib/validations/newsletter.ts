import { z } from "zod";

export const newsletterSchema = z.object({
    email: z
        .string({ required_error: "L'e-mail est requis" })
        .email({ message: "Veuillez entrer une adresse e-mail valide" }),
});
