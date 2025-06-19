
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Отправка сообщения
export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      senderId: args.senderId,
      content: args.content,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.chatId, {
      lastMessageAt: Date.now(),
    });
  },
});

// Получение сообщений чата
export const getMessagesForChat = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    return messages.sort((a, b) => a.createdAt - b.createdAt);
  },
});
