// ─────────────────────────────────────────────────────────────────
// main.cpp — Entry point + interactive CLI menu
// ─────────────────────────────────────────────────────────────────
// Combines index.js + menu.js from the original Node.js project.
// Displays banner, loops asking for source/destination/route type,
// prints result, then asks if user wants to search again.
// ─────────────────────────────────────────────────────────────────
#include <iostream>
#include <string>
#include <algorithm>
#include <limits>
#include "services/RouteService.h"
#include "utils/Printer.h"

// ─── Trim whitespace from both ends ──────────────────────────────
static std::string trim(const std::string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    size_t end   = s.find_last_not_of(" \t\r\n");
    if (start == std::string::npos) return "";
    return s.substr(start, end - start + 1);
}

// ─── Prompt for a valid station name (case-insensitive) ──────────
static std::string promptStation(const RouteService& svc,
                                  const std::string& label) {
    std::string input;
    while (true) {
        std::cout << "  " << label << ": ";
        std::getline(std::cin, input);
        std::string trimmed = trim(input);

        if (trimmed.empty()) {
            std::cout << "  [!] Please enter a station name.\n";
            continue;
        }

        std::string canonical = svc.resolveStation(trimmed);
        if (canonical.empty()) {
            std::cout << "  [!] Station not found. Check spelling and try again.\n";
            continue;
        }

        // Show the resolved canonical name so the user sees what matched
        if (canonical != trimmed) {
            std::cout << "  --> Resolved to: " << canonical << "\n";
        }
        return canonical;
    }
}

// ─── Prompt for route type ────────────────────────────────────────
static int promptRouteType() {
    while (true) {
        std::cout << "\n  How do you want to travel?\n";
        std::cout << "    1. Fastest Route    (minimum time)\n";
        std::cout << "    2. Cheapest Route   (minimum fare)\n";
        std::cout << "    3. Fewest Stops     (minimum stops)\n";
        std::cout << "  Enter choice (1/2/3): ";

        std::string input;
        std::getline(std::cin, input);
        std::string ch = trim(input);

        if (ch == "1" || ch == "2" || ch == "3") {
            return std::stoi(ch);
        }
        std::cout << "  [!] Please enter 1, 2, or 3.\n";
    }
}

// ─── Ask if user wants another search ────────────────────────────
static bool promptAgain() {
    while (true) {
        std::cout << "  Search another route? (y/n): ";
        std::string input;
        std::getline(std::cin, input);
        std::string ans = trim(input);
        // lowercase
        std::transform(ans.begin(), ans.end(), ans.begin(), ::tolower);

        if (ans == "y" || ans == "yes") return true;
        if (ans == "n" || ans == "no")  return false;
        std::cout << "  [!] Please type y or n.\n";
    }
}

// ─── Main ─────────────────────────────────────────────────────────
int main() {
    RouteService svc;

    // Banner
    std::cout << "\n";
    std::cout << "  DELHI METRO ROUTE PLANNER\n";
    std::cout << "  " << std::string(35, '-') << "\n";
    std::cout << "  Total stations: " << svc.getStationList().size() << "\n\n";

    bool keepGoing = true;

    while (keepGoing) {
        // 1. Get source
        std::string source = promptStation(svc, "Enter SOURCE station");

        // 2. Get destination
        std::string dest = promptStation(svc, "Enter DESTINATION station");

        // 3. Choose route type
        int choice = promptRouteType();

        // 4. Find route
        RouteResult result;
        if (choice == 1) {
            result = svc.findFastestRoute(source, dest);
        } else if (choice == 2) {
            result = svc.findCheapestRoute(source, dest);
        } else {
            result = svc.findShortestRoute(source, dest);
        }

        // 5. Print result
        printRoute(result);

        // 6. Loop?
        keepGoing = promptAgain();
        std::cout << "\n";
    }

    std::cout << "  Goodbye!\n\n";
    return 0;
}
