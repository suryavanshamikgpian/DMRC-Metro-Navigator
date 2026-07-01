// ─────────────────────────────────────────────────────────────────
// Graph.cpp — Implementation
// ─────────────────────────────────────────────────────────────────
#include "graph/Graph.h"
#include <algorithm>
#include <cctype>

using namespace std;

const vector<Edge> Graph::EMPTY;

Graph::Graph(AdjList adjList) : adj_(std::move(adjList)) {
    fixMissingReverseEdges();
    // Build lowercase lookup after all edges are finalised
    for (const auto& [name, _] : adj_) {
        string lower = name;
        transform(lower.begin(), lower.end(), lower.begin(),
                       [](unsigned char c){ return tolower(c); });
        lowerToCanonical_[lower] = name;
    }
}

// ─── fixMissingReverseEdges ───────────────────────────────────────
// Mirrors Graph.js: for every directed edge A→B we ensure B→A
// exists on the same line. Self-loops (interchange edges) are
// skipped because station == source.
void Graph::fixMissingReverseEdges() {
    // Collect all (source, edge) pairs first to avoid invalidating
    // iterators while we insert new entries.
    vector<pair<string, Edge>> toAdd;

    for (auto& [station, edges] : adj_) {
        for (const auto& edge : edges) {
            if (edge.station == station) continue; // skip self-loop

            const string& target = edge.station;

            // Check if reverse edge already exists (same line)
            auto it = adj_.find(target);
            bool reverseExists = false;

            if (it != adj_.end()) {
                for (const auto& rev : it->second) {
                    if (rev.station == station && rev.line == edge.line) {
                        reverseExists = true;
                        break;
                    }
                }
            }

            if (!reverseExists) {
                Edge rev;
                rev.station   = station;
                rev.time      = edge.time;
                rev.fare      = edge.fare;
                rev.distKm    = edge.distKm;
                rev.line      = edge.line;
                rev.lineCode  = edge.lineCode;
                rev.interchange = edge.interchange;
                toAdd.emplace_back(target, rev);
            }
        }
    }

    for (auto& [target, rev] : toAdd) {
        adj_[target].push_back(std::move(rev));
    }
}

// ─── getNeighbours ───────────────────────────────────────────────
const vector<Edge>& Graph::getNeighbours(const string& station) const {
    auto it = adj_.find(station);
    if (it == adj_.end()) return EMPTY;
    return it->second;
}

// ─── hasStation ───────────────────────────────────────────────────
bool Graph::hasStation(const string& station) const {
    return adj_.count(station) > 0;
}

// ─── resolveStation ──────────────────────────────────────────────
// Lowercases user input and looks it up in the pre-built map.
// Returns canonical name (e.g. "Rajiv Chowk") or "" if not found.
string Graph::resolveStation(const string& input) const {
    string lower = input;
    transform(lower.begin(), lower.end(), lower.begin(),
                   [](unsigned char c){ return tolower(c); });
    auto it = lowerToCanonical_.find(lower);
    if (it == lowerToCanonical_.end()) return "";
    return it->second;
}

// ─── getAllStations ───────────────────────────────────────────────
vector<string> Graph::getAllStations() const {
    vector<string> stations;
    stations.reserve(adj_.size());
    for (const auto& [name, _] : adj_) {
        stations.push_back(name);
    }
    sort(stations.begin(), stations.end());
    return stations;
}
