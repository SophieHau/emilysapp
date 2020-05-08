import React from 'react';
import { ChatBoard } from '../components/chatboard/chatboard.component';
import { ChatInputBox } from '../components/chatinputbox/chatinputbox.component';
import { ChatNav } from '../components/chatnav/chatnav.component';


const ChatPage = ({ currentUser }) => {
    return(
        <>
        <ChatNav/>
        <ChatBoard currentUser={currentUser} />
        <ChatInputBox currentUser={currentUser} />
        </>
    )
}

export default ChatPage;