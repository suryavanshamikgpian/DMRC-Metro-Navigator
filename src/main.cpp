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

using namespace std;

// ─── Trim whitespace from both ends ──────────────────────────────
static string trim(const string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    size_t end   = s.find_last_not_of(" \t\r\n");
    if (start == string::npos) return "";
    return s.substr(start, end - start + 1);
}

// ─── Prompt for a valid station name (case-insensitive) ──────────
static string promptStation(const RouteService& svc,
                                  const string& label) {
    string input;
    while (true) {
        cout << "  " << label << ": ";
        getline(cin, input);
        string trimmed = trim(input);

        if (trimmed.empty()) {
            cout << "  [!] Please enter a station name.\n";
            continue;
        }

        string canonical = svc.resolveStation(trimmed);
        if (canonical.empty()) {
            cout << "  [!] Station not found. Check spelling and try again.\n";
            continue;
        }

        // Show the resolved canonical name so the user sees what matched
        if (canonical != trimmed) {
            cout << "  --> Resolved to: " << canonical << "\n";
        }
        return canonical;
    }
}

// ─── Prompt for route type ────────────────────────────────────────
static int promptRouteType() {
    while (true) {
        cout << "\n  How do you want to travel?\n";
        cout << "    1. Fastest Route    (minimum time)\n";
        cout << "    2. Cheapest Route   (minimum fare)\n";
        cout << "    3. Fewest Stops     (minimum stops)\n";
        cout << "  Enter choice (1/2/3): ";

        string input;
        getline(cin, input);
        string ch = trim(input);

        if (ch == "1" || ch == "2" || ch == "3") {
            return stoi(ch);
        }
        cout << "  [!] Please enter 1, 2, or 3.\n";
    }
}

// ─── Ask if user wants another search ────────────────────────────
static bool promptAgain() {
    while (true) {
        cout << "  Search another route? (y/n): ";
        string input;
        getline(cin, input);
        string ans = trim(input);
        // lowercase
        transform(ans.begin(), ans.end(), ans.begin(), ::tolower);

        if (ans == "y" || ans == "yes") return true;
        if (ans == "n" || ans == "no")  return false;
        cout << "  [!] Please type y or n.\n";
    }
}

// ─── Main ─────────────────────────────────────────────────────────
int main() {
    RouteService svc;

    // Banner
    cout << "\n";
    cout << "  DELHI METRO ROUTE PLANNER\n";
    cout << "  " << string(35, '-') << "\n";
    cout << "  Total stations: " << svc.getStationList().size() << "\n\n";

    bool keepGoing = true;

    while (keepGoing) {
        // 1. Get source
        string source = promptStation(svc, "Enter SOURCE station");

        // 2. Get destination
        string dest = promptStation(svc, "Enter DESTINATION station");

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
        cout << "\n";
    }

    cout << "  Goodbye!\n\n";
    return 0;
}
