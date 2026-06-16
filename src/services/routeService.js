// ─────────────────────────────────────────────────────────────────
// routeService.js — Middle layer between CLI and algorithms
// ─────────────────────────────────────────────────────────────────
// WHY:  The CLI should not know about Graph, BFS, Dijkstra, or
//       data files. This service sets up the graph once and exposes
//       simple functions the CLI can call.
//
// FUNCTIONS:
//   findShortestRoute(from, to)   → fewest stops      (BFS)
//   findFastestRoute(from, to)    → minimum time       (Dijkstra)
//   findCheapestRoute(from, to)   → minimum fare       (Dijkstra)
//   isValidStation(name)          → input validation
//   getStationList()              → autocomplete list
// ─────────────────────────────────────────────────────────────────

const { graph } = require("../../data/dmrc_graph");
const Graph = require("../graph/Graph");
const bfs = require("../algorithms/bfs");
const dijkstra = require("../algorithms/dijkstra");


const metro = new Graph(graph);

function findShortestRoute(source, destination) {
    const path = bfs(metro, source, destination);

    if (!path) return null;

    return { path, cost: path.length - 1, unit: "stops" };
}


function findFastestRoute(source, destination) {
    const result = dijkstra(metro, source, destination, "time");

    if (!result) return null;

    return { path: result.path, cost: result.cost, unit: "min" };
}


function findCheapestRoute(source, destination) {
    const result = dijkstra(metro, source, destination, "fare");

    if (!result) return null;

    return { path: result.path, cost: result.cost, unit: "₹" };
}


function isValidStation(name) {
    return metro.hasStation(name);
}

function getStationList() {
    return metro.getAllStations();
}

module.exports = {
    findShortestRoute,
    findFastestRoute,
    findCheapestRoute,
    isValidStation,
    getStationList,
};
