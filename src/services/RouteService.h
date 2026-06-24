// ─────────────────────────────────────────────────────────────────
// RouteService.h — Service layer connecting algorithms to CLI
// ─────────────────────────────────────────────────────────────────
#pragma once

#include <string>
#include <vector>
#include "graph/Graph.h"

// Result returned to the CLI layer
struct RouteResult {
    std::vector<std::string> path;
    double      cost;
    std::string unit;  // "stops", "min", or "Rs"
    bool        found; // false if no route exists
};

class RouteService {
public:
    RouteService();

    RouteResult findShortestRoute(const std::string& source,
                                  const std::string& destination) const;

    RouteResult findFastestRoute(const std::string& source,
                                 const std::string& destination) const;

    RouteResult findCheapestRoute(const std::string& source,
                                  const std::string& destination) const;

    bool isValidStation(const std::string& name) const;

    // Case-insensitive lookup: "dwarka mor" -> "Dwarka Mor"
    // Returns empty string if station not found.
    std::string resolveStation(const std::string& input) const;

    std::vector<std::string> getStationList() const;

private:
    Graph metro_;
};
