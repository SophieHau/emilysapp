import React from 'react';
import { ChatBoard } from '../components/chatboard/chatboard.component';
import { ChatInputBox } from '../components/chatinputbox/chatinputbox.component';
import { ChatNav } from '../components/chatnav/chatnav.component';

const ChatPage = () => {
    return(
        <>
        <ChatNav />
        <ChatBoard />
        <ChatInputBox />
        </>
    )
}

export default ChatPage;