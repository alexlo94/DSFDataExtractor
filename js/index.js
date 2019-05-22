window.onload = () => {
    //get the messages and input divs
    const messages = document.querySelector('#messages');
    const userInput = document.querySelector('#user-input');

    //attach an event listener to the user input element
    userInput.childNodes[3].addEventListener('keyup', (event) => {
        if (event.key === "Enter") {
            //get all the messages in the terminal
            let terminal = document.querySelectorAll(".terminalMessage");
            let input = userInput.childNodes[3];
            let inputValue = input.value;
            terminal = terminal[terminal.length - 1];

            //append the userInput to the terminal
            let inputP = document.createElement('p');
            inputP.innerHTML = `>> ${inputValue}`;
            inputP.className += "userInput";
            messages.appendChild(inputP);
            //clear the input
            input.value = '';
            //disable the input until we're done working with the screen
            input.disabled = true;

            //assumption that the last element of the array is the most recent terminal message
            const currNode = {
                node: terminal.id,
                command: inputValue.toLowerCase(),
            }

            //make a post request to the server
            fetch("http://localhost:3000/advance", {
                    method: 'POST',
                    body: JSON.stringify(currNode),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                .then((response) => {
                    //handle the data sent back to us by the server
                    console.log('Success: ', response);

                    //loop through all the nodes sent back and post them to the terminal with a slight delay
                    for (let i = 0; i < response.length; i++) {
                        postNode(response[i], 1000 + 500 * i);
                    }

                    //check to see that the last node wasn't an exit node
                    if (response[response.length - 1].type === "exit/download") {
                        //do a get request to download
                        window.open(response[response.length -1].url);
                    } else if (response[response.length - 1].type === "exit/text") {
                        //remove the input box?
                    } else {
                        //reenable the input
                        input.disabled = false;
                    }
                })
                .catch((error) => {
                    console.error('Error: ', error);

                    //reenable the input
                    input.disabled = false;
                });
        }
    });
}

//helper function to post the contents of a node onto the terminal with a slight delay
function postNode(node, delay) {
    window.setTimeout(() => {
        //construct the new message
        let p = document.createElement('p');
        p.innerHTML = node.content;
        p.id = node.title;
        p.className += "terminalMessage";

        //append the new messages to the terminal
        messages.appendChild(p);
    }, delay);
}