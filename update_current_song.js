const fs = require('fs');
const fetch = require('node-fetch');

async function updateCurrentSong() {
    const apiKey = '29496f11d5772e5f06f86f5ac9ad9990'; // Your API key
    const username = 'cascery'; // Your Last.fm username
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const recentTracks = data.recenttracks.track;
        const currentlyPlaying = recentTracks.find(track => track['@attr'] && track['@attr'].nowplaying);

        let currentSong;
        if (currentlyPlaying) {
            const songTitle = currentlyPlaying.name;
            const artistName = currentlyPlaying.artist['#text'];
            currentSong = `### Currently Playing\n\n**${songTitle}** by **${artistName}**\n`;
        } else {
            currentSong = `### Currently Playing\n\nNo song is currently playing.`;
        }

        fs.writeFileSync('CURRENT_SONG.md', currentSong);
    } catch (error) {
        console.error('Error fetching currently playing track:', error);
    }
}

updateCurrentSong();
