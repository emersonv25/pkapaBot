require('dotenv').config()
const axios = require('axios')
module.exports = {
    async getPlaylist(token, url)
    {
        let playlistId = url.substring(url.indexOf('playlist/') + 9, url.indexOf('?'))

        const params = new URLSearchParams({
            market: 'BR',
            fields: 'items(track(name,artists.name))',
            limit: '100'
        }).toString();
        const config = {
            headers: {
              'Authorization': 'Bearer ' + token
            }
        }

        let playlist = await axios.get('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks?' + params, config)
        .then((resp) => {
            return resp.data.items
        })
        .catch((err) => {
            console.log(err.message)
        })    
        return playlist    
    },
    async getTrack(token, url)
    {
        let trackId = url.substring(url.indexOf('track/') + 6)

        const params = new URLSearchParams({
            market: 'BR',
        }).toString();
        const config = {
            headers: {
              'Authorization': 'Bearer ' + token
            }
        }

        let track = await axios.get('https://api.spotify.com/v1/tracks/' + trackId + '?' + params, config)
        .then((resp) => {
            return resp.data
        })
        .catch((err) => {
            console.log(err.message)
        })    
        return track    
    },
    async getToken(client_id, client_secret)
    {
        const params = new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret
        });
        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        let token = await axios.post('https://accounts.spotify.com/api/token', params, config)
        .then((resp) => {
            return resp.data.access_token
        })
        .catch((err) => {
            console.log(err.message)
        })        
        return token
    }
}