import React from 'react';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import './App.css';
import { auth, createUserProfileDocument } from './firebase.utils';
import Navigation from './components/navbar/navbar.component';
import HomePage from './pages/homepage.page';
import SignIn from './pages/signin.page';
import Register from './pages/register.page';
import ChatPage from './pages/chat.page';


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null
    }
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        
        userRef.onSnapshot(snapShot => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          });
        });
      } else {
        this.setState({currentUser: userAuth});
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className="App">
        <Router>
          {
            !window.location.pathname.includes('/chat/') && <Navigation currentUser={this.state.currentUser} />
          }
          <Switch>
            <Route 
              exact path='/' 
              render={(props) => <HomePage {...props} currentUser={this.state.currentUser} />}
            />
            <Route
              exact path='/chat/:id'
              component={ChatPage}
            />
            <Route 
              exact path='/signin' 
              render={() => this.state.currentUser ? (<Redirect to='/' />) : (<SignIn />)} 
            />
            <Route 
              exact path='/register' 
              render={() => this.state.currentUser ? (<Redirect to='/' />) : (<Register />)}
            />
          </Switch>
        </Router>
      </div>
    );
  }
} 


export default App;
