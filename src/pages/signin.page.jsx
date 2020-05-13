import React from 'react';
import { Link } from 'react-router-dom';
import { auth, signInWithGoogle } from '../firebase.utils';
import { Navigation } from '../components/navbar/navbar.component';


class SignIn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const { email, password } = this.state;

        try {
            await auth.signInWithEmailAndPassword(email, password);
            this.setState({ email: '', password: '' });
        } catch(error) {
            console.log(error);
        }

        this.setState({email: '', password: ''})
    }

    handleChange = (event) => {
        const {value, name} = event.target
        this.setState({ [name]: value})
    }

    render() {
        return (
            <>
            <Navigation />
                <article className="br3 ba b--black-10 w-90 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa3 pa4-m pa4-l black-80">
                        <form className="measure center" onSubmit={this.handleSubmit}>
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f4 fw2 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw2 lh-copy f6" htmlFor="email">Email</label>
                                <input 
                                    className="pa2 input-reset ba b--black-0.25 bg-transparent hover-bg-white hover-gray w-100" 
                                    type="email"
                                    name="email"  
                                    id="email"
                                    defaultValue={this.state.email}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw2 lh-copy f6" htmlFor="password">Password</label>
                                <input 
                                    className="b pa2 input-reset ba bg-transparent hover-bg-white hover-gray w-100"
                                    type="password" 
                                    name="password"
                                    id="password" 
                                    defaultValue={this.state.password}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            </fieldset>
                            <div className="ph3">
                                <button 
                                    className="pointer outline-transparent b--hot-pink mr2 ml2 bg-transparent f6 grow no-underline br-pill ba ph3 pv2 mb2 dib hot-pink w4" 
                                    type="submit"
                                    onClick={this.handleSubmit}
                                >
                                    Sign in
                                </button>
                                <button 
                                    className="outline-transparent b--blue ml2 mr2 bg-transparent f6 grow no-underline br-pill ba ph3 pv2 mb2 dib blue pointer" 
                                    onClick={signInWithGoogle}
                                >
                                    Sign in with Google
                                </button>
                            </div>
                            <div className="lh-copy mt3">
                                <Link to='/register' className="pointer fw2 f6 link dim black db">Don't have an account yet? <span className="underline">Register</span></Link>
                                <a href="#0" className="f6 fw2 link dim black db">Forgot your password?</a>
                            </div>
                        </form>
                    </main>
                </article>
            </>
        )
    }
}

export default SignIn;