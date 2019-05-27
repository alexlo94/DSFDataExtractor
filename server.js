/*
Server code for the DSF data extractor tool. Loads a local file named script.json and accepts POST requests from clients.
A given POST request will contain a JS object with data regarding the node that the client is currently on, as well as the command the user entered to interact with that node.
On receiving the server will look up the node the client is on and compare user input with the available input of the node.
    (1) If the user input is valid then the server will look up the next node and return it to the client
    (2) If the user input is invalid then the server will respond with an error, prompting the client to re-request input.
*/

//set import object 
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

//set the server middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());

//load the script to use in the advance response
const rawScript = fs.readFileSync('script.json');
const script = JSON.parse(rawScript);

//advance route with main server functionality
app.post('/advance', (req, res) => {
    try {
        //convert the request into an object
        const request = req.body;
        const response = [];

        //find the corresponding node in the script
        const n = script[request.node];

        //check if the player input is a valid command for the node
        if (Object.keys(n.commands).includes(request.command)) { //better way to do this???

            //get the next node since input was valid
            let next = script[n.commands[request.command]];

            //record the type of the node and push it to the response array
            response.push(next);
            let type = next.type;

            //while the type of next isn't "command", continue finding the next nodes
            while (type === "text") {
                next = script[next.next];
                response.push(next)
                type = next.type;
            }
        } else {
            console.log("invalid input");
            response.push(script["invalid-input"]);
            response.push(script[request.node]);
        }

        //res.body = response;
        res.send(response);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

app.get('/finish', (req, res) => {
    console.log(req.body);
    res.download('downloads/CharlotteDepsi_Data.zip');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//helper function to parse a node in the script and return the next one
//param n : the original node to be parsed
function nextNode(n) {
    //text nodes contain a next element
}