const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';


app.get('/', async (req, res) => {
    const companiesObjects = 'https://api.hubspot.com/crm/v3/objects/0-2?properties=name,about_us,annualrevenue';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(companiesObjects, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Homepage | Companies Objects', data });
    } catch (error) {
        console.error(error);
    }
});


app.get('/update-cobj', async (req, res) => {
    const companiesObjects = 'https://api.hubspot.com/crm/v3/objects/0-2?properties=name,about_us,annualrevenue';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(companiesObjects, { headers });
        const data = resp.data.results;
        res.render('updates', { 
            title: 'Update Company Object Form | Integrating With HubSpot I Practicum',
            data: data
        });
    } catch (error) {
        console.error(error);
    }
});


app.post('/update-cobj', async (req, res) => {
    const customObjects = 'https://api.hubspot.com/crm/v3/objects/0-2';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Process each company update in parallel
        const updatePromises = req.body.companies.map(company => {
            const update = {
                properties: {
                    name: company.name,
                    about_us: company.about_us,
                    annualrevenue: company.annualrevenue
                }
            };

            if (company.id) {
                return axios.patch(`${customObjects}/${company.id}`, update, { headers });
            }
        });

        await Promise.all(updatePromises);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));