import { todoInput } from "~/types";
import { z } from "zod";
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

  //delete a todo and u must be authenticated

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input,
        },
      });
    }),

  //update a todo a todo and u must be authenticated

  toggle: protectedProcedure
    .input(z.object({ id: z.string(), done: z.boolean() }))
    .mutation(async ({ ctx, input: { id, done } }) => {
      return ctx.prisma.todo.update({
        where: {
          id,
        },
        data: {
          done,
        },
      });
    }),
});
