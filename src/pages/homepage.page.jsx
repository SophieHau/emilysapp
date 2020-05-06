import React from 'react';
import { Welcome } from '../components/welcome/welcome.component';
import { ProfileBox } from '../components/profilebox/profilebox.component';
import { ChatList } from '../components/chatlist/chatlist.component';


const HomePage = () => {
    return(
                    
        <>
        <Welcome />
        <ProfileBox />
        <ChatList />
        </>
    )
}

export default HomePage;