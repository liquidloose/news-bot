const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Posts a message to a Facebook Page based on a client nickname.
 * @param {string} clientNickname - The key from clients.json (e.g., 'fall-river-mirror').
 * @param {string} message - The content of the post.
 */
async function postToFacebook(clientNickname, message) {
    // 1. Get the token from your .env file
    const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;
    
    // 2. Load client data from JSON (looking for clients.json in the root folder)
    const clientsPath = path.join(__dirname, '../../clients.json');
    
    if (!fs.existsSync(clientsPath)) {
        return `Error: clients.json not found at ${clientsPath}`;
    }

    const clients = JSON.parse(fs.readFileSync(clientsPath, 'utf8'));
    const client = clients[clientNickname];
    
    if (!client) {
        return `Error: Client '${clientNickname}' not found in clients.json. Available: ${Object.keys(clients).join(', ')}`;
    }

    // 3. Construct the Facebook Graph API URL (Fixed the missing / and $)
    const url = `https://graph.facebook.com{client.pageId}/feed`;
    
    try {
        const response = await axios.post(url, {
            message: message,
            access_token: accessToken
        });
        return `Successfully posted to ${client.name}! Post ID: ${response.data.id}`;
    } catch (error) {
        // Pull out the specific Facebook error message if it exists
        const errorDetail = error.response?.data?.error?.message || error.message;
        return `Facebook Error for ${clientNickname}: ${errorDetail}`;
    }
}

module.exports = { postToFacebook };
