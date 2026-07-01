// ─────────────────────────────────────────────────────────────────
// Printer.cpp — Pretty terminal output formatter
// ─────────────────────────────────────────────────────────────────
// WHY: Separates display logic from business logic.
//      Accepts the RouteResult from RouteService and makes it
//      look nice in the terminal.
// ─────────────────────────────────────────────────────────────────
#include "utils/Printer.h"
#include <iostream>
#include <string>
#include <iomanip>
#include <cmath>

using namespace std;

// Unicode emojis encoded as UTF-8 string literals
static const string DIVIDER(45, '-');

void printRoute(const RouteResult& result) {

    if (!result.found) {
        cout << "\n  No route found!\n\n";
        return;
    }

    const auto& path = result.path;
    const auto& unit = result.unit;
    double cost      = result.cost;

    if (path.size() == 1) {
        cout << "\n  You are already at " << path[0] << "!\n\n";
        return;
    }

    // Format cost string
    string costDisplay;
    if (unit == "Rs") {
        costDisplay = "Rs " + to_string(static_cast<int>(cost));
    } else if (unit == "min") {
        costDisplay = to_string(static_cast<int>(cost)) + " " + unit;
    } else {
        // stops
        costDisplay = to_string(static_cast<int>(cost)) + " " + unit;
    }

    int totalStops = static_cast<int>(path.size()) - 1;

    cout << "\n  Route Found -- " << costDisplay
              << " (" << totalStops << " stops)\n";
    cout << "  " << DIVIDER << "\n";

    for (int i = 0; i < static_cast<int>(path.size()); ++i) {
        string prefix;
        if (i == 0) {
            prefix = "  [START] ";      // green start
        } else if (i == static_cast<int>(path.size()) - 1) {
            prefix = "  [END]   ";      // red end
        } else {
            prefix = "  |       ";
        }
        cout << prefix << (i + 1) << ". " << path[static_cast<size_t>(i)] << "\n";
    }

    cout << "  " << DIVIDER << "\n";
    cout << "  Total: " << totalStops << " stops | " << costDisplay << "\n\n";
}
