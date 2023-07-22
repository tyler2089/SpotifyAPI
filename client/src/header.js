import './header.css';
import { useState, useEffect } from 'react';

function Header(props){
    const [ profileImage, setProfileImage ] = useState(null);
    const [ profileName, setProfileName ] = useState(null);

    // Creating React Object for User Profile Image
    const Image = () => {
        return profileImage; 
    }

    const Name = () => {
        return profileName;
    }
    useEffect(() => {

        // Check if Url exists, and sets image if exists true
        if (props){
            setProfileImage((<img src={props.url}></img>))
            setProfileName((<h3>{props.name}</h3>))
        }
    }, []);

    // Display Playlist Toggle
    function displayToggle(){
        props.displayToggle();
    }

    return (
        <div className='header-container'>
            <div className='user-info'>
                <Image></Image>
                <Name></Name>
            </div>
            <h1 onClick={event => {window.location.reload()}}>HarmonyHub™</h1>
            <h2 id='playlist' className='create-a-playlist' onClick={displayToggle}>Your Playlist</h2>
        </div>
    )
}

export default Header;