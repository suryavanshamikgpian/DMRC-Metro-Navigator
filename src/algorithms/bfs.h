// ─────────────────────────────────────────────────────────────────
// bfs.h — BFS for minimum-stops route
// ─────────────────────────────────────────────────────────────────
#pragma once

#include <string>
#include <vector>
#include "graph/Graph.h"

using namespace std;

// Runs BFS on the graph from source to destination.
// Returns the path as a vector of station names (source included).
// Returns an empty vector if no route exists.
vector<string> bfs(const Graph& graph,
                              const string& source,
                              const string& destination);
