// ─────────────────────────────────────────────────────────────────
// RouteService.h — Service layer connecting algorithms to CLI
// ─────────────────────────────────────────────────────────────────
#pragma once

#include <string>
#include <vector>
#include "graph/Graph.h"

using namespace std;

// Result returned to the CLI layer
struct RouteResult {
    vector<string> path;
    double      cost;
    string unit;  // "stops", "min", or "Rs"
    bool        found; // false if no route exists
};

class RouteService {
public:
    RouteService();

    RouteResult findShortestRoute(const string& source,
                                  const string& destination) const;

    RouteResult findFastestRoute(const string& source,
                                 const string& destination) const;

    RouteResult findCheapestRoute(const string& source,
                                  const string& destination) const;

    bool isValidStation(const string& name) const;

    // Case-insensitive lookup: "dwarka mor" -> "Dwarka Mor"
    // Returns empty string if station not found.
    string resolveStation(const string& input) const;

    vector<string> getStationList() const;

private:
    Graph metro_;
};
