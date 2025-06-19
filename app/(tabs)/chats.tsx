import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/feed.styles'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function Chats() {
  const { user } = useUser()
  const clerkId = user?.id

  // Получаем convex-пользователя по Clerk ID
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    clerkId ? { clerkId } : 'skip'
  )

  // Получаем список чатов с инфой о собеседнике
  const chats = useQuery(
    api.chats.getChatsWithOtherUsers,
    currentUser?._id ? { userId: currentUser._id } : 'skip'
  )

  if (!chats || chats.length === 0) return <NoChatsFound />

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Чаты</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 8, paddingBottom: 80 }}>
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.chatId}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 14,
              marginBottom: 6,
              borderRadius: 12,
              backgroundColor: COLORS.surface,
              shadowColor: COLORS.primary,
              shadowOpacity: 0.07,
              shadowRadius: 2,
              elevation: 1,
            }}
            onPress={() => router.push(`/chats/${chat.chatId}`)}
          >
            {chat.otherUser.image ? (
              <Image
                source={chat.otherUser.image}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginRight: 14,
                  backgroundColor: '#eee',
                }}
                contentFit="cover"
              />
            ) : (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={44}
                color={COLORS.primary}
                style={{ marginRight: 14 }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.primary, fontSize: 18, fontWeight: 'bold' }}>
                {chat.otherUser.fullname || 'Пользователь'}
              </Text>
              <Text style={{ color: COLORS.grey, fontSize: 14, marginTop: 4 }}>
                {chat.lastMessage || 'Нет сообщений'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

function NoChatsFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 24,
      }}
    >
      <Ionicons
        name="chatbubble-ellipses-outline"
        size={60}
        color={COLORS.primary}
        style={{ marginBottom: 18 }}
      />
      <Text style={{ color: COLORS.primary, fontSize: 22, textAlign: 'center' }}>
        Нет чатов
      </Text>
      <Text style={{ color: COLORS.grey, fontSize: 16, marginTop: 10, textAlign: 'center' }}>
        Начните новый чат, чтобы он появился в этом списке.
      </Text>
    </View>
  )
}
