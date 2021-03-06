// Call my API Chatbot server on Heroku

var request = require("request");

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.
const sendMessage = (userId, message) => {
    console.log(userId + ":" + message);
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: process.env.FACEBOOK_ACCESS_TOKEN,
        },
        method: 'POST',
        json: {
            recipient: {
                id: userId
            },
            message: {
                text: message
            },
        }
    });
}

module.exports = (event) => {
    const userId = event.sender.id;
    const message = event.message.text;

    const https = require('https')

    const data = JSON.stringify({
        'user_id': userId,
        'content': message
    })

    const options = {
        hostname: process.env.CHATBOT_AI_HOSTNAME,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
        },
    }

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', (d) => {
            recevied_message = JSON.parse(d.toString());
            return sendMessage(userId, recevied_message.results);
        })
    })

    req.on('error', (error) => {
        console.error(error)
    })

    req.write(data)
    req.end()
}