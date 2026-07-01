// ─────────────────────────────────────────────────────────────────
// dijkstra.h — Weighted shortest-path (time or fare)
// ─────────────────────────────────────────────────────────────────
#pragma once

#include <string>
#include <vector>
#include "graph/Graph.h"

using namespace std;

// Weight key: which edge field to minimise
enum class WeightKey { TIME, FARE };

// Result of a Dijkstra search
struct DijkstraResult {
    vector<string> path;
    double cost;
};

// Finds the shortest path by the given weight key.
// Returns a valid DijkstraResult, or {empty path, 0} if no route.
DijkstraResult dijkstra(const Graph& graph,
                         const string& source,
                         const string& destination,
                         WeightKey key);
