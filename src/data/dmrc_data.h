// ─────────────────────────────────────────────────────────────────
// dmrc_data.h — DMRC metro network graph data structures & builder
// ─────────────────────────────────────────────────────────────────
#pragma once

#include <string>
#include <vector>
#include <unordered_map>

// ─── Edge: one directed connection between two stations ──────────
struct Edge {
    std::string station;   // name of the neighbour station
    int         time;      // travel time in minutes
    int         fare;      // fare in INR (token price)
    double      distKm;    // distance in km
    std::string line;      // e.g. "Red Line"
    std::string lineCode;  // e.g. "L1"
    bool        interchange; // true if this is an interchange walk edge
};

// ─── Adjacency list type ─────────────────────────────────────────
using AdjList = std::unordered_map<std::string, std::vector<Edge>>;

// ─── Builds and returns the complete DMRC adjacency list ─────────
AdjList buildGraph();
