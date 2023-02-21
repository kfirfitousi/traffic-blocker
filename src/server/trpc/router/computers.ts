import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const computersRouter = router({
  getOne: publicProcedure
    .input(z.object({ macAddress: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.computer.findFirst({
        where: {
          macAddress: {
            equals: input.macAddress,
          },
        },
        include: {
          rules: true,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.computer.findMany({
      include: {
        rules: true,
      },
    });
  }),
  assignRule: publicProcedure
    .input(
      z.object({
        macAddress: z.string(),
        ruleId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.computer.update({
        where: {
          macAddress: input.macAddress,
        },
        data: {
          rules: {
            connect: {
              id: input.ruleId,
            },
          },
        },
      });
    }),
  unassignRule: publicProcedure
    .input(
      z.object({
        macAddress: z.string(),
        ruleId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.computer.update({
        where: {
          macAddress: input?.macAddress,
        },
        data: {
          rules: {
            disconnect: {
              id: input?.ruleId,
            },
          },
        },
      });
    }),
});
