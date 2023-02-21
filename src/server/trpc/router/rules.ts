import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const rulesRouter = router({
  getAll: publicProcedure
    .input(z.object({ includeComputers: z.boolean().optional() }).optional())
    .query(({ ctx, input }) => {
      return ctx.prisma.rule.findMany({
        include: {
          computers: input?.includeComputers,
        },
      });
    }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
        domains: z.string().optional(),
        ports: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rule.create({
        data: {
          name: input.name,
          domains: input.domains || "",
          ports: input.ports || "",
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        domains: z.string().optional(),
        ports: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rule.update({
        where: {
          id: input.id,
        },
        data: {
          domains: input?.domains || "",
          ports: input?.ports || "",
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rule.delete({
        where: {
          id: input?.id,
        },
      });
    }),
});
