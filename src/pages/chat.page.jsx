import React from 'react';
import { ChatBoard } from '../components/chatboard/chatboard.component';
import { ChatNav } from '../components/chatnav/chatnav.component';


const ChatPage = () => {
    return(
        <>
        <ChatNav/>
        <ChatBoard/>
        </>
    )
}

export default ChatPage;