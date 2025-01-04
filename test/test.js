const axios = require('axios').default;
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

// Enable cookie jar support for Axios
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function loginAndSendRequest() {
    try {
        // Step 1: Log in and let Axios handle the session cookie
        const loginResponse = await client.post('http://localhost:3000/login', {
            username: 'username55',
            password: '123123',
        });

        console.log('Login response:', loginResponse.data);

        // Step 2: Make an authenticated request
        const postResponse = await client.post('http://localhost:3000/upit', {
                "nekretnina_id" : 3,
                "tekst_upita" : "Novi upit"
        });

        console.log('Response:', postResponse.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

loginAndSendRequest();