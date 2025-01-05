const axios = require('axios').default;
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function loginAndSendRequest() {
    try {
        const loginResponse = await client.post('http://localhost:3000/login', {
            username: 'username5',
            password: '123123',
        });

        console.log('Login response:', loginResponse.data);

        const postResponse = await client.post('http://localhost:3000/upit', {
                "nekretnina_id" : 1,
                "tekst_upita" : "TestniUpit"
        });

        console.log('Response:', postResponse.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

loginAndSendRequest();