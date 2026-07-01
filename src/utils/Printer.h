// ─────────────────────────────────────────────────────────────────
// Printer.h — Pretty terminal output formatter
// ─────────────────────────────────────────────────────────────────
#pragma once

#include "services/RouteService.h"

using namespace std;

// Prints a metro route result nicely.
// Mirrors printer.js exactly: green circle at start, red at end,
// divider lines, total stops and cost footer.
void printRoute(const RouteResult& result);
