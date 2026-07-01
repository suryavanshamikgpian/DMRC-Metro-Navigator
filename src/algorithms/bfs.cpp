// ─────────────────────────────────────────────────────────────────
// bfs.cpp — Breadth-First Search for minimum-stops route
// ─────────────────────────────────────────────────────────────────
// WHY BFS?
//   BFS explores stations level-by-level (1 stop away, then 2,
//   then 3...). The FIRST time it reaches the destination, that
//   path is guaranteed to have the fewest stops.
//
// HOW IT WORKS:
//   1. Start with a queue containing just [source].
//   2. Take the first path from the queue.
//   3. If its last station is the destination → done!
//   4. Otherwise, push each unvisited neighbour as a new path.
//   5. Repeat until found or queue is empty (no route).
//
// RETURNS:
//   - Vector of station names (the path), e.g. {"A","B","C"}
//   - Empty vector if no route exists
// ─────────────────────────────────────────────────────────────────
#include "algorithms/bfs.h"
#include <queue>
#include <unordered_set>

using namespace std;

vector<string> bfs(const Graph& graph,
                              const string& source,
                              const string& destination) {

    // Queue of paths (each path is a vector of station names)
    queue<vector<string>> q;
    unordered_set<string> visited;

    q.push({source});
    visited.insert(source);

    while (!q.empty()) {
        vector<string> path = q.front();
        q.pop();

        const string& current = path.back();

        // Found the destination — return this path
        if (current == destination) {
            return path;
        }

        // Explore all neighbours of the current station
        for (const Edge& edge : graph.getNeighbours(current)) {
            const string& next = edge.station;

            if (visited.find(next) == visited.end()) {
                visited.insert(next);
                vector<string> newPath = path;
                newPath.push_back(next);
                q.push(std::move(newPath));
            }
        }
    }

    // Queue empty — no route found
    return {};
}
