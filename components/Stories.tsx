import { ScrollView, TouchableOpacity, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useUser } from '@clerk/clerk-expo'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { router } from 'expo-router'
import { styles } from '@/styles/feed.styles'

const RecentChats = () => {
  const { user } = useUser()
  const clerkId = user?.id

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    clerkId ? { clerkId } : 'skip'
  )

  const chats = useQuery(
    api.chats.getChatsWithOtherUsers,
    currentUser?._id ? { userId: currentUser._id } : 'skip'
  )

  if (!chats || chats.length === 0) return null

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
      contentContainerStyle={{ paddingHorizontal: 12 }}
    >
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.chatId}
          style={{ alignItems: 'center', marginRight: 12 }}
          onPress={() => router.push(`/chats/${chat.chatId}`)}
        >
          <Image
            source={chat.otherUser.image}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#ccc',
              marginBottom: 6,
            }}
            contentFit="cover"
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: '#aaa',
              textAlign: 'center',
              maxWidth: 72,
            }}
          >
            {chat.otherUser.fullname || 'Пользователь'}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default RecentChats
