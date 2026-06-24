// ─────────────────────────────────────────────────────────────────
// RouteService.cpp — Implementation
// ─────────────────────────────────────────────────────────────────
#include "services/RouteService.h"
#include "data/dmrc_data.h"
#include "algorithms/bfs.h"
#include "algorithms/dijkstra.h"

// ─── Constructor: build the graph once ───────────────────────────
RouteService::RouteService() : metro_(buildGraph()) {}

// ─── Fewest stops (BFS) ──────────────────────────────────────────
RouteResult RouteService::findShortestRoute(const std::string& source,
                                             const std::string& destination) const {
    auto path = bfs(metro_, source, destination);
    if (path.empty()) return {{}, 0, "stops", false};
    int stops = static_cast<int>(path.size()) - 1;
    return {path, static_cast<double>(stops), "stops", true};
}

// ─── Fastest route (Dijkstra, weight=time) ───────────────────────
RouteResult RouteService::findFastestRoute(const std::string& source,
                                            const std::string& destination) const {
    auto result = dijkstra(metro_, source, destination, WeightKey::TIME);
    if (result.path.empty()) return {{}, 0, "min", false};
    return {result.path, result.cost, "min", true};
}

// ─── Cheapest route (Dijkstra, weight=fare) ──────────────────────
RouteResult RouteService::findCheapestRoute(const std::string& source,
                                             const std::string& destination) const {
    auto result = dijkstra(metro_, source, destination, WeightKey::FARE);
    if (result.path.empty()) return {{}, 0, "Rs", false};
    return {result.path, result.cost, "Rs", true};
}

// ─── Validation ──────────────────────────────────────────────────
bool RouteService::isValidStation(const std::string& name) const {
    return metro_.hasStation(name);
}

std::string RouteService::resolveStation(const std::string& input) const {
    return metro_.resolveStation(input);
}

std::vector<std::string> RouteService::getStationList() const {
    return metro_.getAllStations();
}
