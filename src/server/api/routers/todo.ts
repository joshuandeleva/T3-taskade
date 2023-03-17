import { todoInput } from "~/types";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  //fetch all todos @ authenticated users can only fetch  b todos
  all: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    console.log(
      "Todos from prisma",
      todos.map(({ id, text, done }) => ({ id, text, done }))
    );
    return [
      {
        id: "fake",
        text: "fake txt",
        done: false,
      },
      {
        id: "fake2",
        text: "fake txt2",
        done: true,
      },
    ];
  }),

  //create a todo and u must be authenticated

  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          text: input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
