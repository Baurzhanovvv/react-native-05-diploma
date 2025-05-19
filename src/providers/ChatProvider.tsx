import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { StreamChat } from 'stream-chat'
import { Chat, OverlayProvider } from "stream-chat-expo";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_API_KEY!);

export default function ChatProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState<boolean>()

    useEffect(() => {
        const connect = async () => {
            try {
                await client.connectUser(
                    {
                        id: "jlahey",
                        name: "Jim Lahey",
                        image: "https://i.imgur.com/fR9Jz14.png",
                    },
                    client.devToken("jlahey")
                );
                setIsReady(true)
                // const channel = client.channel("messaging", "the_park", {
                //   name: "The Park",
                // });
                // await channel.watch();
                console.log("User connected and channel created");
            } catch (err) {
                console.error("Stream Chat connection error:", err);
            }
        };

        connect();

        return () => {
            client.disconnectUser()
            setIsReady(false)
        }
    }, []);

    if (!isReady) {
        return <ActivityIndicator />
    }

    return (
        <>
            <OverlayProvider>
                <Chat client={client}>{children}</Chat>
            </OverlayProvider>
        </>
    )
}