import React from 'react';
import { Link } from 'react-router-dom';
import newChatIcon from '../../assets/icons/messageicon.png';
import { getProfilePicUrl } from '../../firebase.utils';


class ProfileBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: this.props.currentUser,
            imagePath: ''
        }
    }

    componentDidMount = async () => {
        const currentImageUrl = await getProfilePicUrl(this.state.currentUser)
        this.setState({imagePath: currentImageUrl})
    }

    render () {
        return (
            <article className="dt mw6 w-90 center bg-white br3 mb3 ba b--black-10 pa2">
                <div className="dtc w3 v-mid">
                    <img src={this.state.imagePath} alt="" className="mr2 ba b--black-10 db br-100 w3 h3" style={{objectFit: 'cover'}}/>
                </div>
                <div className="dtc v-mid pl3">
                    <h1 className="f3 f3-l fw3 lh-title black mv0">Hi {this.state.currentUser.displayName}!</h1>
                </div>
                <div className="dtc fr">
                        <Link to="/picture" ><button className="f6 f6-l tr fw3 button-reset bg-white ba dib b--transparent dim pointer pv1 black-60 outline-transparent" type="submit">Edit</button></Link>
                        <div className="mt3 mr2 mt4-ns mb0-l tr">
                            <Link to="/createchat"><img type="submit" src={newChatIcon} className="dib pointer dim" alt="message bubble" style={{width: '20px', height: '20px'}} /></Link>
                        </div>
                </div>
            </article>
        )
    }
};

export default ProfileBox;