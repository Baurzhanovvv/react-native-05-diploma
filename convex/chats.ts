
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrFindChat = mutation({
    args: {
        userId1: v.id("users"),
        userId2: v.id("users"),
    },
    handler: async (ctx, args) => {
        const ids = [args.userId1, args.userId2].sort();

        const existingChats = await ctx.db.query("chats").collect();

        const foundChat = existingChats.find((chat) => {
            const sorted = [...chat.participantIds].sort();
            return JSON.stringify(sorted) === JSON.stringify(ids);
        });

        if (foundChat) return foundChat._id;

        const newChat = await ctx.db.insert("chats", {
            participantIds: ids,
            lastMessageAt: Date.now(),
        });

        return newChat;
    },
});


export const getChatsForUser = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const chats = await ctx.db.query("chats").collect();

        return chats
            .filter((chat) => chat.participantIds.includes(args.userId))
            .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    },
});


export const getChatsWithOtherUsers = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, { userId }) => {
        const chats = await ctx.db.query('chats').collect()

        const userChats = chats.filter((chat) =>
            chat.participantIds.includes(userId)
        )

        const result = await Promise.all(
            userChats.map(async (chat) => {
                const otherUserId = chat.participantIds.find((id) => id !== userId)
                const otherUser = otherUserId ? await ctx.db.get(otherUserId) : null

                return {
                    chatId: chat._id,
                    lastMessage: '', // можешь дописать
                    otherUser: {
                        fullname: otherUser?.fullname || '',
                        image: otherUser?.image || '',
                    },
                }
            })
        )

        return result
    },
})