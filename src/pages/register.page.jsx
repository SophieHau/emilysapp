import React from 'react';
import { Link } from 'react-router-dom';
import { auth, createUserProfileDocument } from '../firebase.utils';

class Register extends React.Component {
    constructor() {
        super();

        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    handleSubmit = async event => {
        event.preventDefault();

        const { displayName, email, password, confirmPassword } = this.state;

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            await createUserProfileDocument(user, { displayName });
            this.setState({
                    displayName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
            })
        } catch(error) {
            console.error(error);
        }
    }

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({[name]: value});
    }


    render() {
        const { displayName, email, password, confirmPassword } = this.state;
        return (
            <article className="br3 ba b--black-10 mv1 w-90 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa3 pa4-m pa4-l black-80">
                    <form className="measure center" onSubmit={this.handleSubmit}>
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f4 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="displayName">Name</label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="text" 
                                name="displayName" 
                                id="displayName"
                                defaultValue={displayName}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email">Email</label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="email" 
                                name="email"
                                id="email"
                                defaultValue={email}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="password" 
                                name="password" 
                                id="password"
                                defaultValue={password}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="confirmPassword">Confirm password</label>
                            <input 
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="password" 
                                name="confirmPassword" 
                                id="confirmPassword"
                                defaultValue={confirmPassword}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        </fieldset>
                        <div className="">
                            <button 
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib no-underline black" 
                                type="submit"
                                onClick={this.handleSubmit}
                            >
                                Register
                            </button>
                        </div>
                        <div className="lh-copy mt3">
                            <Link to='/signin' className="pointer f6 link dim black db">Already registered? <span className="underline">Sign in</span></Link>
                        </div>
                    </form>
                </main>
            </article>
        )
    }
};

export default Register;