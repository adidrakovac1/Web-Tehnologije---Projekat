const axios = require('axios');

async function testGetTop5Nekretnina() {
    const lokacija = 'Novo Sarajevo'; 

    try {
        console.log(`Testiranje API-ja za lokaciju: ${lokacija}`);

        const response = await axios.get(`http://localhost:3000/nekretnine/top5`, {
            params: { lokacija },
            timeout: 5000 
        });

        console.log('Statusni kod:', response.status);
        console.log('Podaci:', response.data);

        if (Array.isArray(response.data)) {
            console.log(`API je vratio ${response.data.length} nekretnina.`);
            response.data.forEach((nekretnina, index) => {
                console.log(`Nekretnina ${index + 1}:`, nekretnina);
            });
        } else {
            console.error('API nije vratio JSON niz.');
        }
    } catch (error) {
        console.error('Došlo je do greške:', error.response?.data || error.message);
    }
}

testGetTop5Nekretnina();
