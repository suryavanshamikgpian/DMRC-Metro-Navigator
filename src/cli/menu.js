const inquirer = require("inquirer").default;
const {
    findShortestRoute,
    findFastestRoute,
    findCheapestRoute,
    isValidStation,
    getStationList,
} = require("../services/routeService");
const printRoute = require("../utils/printer");


function validateStation(input) {
    const trimmed = input.trim();

    if (trimmed.length === 0) {
        return "Please enter a station name.";
    }

    if (!isValidStation(trimmed)) {
        return "Station not found. Check spelling and try again.";
    }

    return true;
}


async function askRoute() {

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "source",
            message: "Enter SOURCE station:",
            validate: validateStation,
        },
        {
            type: "input",
            name: "destination",
            message: "Enter DESTINATION station:",
            validate: validateStation,
        },
        {
            type: "select",
            name: "routeType",
            message: "How do you want to travel?",
            choices: [
                { name: "⏱️  Fastest Route    (minimum time)", value: "fastest" },
                { name: "💰 Cheapest Route   (minimum fare)", value: "cheapest" },
                { name: "🚏 Fewest Stops     (minimum stops)", value: "shortest" },
            ],
        },
    ]);

    const source = answers.source.trim();
    const destination = answers.destination.trim();

    let result = null;

    if (answers.routeType === "fastest") {
        result = findFastestRoute(source, destination);
    } else if (answers.routeType === "cheapest") {
        result = findCheapestRoute(source, destination);
    } else {
        result = findShortestRoute(source, destination);
    }

    printRoute(result);

    //user wants to search again 
    const { again } = await inquirer.prompt([
        {
            type: "confirm",
            name: "again",
            message: "Search another route?",
            default: true,
        },
    ]);

    return again;
}


async function startMenu() {

    console.log();
    console.log("DELHI METRO ROUTE PLANNER");
    console.log("-".repeat(35));
    console.log("Total stations: " + getStationList().length);
    console.log();

    let keepGoing = true;

    while (keepGoing) {
        keepGoing = await askRoute();
    }
}

module.exports = startMenu;
