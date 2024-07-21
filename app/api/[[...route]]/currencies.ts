import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createId } from "@paralleldrive/cuid2";

import { userCurrencies, insertUserCurrencySchema } from "@/db/schema";

const app = new Hono()
    .get(
        "/",
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db.select({
                id: userCurrencies.id,
                currency: userCurrencies.currency,
            })
                .from(userCurrencies)
                .where(eq(userCurrencies.userId, auth.userId));

            return c.json({ data });
        })
    .get(
        "/:id",
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db
                .select({ id: userCurrencies.id, currency: userCurrencies.currency })
                .from(userCurrencies)
                .where(
                    and(
                        eq(userCurrencies.userId, auth.userId),
                        eq(userCurrencies.id, id)
                    ),
                );
            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
        }
    )
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertUserCurrencySchema.pick({
            currency: true,
        })),
        async (c) => {
            const auth = getAuth(c);
    
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
    
            // Vérifier si l'utilisateur a déjà une devise
            const existingCurrency = await db.select()
                .from(userCurrencies)
                .where(eq(userCurrencies.userId, auth.userId))
                .limit(1)
                .execute();
    
            if (existingCurrency.length > 0) {
                return c.json({ error: "User already has a currency" }, 400);
            }
    
            const values = c.req.valid("json");
            const [data] = await db.insert(userCurrencies).values({
                id: createId(),
                userId: auth.userId,
                ...values,
            }).returning();
    
            return c.json({ data });
        }
    )
    
    .patch(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            }),
        ),
        zValidator(
            "json",
            insertUserCurrencySchema.pick({
                currency: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db
                .update(userCurrencies)
                .set(values)
                .where(
                    and(
                        eq(userCurrencies.userId, auth.userId),
                        eq(userCurrencies.id, id),
                    )
                )
                .returning();

            if (!data) {
                return c.json({ error: "Not found" }, 404)
            }

            return c.json({ data });
        }
    )
    .delete(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            }),
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db
                .delete(userCurrencies)
                .where(
                    and(
                        eq(userCurrencies.userId, auth.userId),
                        eq(userCurrencies.id, id),
                    )
                )
                .returning({
                    id: userCurrencies.id,
                });

            if (!data) {
                return c.json({ error: "Not found" }, 404)
            }

            return c.json({ data });
        }
    );

export default app;
