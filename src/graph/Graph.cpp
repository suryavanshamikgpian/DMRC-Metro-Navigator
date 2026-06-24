// ─────────────────────────────────────────────────────────────────
// Graph.cpp — Implementation
// ─────────────────────────────────────────────────────────────────
#include "graph/Graph.h"
#include <algorithm>
#include <cctype>

const std::vector<Edge> Graph::EMPTY;

Graph::Graph(AdjList adjList) : adj_(std::move(adjList)) {
    fixMissingReverseEdges();
    // Build lowercase lookup after all edges are finalised
    for (const auto& [name, _] : adj_) {
        std::string lower = name;
        std::transform(lower.begin(), lower.end(), lower.begin(),
                       [](unsigned char c){ return std::tolower(c); });
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
    std::vector<std::pair<std::string, Edge>> toAdd;

    for (auto& [station, edges] : adj_) {
        for (const auto& edge : edges) {
            if (edge.station == station) continue; // skip self-loop

            const std::string& target = edge.station;

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
const std::vector<Edge>& Graph::getNeighbours(const std::string& station) const {
    auto it = adj_.find(station);
    if (it == adj_.end()) return EMPTY;
    return it->second;
}

// ─── hasStation ───────────────────────────────────────────────────
bool Graph::hasStation(const std::string& station) const {
    return adj_.count(station) > 0;
}

// ─── resolveStation ──────────────────────────────────────────────
// Lowercases user input and looks it up in the pre-built map.
// Returns canonical name (e.g. "Rajiv Chowk") or "" if not found.
std::string Graph::resolveStation(const std::string& input) const {
    std::string lower = input;
    std::transform(lower.begin(), lower.end(), lower.begin(),
                   [](unsigned char c){ return std::tolower(c); });
    auto it = lowerToCanonical_.find(lower);
    if (it == lowerToCanonical_.end()) return "";
    return it->second;
}

// ─── getAllStations ───────────────────────────────────────────────
std::vector<std::string> Graph::getAllStations() const {
    std::vector<std::string> stations;
    stations.reserve(adj_.size());
    for (const auto& [name, _] : adj_) {
        stations.push_back(name);
    }
    std::sort(stations.begin(), stations.end());
    return stations;
}
