// Importing all installed server packages
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import xlsxtojson from 'xlsx-to-json-lc';
import jsontoxml from 'jsontoxml';

// Configuring environment variables file
dotenv.config();

// Configuring server packages
const app = express();
const PORT = 9090 || process.env.PORT,
      ip = '127.0.0.2' || process.env.IP;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.set ('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render(
        'generate'
    );
});

// RESTFUL routes paths
app.post('/generate', (req, res)=> {
    // Grabbing the selected excel sheets to convert to XML from the uploaded workbook 
    const sheets = Object.keys(req.body.sheets);
    for (var i=0; i<sheets.length ; i++) {
        const tedPath = 'TED/Daily TED Returns Array.xlsx';
        const name = sheets[i];
        xlsxtojson (
            {
                input: tedPath,
                output: null,
                sheet: name
            }, (err, returnedJSON)=> {
                if(err) {
                    console.log(err);
                } else {
                    // checking returned JSON from excel conversion to JSON
                    console.log( typeof returnedJSON);
                    // Converting JSON data to XML
                    var xmlOutput = jsontoxml (returnedJSON);
                    const xmlPath = `XML/${name}.xml`;
                    // Writing XMLOutput to file
                    console.log(xmlPath);
                    fs.writeFile(xmlPath, xmlOutput,  (err) => {
                        err ? console.log(err) : console.log(`file written successfully, check path`);
                    });
                }
            }
        );
    }
    // sending response to client
    res.status(200).send({message: 'all your XML files are successfully generated, check your directory'});
});

const server = app.listen(PORT,  (req, res) => {
    console.log(`running XML generator app on port ${PORT} you can open on localhost:${PORT} or http://${ip}:${PORT}` )
});