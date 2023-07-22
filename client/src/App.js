import './App.css';
import {useState, useEffect } from 'react'
import Header from './header.js'
import SearchDisplay from './searchbar';
import { returnTest } from './header.js';
const client_id = '6cd40c683f49475bb57d07ca668d4659';
const redirectUri = 'http://localhost:3000';


// Check If Already Authorized to Avoid Authorization Loop

const urlParams = new URLSearchParams(window.location.search);

let code = urlParams.get('code');




// Spotify Authorization Page


let codeVerifier = generateRandomString(128);

(!code) && generateCodeChallenge(codeVerifier).then(codeChallenge => {
  let state = generateRandomString(16);
  let scope = ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private'];

  localStorage.setItem('code_verifier', codeVerifier);

  let args = new URLSearchParams({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge
  });

  window.location = 'https://accounts.spotify.com/authorize?' + args;
})




// Access Token

let codeVerifier2 = localStorage.getItem('code_verifier');

let body = new URLSearchParams({
  grant_type: 'authorization_code',
  redirect_uri: redirectUri,
  code: code,
  client_id: client_id,
  code_verifier: codeVerifier2
});

const response = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: body,
})
  .then(response => {
    if (!response.ok){
      throw new Error('HTTP status ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem('access_token', data.access_token);
  })
  .catch(error => {
    console.error('Error: ', error);
  })





  // Generate random string -> Pass into a SHA256 algorithm hash

function generateRandomString(length){
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}


async function generateCodeChallenge(codeVerifier){
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
}

function App() {



  // Use State Declarations
  const [ profile, setProfile ] = useState(null);
  const [ profileImage, setProfileImage ] = useState(null);
  const [ profileName, setProfileName ] = useState(null);
  const [ displayPlaylist, setDisplayPlaylist ] = useState(false)
  const [ remove, setRemove ] = useState(false);
  // Playlist Stuff\
  function displayPlaylistToggle(){
    if (displayPlaylist === false) {
      setDisplayPlaylist(true);
    }
  }

  useEffect(() => {
  }, [displayPlaylist])
  
  
  const SearchDisplayParent = () =>{
    return <SearchDisplay accessToken={localStorage.getItem('access_token')} displayPlaylist={displayPlaylist} setDisplayPlaylist={setDisplayPlaylist} profile={profile} remove={remove} setRemove={setRemove}></SearchDisplay>;
  }

  // Get User Profile Information

  useEffect(() => {
    getProfile();
  }, [])
  async function getProfile(){
    let accessToken = localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    const data = await response.json();

    setProfile(data);
  }


  

  // Displaying Profile Information
  useEffect(() =>{
    if (profile !== null){
      setProfileImage(profile.images[1].url);
      setProfileName(profile.display_name);
    }
  }, [profile])
  const HeaderParent = () => {
    return <Header url={profileImage} name={profileName} displayToggle={displayPlaylistToggle}></Header>;
  }



  // App Return Statement
  return (
    <div>
      <HeaderParent></HeaderParent>
      <SearchDisplayParent></SearchDisplayParent>
    </div>
  )
}

export default App;