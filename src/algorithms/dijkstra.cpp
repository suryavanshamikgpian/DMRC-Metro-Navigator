// ─────────────────────────────────────────────────────────────────
// dijkstra.cpp — Dijkstra's algorithm (time or fare)
// ─────────────────────────────────────────────────────────────────
// WHY: BFS finds fewest STOPS but ignores edge weights. Dijkstra
//      uses actual time/fare on each edge to find the truly
//      optimal route by a given metric.
//
// HOW IT WORKS:
//   1. Start at source with cost 0. All others = infinity.
//   2. Use PriorityQueue to always expand the cheapest node.
//   3. For each neighbour, newCost = current + edgeWeight.
//   4. If newCost < known cost, update and enqueue.
//   5. Track "previous" station to rebuild the path.
//
// FLEXIBLE: Pass WeightKey::TIME or WeightKey::FARE.
//   Same function — no duplicate code.
// ─────────────────────────────────────────────────────────────────
#include "algorithms/dijkstra.h"
#include "graph/PriorityQueue.h"
#include <unordered_map>
#include <limits>

using namespace std;

// ─── Rebuilds path from previous map ─────────────────────────────
static vector<string> rebuildPath(
        const unordered_map<string, string>& previous,
        const string& source,
        const string& destination) {

    vector<string> path;
    string current = destination;

    while (current != source) {
        path.push_back(current);
        auto it = previous.find(current);
        if (it == previous.end()) return {}; // disconnected (safety)
        current = it->second;
    }
    path.push_back(source);

    // Reverse to get source→destination order
    reverse(path.begin(), path.end());
    return path;
}

// ─── dijkstra ────────────────────────────────────────────────────
DijkstraResult dijkstra(const Graph& graph,
                         const string& source,
                         const string& destination,
                         WeightKey key) {

    unordered_map<string, double>      costs;     // best cost to reach each station
    unordered_map<string, string> previous;  // path reconstruction
    PriorityQueue pq;

    costs[source] = 0.0;
    pq.enqueue(source, 0.0);

    while (!pq.isEmpty()) {
        auto [currentCost, current] = pq.dequeue();

        // Reached destination — rebuild and return
        if (current == destination) {
            return { rebuildPath(previous, source, destination), currentCost };
        }

        // Skip stale queue entries
        auto costIt = costs.find(current);
        if (costIt != costs.end() && currentCost > costIt->second) {
            continue;
        }

        // Explore neighbours
        for (const Edge& edge : graph.getNeighbours(current)) {
            const string& next = edge.station;

            double edgeWeight = (key == WeightKey::TIME)
                                ? static_cast<double>(edge.time)
                                : static_cast<double>(edge.fare);

            double newCost = currentCost + edgeWeight;

            auto it = costs.find(next);
            if (it == costs.end() || newCost < it->second) {
                costs[next]    = newCost;
                previous[next] = current;
                pq.enqueue(next, newCost);
            }
        }
    }

    // No route found
    return {{}, 0.0};
}
