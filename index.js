//required modules and files
const inquirer = require('inquirer');
const fs = require('fs');
const Choices = require('inquirer/lib/objects/choices');


//setting up arrays to hold input data
const managerData = [];     //holds manager info in an array
const engineerData = [];    //holds info for all added engineers in one array
const internData = [];      //holds info for all added interns in one array
const cardData =[];     //an array to hold the HTML code for each information card to be displayed


//prompts for manager information
const managerQuestions = () => {
    return inquirer
        .prompt([
        {
            type: 'input',
            name: 'managerName',
            message: 'What is the name of your team manager?',
        },
        {
            type: 'input',
            name: 'managerID',
            message: 'What is the employee ID of your team manager?',
        },
        {
            type: 'input',
            name: 'managerEmail',
            message: "What is your team manager's email?",
        },
        {
            type: 'input',
            name: 'managerOffice',
            message: "What is the team manager's office number?",
        },
    ])

    //putting the collected data into an array
    .then(addManager => {
        let {managerName, managerEmail, managerID, managerOffice} = addManager;
        managerData.push(addManager);
    });
};

//prompts for intern and engineer information
const employeeQuestions = () => {
    return inquirer
        .prompt([
        {
            type: 'list',
            name: 'nextChoice',
            message: "Do you want to add another team member?",
            choices: ['add Engineer', 'add Intern', 'Finish Builing Team'],
        },
        {
            type: 'input',
            name: 'employeeName',
            message: "What is the team member's name?",
            when: (input) => input.nextChoice === 'add Engineer' || input.nextChoice === 'add Intern',

        },
        {
            type: 'input',
            name: 'employeeID',
            message: "What is the team member's employee ID?",
            when: (input) => input.nextChoice === 'add Engineer' || input.nextChoice === 'add Intern',

        },
        {
            type: 'input',
            name: 'email',
            message: "What is the team member's email?",
            when: (input) => input.nextChoice === 'add Engineer' || input.nextChoice === 'add Intern',
        },
        {
            type: 'input',
            name: 'github',
            message: "What is the team member's github username?",
            when: (input) => input.nextChoice === 'add Engineer',
        },
        {
            type: 'input',
            name: 'school',
            message: "What school does the intern attend?",
            when: (input) => input.nextChoice === 'add Intern',
        },
    ])

    //putting the collected information into the arrays created for engineers and interns
    .then(addEmployee =>{
        let {nextChoice, employeeName, employeeID, email, github, school} = addEmployee;

        if (nextChoice === 'add Engineer'){
            let {employeeName, employeeID, email, github} = addEmployee;
            engineerData.push(addEmployee);
            return employeeQuestions(engineerData);
        }
        if (nextChoice === 'add Intern'){
            let {employeeName, employeeID, email, school} = addEmployee;
            internData.push(addEmployee);
            return employeeQuestions(internData);
        }
        else {
            return;
        }

    }); 
};

//creating the info card for the manager
function generateManagerCard() {
    let x = `
            <div class="card">
                <section class= "cardTop">
                    <h2>${managerData[0].managerName}</h2>
                    <p><i class="fas fa-mug-hot" style="font-size: 16px;"></i> Manager </p>
                </section>
                <section class="cardBody">
                    <p>ID: ${managerData[0].managerID}</p>
                    <a href="mailto:${managerData[0].managerEmail}" target="blank">Email: ${managerData[0].managerEmail}</a>
                    <p>Office: ${managerData[0].managerOffice}</p>
                </section>
            </div>
    `;
    cardData.push(x);
};
  
//creating the info cards for engineers
function generateEngineerCards(){
    let y = ``;
    for (let i=0; i < engineerData.length; i++){
        y = `
            <div class="card">
                <section class= "cardTop">
                    <h2>${engineerData[i].employeeName}</h2>
                    <p><i class="fas fa-glasses" style="font-size: 16px;"></i> Engineer </p>
                </section>
                <section class="cardBody">
                    <p>ID: ${engineerData[i].employeeID}</p>
                    <a href="mailto:${engineerData[i].email}" target="blank">Email: ${engineerData[i].email}</a>
                    <a>github: ${engineerData[i].github}</a>
                </section>
            </div>
        `;
        cardData.push(y);
    };
    return cardData;
};

//creating the info cards for interns
function generateInternCards(){
    let z = ``;
    for (let i=0; i < internData.length; i++){
        z = `
            <div class="card">
                <section class= "cardTop">
                    <h2>${internData[i].employeeName}</h2>
                    <p><i class="fas fa-user-graduate" style="font-size: 16px;"></i> Intern </p>
                </section>
                <section class="cardBody">
                    <p>ID: ${internData[i].employeeID}</p>
                    <a href="mailto:${internData[i].email}" target="blank">Email: ${internData[i].email}</a>
                    <p>School: ${internData[i].school}</p>
                </section>
            </div>
        `;
        cardData.push(z);
    };
    return cardData;
};

//setting up HTML and adding in the cards
function generateWebpage(){
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Profile</title>
    <link rel="stylesheet" href="./style.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
    </head>

    <body>
        <header>
            <h1>My Team</h1>
        </header>

        <container id="cardContainer" class="container">
            ${cardData}
        </container>
        
    </body>
    </html>
    `;
};

//writing data into an html file
function writeToFile(fileName, data) {
    fs.appendFile('./dist/teamProfile.html', data, (err) => {
        err ? console.log(err) : console.log('Go Check the dist folder for your HTML')
    });
}

//initialize application
function init() {
    managerQuestions()
    .then(employeeQuestions)
    //.then(() => console.log(managerData))
    //.then(() => console.log(engineerData))
    //.then(() => console.log(internData))
    .then(generateManagerCard)
    .then(generateEngineerCards)
    .then(generateInternCards)
    //.then(() => console.log(cardData))
    .then((data) => writeToFile('./dist/teamProfile.html', generateWebpage()))
    .then(() => console.log('Successfully wrote to HTML'))
    .catch((err) => console.error(err));
};

init(); 

module.exports = generateWebpage;