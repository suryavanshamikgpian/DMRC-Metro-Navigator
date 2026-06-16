class Graph {

    /**
     * @param {Object} adjacencyList — the raw graph from dmrc_graph.js
     *   Shape: { "StationName": [ { station, time, fare, line, ... } ] }
     */
    constructor(adjacencyList) {
        // Deep copy so we don't mutate the original data
        this.adjacencyList = {};

        for (const station of Object.keys(adjacencyList)) {
            this.adjacencyList[station] = [...adjacencyList[station]];
        }

        this._fixMissingReverseEdges();
    }

    /**
     * Scans every edge A→B and ensures B→A also exists.
     * Skips interchange self-loops (A→A).
     */
    _fixMissingReverseEdges() {
        for (const station of Object.keys(this.adjacencyList)) {
            for (const edge of this.adjacencyList[station]) {

                // Skip self-loops (interchange edges like Rajiv Chowk → Rajiv Chowk)
                if (edge.station === station) continue;

                const target = edge.station;

                // Make sure the target station has an array
                if (!this.adjacencyList[target]) {
                    this.adjacencyList[target] = [];
                }

                // Check if reverse edge already exists
                const reverseExists = this.adjacencyList[target].some(
                    (e) => e.station === station && e.line === edge.line
                );

                // If missing, add the reverse edge
                if (!reverseExists) {
                    this.adjacencyList[target].push({
                        station: station,
                        time: edge.time,
                        fare: edge.fare,
                        distKm: edge.distKm,
                        line: edge.line,
                        lineCode: edge.lineCode,
                    });
                }
            }
        }
    }

    /**
     * Returns all neighbour edges for a station.
     * If the station doesn't exist, returns an empty array (no crash).
     */
    getNeighbours(station) {
        return this.adjacencyList[station] || [];
    }

    /**
     * Checks whether a station exists in the graph.
     * Useful for validating user input before running BFS.
     */
    hasStation(station) {
        return station in this.adjacencyList;
    }

    /**
     * Returns a sorted array of every station name.
     * Useful for the CLI to show autocomplete / station list.
     */
    getAllStations() {
        return Object.keys(this.adjacencyList).sort();
    }

}

module.exports = Graph;