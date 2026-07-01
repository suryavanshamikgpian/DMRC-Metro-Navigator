// ─────────────────────────────────────────────────────────────────
// Graph.h — Weighted adjacency-list graph with auto-repair
// ─────────────────────────────────────────────────────────────────
#pragma once
#include <cctype>

#include <string>
#include <vector>
#include <algorithm>
#include "data/dmrc_data.h"

using namespace std;

class Graph {
public:
    // Build from the raw adjacency list produced by buildGraph().
    // Automatically ensures all bidirectional edges exist.
    explicit Graph(AdjList adjList);

    // Returns all neighbour edges for a station (empty vec if unknown).
    const vector<Edge>& getNeighbours(const string& station) const;

    // Returns true if the station name exists in the graph.
    bool hasStation(const string& station) const;

    // Case-insensitive lookup: returns the canonical station name,
    // or an empty string if not found.
    string resolveStation(const string& input) const;

    // Returns a sorted list of every station name.
    vector<string> getAllStations() const;

private:
    AdjList adj_;
    // Maps lowercase(stationName) → canonical station name
    unordered_map<string, string> lowerToCanonical_;

    // Scans every edge A→B and adds B→A if it doesn't exist (same line).
    // Skips self-loops (interchange edges where station == source).
    void fixMissingReverseEdges();

    static const vector<Edge> EMPTY;
};
