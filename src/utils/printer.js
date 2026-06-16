// ─────────────────────────────────────────────────────────────────
// printer.js — Pretty-prints a metro route in the terminal
// ─────────────────────────────────────────────────────────────────
// WHY:  Separates display logic from business logic.
//       Accepts the result object from routeService and makes
//       it look nice. Shape: { path, cost, unit }
// ─────────────────────────────────────────────────────────────────

/**
 * Prints a metro route result nicely in the terminal.
 * @param {Object|null} result — { path: string[], cost: number, unit: string } or null
 */
function printRoute(result) {

    if (!result) {
        console.log("\n  ❌ No route found!\n");
        return;
    }

    const { path, cost, unit } = result;

    if (path.length === 1) {
        console.log("\n  📍 You are already at " + path[0] + "!\n");
        return;
    }

    // Format cost display based on unit
    let costDisplay = "";
    if (unit === "₹") {
        costDisplay = "₹" + cost;
    } else {
        costDisplay = cost + " " + unit;
    }

    const totalStops = path.length - 1;

    console.log("\n  🚇 Route Found — " + costDisplay + " (" + totalStops + " stops)");
    console.log("  " + "─".repeat(45));

    for (let i = 0; i < path.length; i++) {

        const station = path[i];
        let prefix = "  │  ";

        if (i === 0) {
            prefix = "  🟢 ";            // start
        } else if (i === path.length - 1) {
            prefix = "  🔴 ";            // end
        }

        console.log(prefix + (i + 1) + ". " + station);
    }

    console.log("  " + "─".repeat(45));
    console.log("  Total: " + totalStops + " stops | " + costDisplay);
    console.log();
}

module.exports = printRoute;
