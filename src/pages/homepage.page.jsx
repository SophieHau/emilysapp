import React from 'react';
import { Welcome } from '../components/welcome/welcome.component';

const HomePage = () => {
    return(
        <h1>This is the HomePage
            <Welcome />
        </h1>
        
        // <ProfileBox />
        // <ChatList />
        // <ChatBoard />
        // <ChatInputBox />
    )
}

export default HomePage;