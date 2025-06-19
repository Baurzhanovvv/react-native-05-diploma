import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { useUser } from '@clerk/clerk-expo'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'


export default function ChatScreen() {
  const { chatId: rawChatId } = useLocalSearchParams<{ chatId: string }>()

  const chatId = rawChatId as Id<"chats">
  
  const router = useRouter()
  const { user } = useUser()
  const scrollRef = useRef<ScrollView>(null)
  const [input, setInput] = useState('')

  const currentUser = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip')
  const messages = useQuery(api.messages.getMessagesForChat, chatId ? { chatId } : "skip")
  const sendMessage = useMutation(api.messages.sendMessage)

  const handleSend = async () => {
    if (!input.trim() || !currentUser?._id) return
    await sendMessage({
      chatId,
      senderId: currentUser._id,
      content: input.trim(),
    })
    setInput('')
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  const handleBack = () => {
    if (router.canGoBack()) router.back()
    else router.replace('/(tabs)')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Чат</Text>
        <View></View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages?.map((msg) => {
          const isMe = msg.senderId === currentUser?._id
          return (
            <View
              key={msg._id}
              style={[
                styles.messageBubble,
                isMe ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
              <Text style={styles.timeText}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )
        })}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Сообщение..."
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  scroll: { flex: 1 },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  messageText: { color: COLORS.white, fontSize: 16 },
  timeText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: COLORS.grey,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.grey,
    marginRight: 10,
    color: COLORS.primary,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
