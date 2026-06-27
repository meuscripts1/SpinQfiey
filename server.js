const express = require('express');
const fetch = require('node-fetch');
const app = express();

const CLIENT_ID = '1518033470725554388';
const CLIENT_SECRET = 'Pg3oBca7nS3yghJLiljSdj1utwi4lp1z';
const REDIRECT_URI = 'http://localhost:3000/callback';

app.get('/login', (req, res) => {
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    res.redirect(discordAuthUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        })
    });

    const tokenData = await tokenResponse.json();
    
    const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const user = await userResponse.json();
    console.log("Usuário logado:", user);
    
    res.send(`Bem-vindo ${user.username}! <a href="/">Voltar</a>`);
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
