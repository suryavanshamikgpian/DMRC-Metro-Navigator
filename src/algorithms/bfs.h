// ─────────────────────────────────────────────────────────────────
// bfs.h — BFS for minimum-stops route
// ─────────────────────────────────────────────────────────────────
#pragma once

#include <string>
#include <vector>
#include "graph/Graph.h"

// Runs BFS on the graph from source to destination.
// Returns the path as a vector of station names (source included).
// Returns an empty vector if no route exists.
std::vector<std::string> bfs(const Graph& graph,
                              const std::string& source,
                              const std::string& destination);
