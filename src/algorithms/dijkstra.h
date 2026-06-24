// ─────────────────────────────────────────────────────────────────
// dijkstra.h — Weighted shortest-path (time or fare)
// ─────────────────────────────────────────────────────────────────
#pragma once

#include <string>
#include <vector>
#include "graph/Graph.h"

// Weight key: which edge field to minimise
enum class WeightKey { TIME, FARE };

// Result of a Dijkstra search
struct DijkstraResult {
    std::vector<std::string> path;
    double cost;
};

// Finds the shortest path by the given weight key.
// Returns a valid DijkstraResult, or {empty path, 0} if no route.
DijkstraResult dijkstra(const Graph& graph,
                         const std::string& source,
                         const std::string& destination,
                         WeightKey key);
