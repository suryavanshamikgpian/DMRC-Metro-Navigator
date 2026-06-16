// ─────────────────────────────────────────────────────────────────
// bfs.js — Breadth-First Search for minimum-stops route
// ─────────────────────────────────────────────────────────────────
// WHY BFS?
//   BFS explores stations level-by-level (1 stop away, then 2,
//   then 3...). So the FIRST time it reaches the destination,
//   that path is guaranteed to have the fewest stops.
//   Dijkstra would be needed for shortest TIME or lowest FARE,
//   but for fewest stops, BFS is perfect.
//
// HOW IT WORKS:
//   1. Start with a queue containing just [source].
//   2. Take the first path from the queue.
//   3. If its last station is the destination → done!
//   4. Otherwise, add each unvisited neighbour as a new path.
//   5. Repeat until found or queue is empty (no route).
//
// RETURNS:
//   - Array of station names (the path), e.g. ["A", "B", "C"]
//   - null if no route exists
// ─────────────────────────────────────────────────────────────────

function bfs(graph, source, destination) {

    const queue = [[source]];
    const visited = new Set();

    visited.add(source);

    while (queue.length > 0) {

        const path = queue.shift();
        const current = path[path.length - 1];

        // Found the destination — return the path
        if (current === destination) {
            return path;
        }

        // Explore all neighbours of the current station
        const neighbours = graph.getNeighbours(current);

        for (const edge of neighbours) {

            const next = edge.station;

            if (!visited.has(next)) {
                visited.add(next);
                queue.push([...path, next]);
            }
        }
    }

    // Queue is empty and destination was never reached
    return null;
}

module.exports = bfs;