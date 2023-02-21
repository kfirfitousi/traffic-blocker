import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const rulesRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.rule.findMany({
      include: {
        computers: true,
      },
    });
  }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
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
        name: z.string().optional(),
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
          name: input.name,
          domains: input.domains,
          ports: input.ports,
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
          id: input.id,
        },
      });
    }),
});
