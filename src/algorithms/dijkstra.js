// ─────────────────────────────────────────────────────────────────
// dijkstra.js — Weighted shortest-path algorithm
// ─────────────────────────────────────────────────────────────────
// WHY:  BFS finds the fewest STOPS, but ignores edge weights.
//       Dijkstra uses the actual time/fare on each edge to find
//       the truly optimal route by a given metric.
//
// HOW IT WORKS:
//   1. Start at source with cost 0. All others = Infinity.
//   2. Use a PriorityQueue to always expand the cheapest node.
//   3. For each neighbour, calculate new cost = current + edge weight.
//   4. If new cost < known cost, update and add to queue.
//   5. Track the "previous" station so we can rebuild the path.
//
// FLEXIBLE:
//   Pass weightKey = "time" for fastest route.
//   Pass weightKey = "fare" for cheapest route.
//   Same function handles both — no duplicate code.
//
// RETURNS:
//   { path: ["A", "B", "C"], cost: 18 }  or  null if no route
// ─────────────────────────────────────────────────────────────────

const PriorityQueue = require("../graph/PriorityQueue");

/**
 * @param {Graph} graph — Graph instance
 * @param {string} source — starting station
 * @param {string} destination — ending station
 * @param {string} weightKey — "time" or "fare"
 * @returns {{ path: string[], cost: number } | null}
 */
function dijkstra(graph, source, destination, weightKey) {

    const costs = {};       // lowest known cost to reach each station
    const previous = {};    // which station we came from (to rebuild path)
    const pq = new PriorityQueue();

    // Initialize: source costs 0, everything else is Infinity
    costs[source] = 0;
    pq.enqueue(source, 0);

    while (!pq.isEmpty()) {

        const { element: current, priority: currentCost } = pq.dequeue();

        // Reached destination — rebuild the path
        if (current === destination) {
            const path = rebuildPath(previous, source, destination);
            return { path, cost: currentCost };
        }

        // Skip if we already found a better route to this station
        if (currentCost > costs[current]) {
            continue;
        }

        // Explore neighbours
        const neighbours = graph.getNeighbours(current);

        for (const edge of neighbours) {

            const next = edge.station;
            const edgeWeight = edge[weightKey] || 0;
            const newCost = currentCost + edgeWeight;

            // Only update if this path is cheaper than what we knew
            if (costs[next] === undefined || newCost < costs[next]) {
                costs[next] = newCost;
                previous[next] = current;
                pq.enqueue(next, newCost);
            }
        }
    }

    // Queue empty, destination never reached
    return null;
}

/**
 * Walks backwards through the "previous" map to build the path.
 * @returns {string[]} — path from source to destination
 */
function rebuildPath(previous, source, destination) {

    const path = [];
    let current = destination;

    while (current !== source) {
        path.unshift(current);
        current = previous[current];
    }

    path.unshift(source);
    return path;
}

module.exports = dijkstra;
