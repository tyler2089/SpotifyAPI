import './searchbar.css';
import { useState, useEffect, useLayoutEffect } from 'react';
let userPlaylist = [];
let userPlaylistURIs = [];
function SearchDisplay(props){

    // Variable Declaration
    const [ result, setResult] = useState(null);
    const [ searchFilter, setSearchFilter ] = useState(null);
    const [ display, setDisplay ] = useState(null);
    const [ artistInfo, setArtistInfo ] = useState(null);
    const [ artist, setArtist ] = useState(null);
    const [ albumInfo, setAlbumInfo ] = useState(null);
    const [ _album, setAlbum ] = useState(null);
    const [ playlistID, setPlaylistID ] = useState(null);
    // Check for Playlist Boolean on Rerender
    useEffect(() => {
        if (props.displayPlaylist === true)
        {

            let playlistFiller = [];
            userPlaylist.map((item, index) => {
                playlistFiller.push(
                    <div key={index}className='playlist-display-container'>
                        <img src={item.album.images[0].url}></img>
                        <div className='song-name'>
                            <h5>Song:</h5>
                            <h3>{item.name}</h3>
                        </div>
                        <div className='artist-name'>
                            <h5>Artist:</h5>
                            <h3>{item.artists[0].name}</h3>
                        </div>
                        <div>
                            <h2 onClick={event => {removeFromPlaylist(item)}}>-</h2>
                        </div>
                    </div>
                )
            })

            let playlistDisplay = (
                <div className='playlist'>
                    <h1>Your Playlist</h1>
                    <input id='playlist-name'type='text' placeholder='Playlist Name'></input>
                    {playlistFiller}
                    <input type='button' value='Submit Playlist' onClick={event =>{
                        if (document.querySelector('#playlist-name').value === ''){
                            window.alert('Please Enter A Name For Your Playlist')
                        }
                        else{
                            createPlaylist(document.querySelector('#playlist-name').value);
                        }
                    }}></input>
                </div>
            )
            setDisplay(playlistDisplay);
        }

    }, [])

    async function createPlaylist(name){
        let data = {
            'name': name,
            'description': 'Created on HarmonyHub',
            'public': true
        }

        const response = await fetch('https://api.spotify.com/v1/users/' + props.profile.id + '/playlists', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => setPlaylistID(data.id));
    }

    useEffect(() => {
        if (playlistID){
            addSongsToPlaylist();
        }
    }, [playlistID])

    async function addSongsToPlaylist(){
        let data = {
            'uris': userPlaylistURIs,
            'position': 0
        }
        const response = await fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/tracks', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log(data))
    }
    function togglePlaylist(){
        props.setDisplayPlaylist(false)
    }
    // Add songs to playlist
    function addToPlaylist(item){
        userPlaylist.push(item);
        userPlaylistURIs.push(item.uri);
    }

    function removeFromPlaylist(item){
        userPlaylist = userPlaylist.filter(song => song !== item);
        console.log(userPlaylist);

        if (props.remove === true){
            {props.setRemove(false)};
        }
        else {
            {props.setRemove(true);}
        }
    }
    // Underline Animation Stuff
    useEffect(() => {
        if (searchFilter !== null)
        {
            let artistFilter = document.getElementById('artist-filter');
            let albumFilter = document.getElementById('album-filter');
            let trackFilter = document.getElementById('track-filter');
            if (searchFilter === 'artist'){
                artistFilter.style.setProperty('--scale', 'scaleX(1)');
                albumFilter.style.setProperty('--scale', 'scaleX(0)');
                trackFilter.style.setProperty('--scale', 'scaleX(0)');
            }
            if (searchFilter === 'album'){
                albumFilter.style.setProperty('--scale', 'scaleX(1)');
                artistFilter.style.setProperty('--scale', 'scaleX(0)');
                trackFilter.style.setProperty('--scale', 'scaleX(0)');
            }
            if (searchFilter === 'track'){
                trackFilter.style.setProperty('--scale', 'scaleX(1)');
                artistFilter.style.setProperty('--scale', 'scaleX(0)');
                albumFilter.style.setProperty('--scale', 'scaleX(0)');
            }
        }
    }, [searchFilter])


    const Display = () => {
        return display;
    }

    // When Result is Updated From Search, Assign Results to Display
    useEffect(() => {
        // Setting displayPlaylist back to false=
        
        if (result){
            let resultHolder = result;
            let dipslayHolder = [];

            // Searching Tracks
            if (searchFilter === 'track'){
            resultHolder.tracks.items.map((item, index) => {
                dipslayHolder.push(
                    <div className='search-display-container'>
                        <img src={item.album.images[0].url}></img>
                        <h3>{item.name}</h3>
                        <h2 onClick={event => {addToPlaylist(item)}}>+</h2>
                    </div>
                )
            })
        }

        // Searching Artists
            if (searchFilter === 'artist'){
                resultHolder.artists.items.map((item, index) => {
                    if (item.images[0]){
                    dipslayHolder.push(
                        <div className='search-display-container'>
                            <img src={item.images[0].url}></img>
                            <h3>{item.name}</h3>
                            <h2 onClick={event => {generateArtistDisplay(item)}}>{'->'}</h2>
                        </div>
                    )
                    }
                })
            }

        // Searching Albums

            if (searchFilter === 'album'){
                resultHolder.albums.items.map((item, index) => {
                    dipslayHolder.push(
                    <div className='search-display-container'>
                         <img src={item.images[0].url}></img>
                         <h3>{item.name}</h3>
                         <h2 onClick={event => {setAlbum(item)}}>{'->'}</h2>
                    </div>
                )
            })
        }
        setDisplay(dipslayHolder);
        }
    }, [result])


    // Setting Display to Album

    useEffect(() => {
        if (_album){
        getAlbumInfo(_album.id);
        }
    }, [_album])

    useEffect(() => {
        if (albumInfo){
            let handler = albumInfo;
            let albumDisplay = (


                <div className='album-container'>
                    <h2>{_album.name}</h2>
                    <img src={_album.images[0].url}></img>
                    <div className='album-tracks-container'>
                        <h3>Songs:</h3>
                        { handler.items.map((item, index) => {
                            let obj = { 
                                album: {
                                    images: []
                                } 
                            };

                            obj.album.images.push({url: _album.images[0].url})
                            item = { ...item, ...obj};
                            return (
                                <div className='album-tracks'>
                                    <img src={_album.images[0].url}></img>
                                    <h3>{item.name}</h3>
                                    <h2 onClick={event => {addToPlaylist(item)}}>+</h2>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )

            setDisplay(albumDisplay);
        }
    }, [albumInfo])
    // Get Album Information

    async function getAlbumInfo(id){
        const parameters = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.accessToken
            }
        }

        if (id){
        const response = await fetch('https://api.spotify.com/v1/albums/' + id + '/tracks', parameters)
        .then(response => response.json())
        .then(data => setAlbumInfo(data));
        }
    }

    
    // Setting Display to Artist
    function generateArtistDisplay(item){
        setArtist(item)
    }

    useEffect(() => {
        if(artist){
        let info = artist;

        getArtistInfo(info.id);
        }
    }, [artist])

    useEffect(() => {
        if (artistInfo){
            let handler = artistInfo;
            let artistDisplay = (
                <div className='artist-display'>
                    <h2>{artist.name}</h2>
                    <img src={artist.images[0].url}></img>                    
                    <div className='artist-top-tracks'>
                        {handler.tracks.map((item, index) => {
                            return (
                                <div className='artist-tracks-display-container'>
                                    <img src={item.album.images[0].url}></img>
                                    <h3>{item.name}</h3>
                                    <h2 onClick={event => {addToPlaylist(item)}}>+</h2>
                                </div>
                            )
                        })}
                    </div>
                </div>
        )

        setDisplay(artistDisplay);
        }
    }, [artistInfo])
    async function getArtistInfo(id){
        const parameters = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.accessToken
            }
        };

        if (searchFilter !== null){
        const response = await fetch('https://api.spotify.com/v1/artists/' + id + '/top-tracks?market=US', parameters)
        .then(response => response.json())
        .then(data => setArtistInfo(data));
        }
    }
    // Search GET Request
    async function search(searchContent){
        const parameters = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.accessToken
            }
        };

        if (searchFilter !== null){
        const response = await fetch('https://api.spotify.com/v1/search?q=' + searchContent + '&type=' + searchFilter, parameters)
        .then(response => response.json())
        .then(data => setResult(data));
        }
    }
    return (
        <div onKeyDown={event => {(event.code === 'Enter') && search(document.getElementById('input-box').value)}}>
            <div className='form' >
                <input id='input-box'type="search" placeholder="Search..." onClick={event => {togglePlaylist()}} onKeyDown={event => {(event.code === 'Enter') && search(document.getElementById('input-box').value);}}></input>
                <input id='submit-button' type='submit' value='Submit' onClick={event => {search(document.getElementById('input-box').value)}}></input>
            </div>
            <div className='search-filter-container'>
                <h2 className='search-filter' id='artist-filter' onClick={event => setSearchFilter('artist')}>Artist</h2>
                <h2 className='search-filter' id='album-filter' onClick={event => setSearchFilter('album')}>Album</h2>
                <h2 className='search-filter' id='track-filter' onClick={event => setSearchFilter('track')}>Tracks</h2>
            </div>
            <div className='display-container'>
                <Display></Display>
            </div>
        </div>
    )
}

export default SearchDisplay;