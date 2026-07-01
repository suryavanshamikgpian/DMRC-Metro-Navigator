// ─────────────────────────────────────────────────────────────────
// dmrc_data.h — DMRC metro network graph data structures & builder
// ─────────────────────────────────────────────────────────────────
#pragma once

#include <string>
#include <vector>
#include <unordered_map>

using namespace std;

// ─── Edge: one directed connection between two stations ──────────
struct Edge {
    string station;   // name of the neighbour station
    int         time;      // travel time in minutes
    int         fare;      // fare in INR (token price)
    double      distKm;    // distance in km
    string line;      // e.g. "Red Line"
    string lineCode;  // e.g. "L1"
    bool        interchange; // true if this is an interchange walk edge
};

// ─── Adjacency list type ─────────────────────────────────────────
using AdjList = unordered_map<string, vector<Edge>>;

// ─── Builds and returns the complete DMRC adjacency list ─────────
AdjList buildGraph();
