// musicPlayer.js

async function getCurrentlyPlaying(username) {
    const apiKey = '29496f11d5772e5f06f86f5ac9ad9990';
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const recentTracks = data.recenttracks.track;
        const currentlyPlaying = recentTracks.find(track => track['@attr'] && track['@attr'].nowplaying);

        if (currentlyPlaying) {
            const songTitle = currentlyPlaying.name;
            const artistName = currentlyPlaying.artist['#text'];
            const albumCoverUrl = currentlyPlaying.image[2]['#text']; // medium-sized image

            // Update your SVG content or another HTML element with this data
            document.getElementById('song-title').innerText = songTitle;
            document.getElementById('artist-name').innerText = artistName;
            document.getElementById('album-cover').src = albumCoverUrl;

            // Fetch additional track info (e.g., genres/tags)
            getTrackInfo(songTitle, artistName);
        } else {
            document.getElementById('song-title').innerText = 'No song is currently playing';
        }
    } catch (error) {
        console.error(`Error fetching currently playing track for ${username}:`, error);
    }
}

async function getTrackInfo(trackName, artistName) {
    const apiKey = '29496f11d5772e5f06f86f5ac9ad9990';
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const tags = data.track.toptags.tag;

        if (tags && tags.length > 0) {
            const genreList = tags.map(tag => tag.name).join(', ');
            document.getElementById('genre-list').innerText = `Genres: ${genreList}`;
        } else {
            document.getElementById('genre-list').innerText = `Genres: None found`;
        }
    } catch (error) {
        console.error(`Error fetching track info for ${trackName} by ${artistName}:`, error);
    }
}

// Start fetching currently playing track
getCurrentlyPlaying('cascery');
