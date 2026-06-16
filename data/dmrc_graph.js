/**
 * DMRC (Delhi Metro Rail Corporation) — Full Network Graph
 * =========================================================
 * Data Structure (mirrors the example format):
 *   graph[stationName] = [
 *     { station: "NextStation", time: <minutes>, fare: <INR>, line: "Line Color", lineCode: "L1" },
 *     ...
 *   ]
 *
 * FARE SLAB (Token, as per DMRC official rates — latest revision Aug 2025):
 *   0–2 km   → ₹11
 *   2–5 km   → ₹21
 *   5–12 km  → ₹32
 *   12–21 km → ₹43
 *   21–32 km → ₹54
 *   >32 km   → ₹64
 *   Smart Card: 10% off on all above fares.
 *   Airport Express Line: separate flat slabs (see AEL section).
 *   Rapid Metro Gurgaon: flat ₹20 all stations.
 *
 * TRAVEL TIME: ~2 min per station gap (avg. inter-station ~1.2 km @ ~36 km/h incl. dwell).
 *   Interchange penalty (walk): +5 min typical, noted in interchange edges.
 *
 * LINE CODES & COLORS:
 *   L1  Red Line          #E31E24
 *   L2  Yellow Line       #FFDA00  (text: #000)
 *   L3  Blue Line         #1565C0
 *   L3B Blue Line Branch  #1565C0
 *   L4  Blue Line Silver  #90CAF9  (4 stations only — Phase 4, limited)
 *   L5  Green Line        #008000
 *   L6  Violet Line       #7B1FA2
 *   L7  Pink Line         #E91E8C
 *   L8  Magenta Line      #C2185B
 *   L9  Grey Line         #9E9E9E
 *   AEL Airport Express   #FF6F00
 *   RMG Rapid Metro Gurgaon #1976D2
 *
 * Sources:
 *   - delhimetrorail.com (official)
 *   - Wikipedia Delhi Metro lines (Red, Yellow, Blue, Green, Violet, Pink, Magenta, Grey)
 *   - metrogo.in/delhi-metro-fares (fare slabs)
 *   - mapsofindia.com fare calculator
 */

// ─────────────────────────────────────────────────────────────────────────────
// FARE HELPER
// Returns token fare (₹) for a given cumulative distance in km.
// ─────────────────────────────────────────────────────────────────────────────
function getFare(distanceKm) {
    if (distanceKm <= 2) return 11;
    if (distanceKm <= 5) return 21;
    if (distanceKm <= 12) return 32;
    if (distanceKm <= 21) return 43;
    if (distanceKm <= 32) return 54;
    return 64;
}

function getSmartCardFare(distanceKm) {
    return Math.round(getFare(distanceKm) * 0.9);
}

// ─────────────────────────────────────────────────────────────────────────────
// LINE META — colour + code for UI rendering
// ─────────────────────────────────────────────────────────────────────────────
const LINE_META = {
    "Red Line": { code: "L1", color: "#E31E24", textColor: "#fff" },
    "Yellow Line": { code: "L2", color: "#FFDA00", textColor: "#000" },
    "Blue Line": { code: "L3", color: "#1565C0", textColor: "#fff" },
    "Blue Line Branch": { code: "L3B", color: "#1565C0", textColor: "#fff" },
    "Green Line": { code: "L5", color: "#2E7D32", textColor: "#fff" },
    "Violet Line": { code: "L6", color: "#7B1FA2", textColor: "#fff" },
    "Pink Line": { code: "L7", color: "#E91E8C", textColor: "#fff" },
    "Magenta Line": { code: "L8", color: "#C2185B", textColor: "#fff" },
    "Grey Line": { code: "L9", color: "#757575", textColor: "#fff" },
    "Airport Express": { code: "AEL", color: "#FF6F00", textColor: "#fff" },
    "Rapid Metro Gurgaon": { code: "RMG", color: "#1976D2", textColor: "#fff" },
};

// ─────────────────────────────────────────────────────────────────────────────
// INTERCHANGE STATION CATALOGUE
// Stations where passengers can switch lines (same fare, +4-8 min walk).
// ─────────────────────────────────────────────────────────────────────────────
const INTERCHANGE_STATIONS = {
    "Kashmere Gate": ["Red Line", "Yellow Line", "Violet Line"],
    "Rajiv Chowk": ["Yellow Line", "Blue Line"],
    "Central Secretariat": ["Yellow Line", "Violet Line"],
    "Mandi House": ["Blue Line", "Violet Line"],
    "Inderlok": ["Red Line", "Green Line"],
    "Netaji Subhash Place": ["Red Line", "Pink Line"],
    "Welcome": ["Red Line", "Pink Line"],
    "Kirti Nagar": ["Blue Line", "Green Line"],
    "Azadpur": ["Yellow Line", "Pink Line"],
    "Sikanderpur": ["Yellow Line", "Rapid Metro Gurgaon"],
    "Botanical Garden": ["Blue Line", "Magenta Line"],
    "Janakpuri West": ["Blue Line", "Magenta Line"],
    "Hauz Khas": ["Yellow Line", "Magenta Line"],
    "Durgabai Deshmukh South Campus": ["Yellow Line", "Pink Line"],
    "Lajpat Nagar": ["Violet Line", "Pink Line"],
    "Mayur Vihar Phase-1": ["Blue Line", "Pink Line"],
    "Anand Vihar": ["Blue Line Branch", "Pink Line"],
    "IP Extension": ["Blue Line Branch", "Pink Line"],
    "Maujpur - Babarpur": ["Pink Line (main)", "Pink Line (branch)"],
    "Dwarka": ["Blue Line", "Grey Line"],
    "Dhaula Kuan": ["Airport Express", "Pink Line"],
    "New Delhi": ["Yellow Line", "Airport Express"],
    "Shivaji Stadium": ["Airport Express", "Yellow Line"],
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN GRAPH
// Each adjacency entry: { station, time (min), fare (₹ token), line, lineCode,
//                         distKm, interchange }
// Edges are BIDIRECTIONAL — both directions stored for easy lookup.
// ─────────────────────────────────────────────────────────────────────────────
const graph = {

    // ═══════════════════════════════════════════════════════════════════════════
    // LINE 1 — RED LINE  (#E31E24)
    // Rithala ↔ Shaheed Sthal (New Bus Adda)   34.55 km | 29 stations
    // Avg inter-station ≈ 1.19 km → ~2 min travel, fare ₹11 adjacent
    // ═══════════════════════════════════════════════════════════════════════════

    "Rithala": [
        { station: "Rohini West", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
    ],
    "Rohini West": [
        { station: "Rithala", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Rohini East", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
    ],
    "Rohini East": [
        { station: "Rohini West", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        { station: "Madhuban Chowk", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
    ],
    "Madhuban Chowk": [
        { station: "Rohini East", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
        { station: "Kohat Enclave", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
    ],
    "Kohat Enclave": [
        { station: "Madhuban Chowk", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Netaji Subhash Place", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
    ],
    "Netaji Subhash Place": [
        { station: "Kohat Enclave", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        { station: "Keshav Puram", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        // Interchange → Pink Line (same station, walk ~5 min)
        { station: "Netaji Subhash Place", time: 5, fare: 0, distKm: 0, line: "Pink Line", lineCode: "L7", interchange: true },
    ],
    "Keshav Puram": [
        { station: "Netaji Subhash Place", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Kanhaiya Nagar", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
    ],
    "Kanhaiya Nagar": [
        { station: "Keshav Puram", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
        { station: "Inderlok", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
    ],
    "Inderlok": [
        { station: "Kanhaiya Nagar", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        { station: "Shastri Nagar", time: 2, fare: 11, distKm: 1.0, line: "Red Line", lineCode: "L1" },
        // Interchange → Green Line
        { station: "Inderlok", time: 4, fare: 0, distKm: 0, line: "Green Line", lineCode: "L5", interchange: true },
    ],
    "Shastri Nagar": [
        { station: "Inderlok", time: 2, fare: 11, distKm: 1.0, line: "Red Line", lineCode: "L1" },
        { station: "Pratap Nagar", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
    ],
    "Pratap Nagar": [
        { station: "Shastri Nagar", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Pul Bangash", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
    ],
    "Pul Bangash": [
        { station: "Pratap Nagar", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        { station: "Tis Hazari", time: 2, fare: 11, distKm: 1.0, line: "Red Line", lineCode: "L1" },
    ],
    "Tis Hazari": [
        { station: "Pul Bangash", time: 2, fare: 11, distKm: 1.0, line: "Red Line", lineCode: "L1" },
        { station: "Kashmere Gate", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
    ],
    "Kashmere Gate": [
        { station: "Tis Hazari", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
        { station: "Shastri Park", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        // Interchange → Yellow Line
        { station: "Kashmere Gate", time: 5, fare: 0, distKm: 0, line: "Yellow Line", lineCode: "L2", interchange: true },
        // Interchange → Violet Line
        { station: "Kashmere Gate", time: 5, fare: 0, distKm: 0, line: "Violet Line", lineCode: "L6", interchange: true },
    ],
    "Shastri Park": [
        { station: "Kashmere Gate", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        { station: "Seelampur", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
    ],
    "Seelampur": [
        { station: "Shastri Park", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Welcome", time: 2, fare: 11, distKm: 1.0, line: "Red Line", lineCode: "L1" },
    ],
    "Welcome": [
        { station: "Seelampur", time: 2, fare: 11, distKm: 1.0, line: "Red Line", lineCode: "L1" },
        { station: "Shahdara", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        // Interchange → Pink Line
        { station: "Welcome", time: 5, fare: 0, distKm: 0, line: "Pink Line", lineCode: "L7", interchange: true },
    ],
    "Shahdara": [
        { station: "Welcome", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        { station: "Mansarovar Park", time: 2, fare: 11, distKm: 1.0, line: "Red Line", lineCode: "L1" },
    ],
    "Mansarovar Park": [
        { station: "Shahdara", time: 2, fare: 11, distKm: 1.0, line: "Red Line", lineCode: "L1" },
        { station: "Jhilmil", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
    ],
    "Jhilmil": [
        { station: "Mansarovar Park", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Dilshad Garden", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
    ],
    "Dilshad Garden": [
        { station: "Jhilmil", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        { station: "Shaheed Nagar", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
    ],
    "Shaheed Nagar": [
        { station: "Dilshad Garden", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Raj Bagh", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
    ],
    "Raj Bagh": [
        { station: "Shaheed Nagar", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        { station: "Rajendra Nagar", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
    ],
    "Rajendra Nagar": [
        { station: "Raj Bagh", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Shyam Park", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
    ],
    "Shyam Park": [
        { station: "Rajendra Nagar", time: 2, fare: 11, distKm: 1.1, line: "Red Line", lineCode: "L1" },
        { station: "Mohan Nagar", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
    ],
    "Mohan Nagar": [
        { station: "Shyam Park", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
        { station: "Arthala", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
    ],
    "Arthala": [
        { station: "Mohan Nagar", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Hindon River", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
    ],
    "Hindon River": [
        { station: "Arthala", time: 2, fare: 11, distKm: 1.2, line: "Red Line", lineCode: "L1" },
        { station: "Shaheed Sthal", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
    ],
    "Shaheed Sthal": [
        { station: "Hindon River", time: 2, fare: 11, distKm: 1.3, line: "Red Line", lineCode: "L1" },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // LINE 2 — YELLOW LINE  (#FFDA00)
    // Samaypur Badli ↔ HUDA City Centre (Gurgaon)   49 km | 37 stations
    // ═══════════════════════════════════════════════════════════════════════════

    "Samaypur Badli": [
        { station: "Rohini Sector 18, 19", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
    ],
    "Rohini Sector 18, 19": [
        { station: "Samaypur Badli", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        { station: "Haiderpur Badli Mor", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
    ],
    "Haiderpur Badli Mor": [
        { station: "Rohini Sector 18, 19", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        { station: "Jahangirpuri", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
    ],
    "Jahangirpuri": [
        { station: "Haiderpur Badli Mor", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        { station: "Adarsh Nagar", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
    ],
    "Adarsh Nagar": [
        { station: "Jahangirpuri", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
        { station: "Azadpur", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
    ],
    "Azadpur": [
        { station: "Adarsh Nagar", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        { station: "Model Town", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        // Interchange → Pink Line
        { station: "Azadpur", time: 5, fare: 0, distKm: 0, line: "Pink Line", lineCode: "L7", interchange: true },
    ],
    "Model Town": [
        { station: "Azadpur", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        { station: "GTB Nagar", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
    ],
    "GTB Nagar": [
        { station: "Model Town", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        { station: "Vishwavidyalaya", time: 2, fare: 11, distKm: 1.0, line: "Yellow Line", lineCode: "L2" },
    ],
    "Vishwavidyalaya": [
        { station: "GTB Nagar", time: 2, fare: 11, distKm: 1.0, line: "Yellow Line", lineCode: "L2" },
        { station: "Vidhan Sabha", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
    ],
    "Vidhan Sabha": [
        { station: "Vishwavidyalaya", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        { station: "Civil Lines", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
    ],
    "Civil Lines": [
        { station: "Vidhan Sabha", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        { station: "Kashmere Gate", time: 2, fare: 11, distKm: 1.0, line: "Yellow Line", lineCode: "L2" },
    ],
    // Kashmere Gate already defined above (Red Line). Add Yellow edges:
    // NOTE: In a real implementation merge into single node.
    "Chandni Chowk": [
        { station: "Kashmere Gate", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
        { station: "Chawri Bazaar", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
    ],
    "Chawri Bazaar": [
        { station: "Chandni Chowk", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        { station: "New Delhi", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
    ],
    "New Delhi": [
        { station: "Chawri Bazaar", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        { station: "Rajiv Chowk", time: 2, fare: 11, distKm: 0.8, line: "Yellow Line", lineCode: "L2" },
        // Interchange → Airport Express Line
        { station: "New Delhi", time: 3, fare: 0, distKm: 0, line: "Airport Express", lineCode: "AEL", interchange: true },
    ],
    "Rajiv Chowk": [
        { station: "New Delhi", time: 2, fare: 11, distKm: 0.8, line: "Yellow Line", lineCode: "L2" },
        { station: "Patel Chowk", time: 2, fare: 11, distKm: 1.0, line: "Yellow Line", lineCode: "L2" },
        // Interchange → Blue Line
        { station: "Rajiv Chowk", time: 5, fare: 0, distKm: 0, line: "Blue Line", lineCode: "L3", interchange: true },
    ],
    "Patel Chowk": [
        { station: "Rajiv Chowk", time: 2, fare: 11, distKm: 1.0, line: "Yellow Line", lineCode: "L2" },
        { station: "Central Secretariat", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
    ],
    "Central Secretariat": [
        { station: "Patel Chowk", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        { station: "Udyog Bhawan", time: 2, fare: 11, distKm: 1.0, line: "Yellow Line", lineCode: "L2" },
        // Interchange → Violet Line
        { station: "Central Secretariat", time: 5, fare: 0, distKm: 0, line: "Violet Line", lineCode: "L6", interchange: true },
    ],
    "Udyog Bhawan": [
        { station: "Central Secretariat", time: 2, fare: 11, distKm: 1.0, line: "Yellow Line", lineCode: "L2" },
        { station: "Lok Kalyan Marg", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
    ],
    "Lok Kalyan Marg": [
        { station: "Udyog Bhawan", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        { station: "Jor Bagh", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
    ],
    "Jor Bagh": [
        { station: "Lok Kalyan Marg", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        { station: "INA", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
    ],
    "INA": [
        { station: "Jor Bagh", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
        { station: "AIIMS", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
    ],
    "AIIMS": [
        { station: "INA", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        { station: "Green Park", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
    ],
    "Green Park": [
        { station: "AIIMS", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        { station: "Hauz Khas", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
    ],
    "Hauz Khas": [
        { station: "Green Park", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
        { station: "Malviya Nagar", time: 2, fare: 11, distKm: 1.4, line: "Yellow Line", lineCode: "L2" },
        // Interchange → Magenta Line
        { station: "Hauz Khas", time: 5, fare: 0, distKm: 0, line: "Magenta Line", lineCode: "L8", interchange: true },
    ],
    "Malviya Nagar": [
        { station: "Hauz Khas", time: 2, fare: 11, distKm: 1.4, line: "Yellow Line", lineCode: "L2" },
        { station: "Saket", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
    ],
    "Saket": [
        { station: "Malviya Nagar", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        { station: "Qutab Minar", time: 2, fare: 11, distKm: 1.5, line: "Yellow Line", lineCode: "L2" },
    ],
    "Qutab Minar": [
        { station: "Saket", time: 2, fare: 11, distKm: 1.5, line: "Yellow Line", lineCode: "L2" },
        { station: "Chhattarpur", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
    ],
    "Chhattarpur": [
        { station: "Qutab Minar", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
        { station: "Sultanpur", time: 2, fare: 11, distKm: 1.4, line: "Yellow Line", lineCode: "L2" },
    ],
    "Sultanpur": [
        { station: "Chhattarpur", time: 2, fare: 11, distKm: 1.4, line: "Yellow Line", lineCode: "L2" },
        { station: "Ghitorni", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
    ],
    "Ghitorni": [
        { station: "Sultanpur", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
        { station: "Arjangarh", time: 2, fare: 11, distKm: 1.5, line: "Yellow Line", lineCode: "L2" },
    ],
    "Arjangarh": [
        { station: "Ghitorni", time: 2, fare: 11, distKm: 1.5, line: "Yellow Line", lineCode: "L2" },
        { station: "Guru Dronacharya", time: 2, fare: 11, distKm: 1.4, line: "Yellow Line", lineCode: "L2" },
    ],
    "Guru Dronacharya": [
        { station: "Arjangarh", time: 2, fare: 11, distKm: 1.4, line: "Yellow Line", lineCode: "L2" },
        { station: "Sikanderpur", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
    ],
    "Sikanderpur": [
        { station: "Guru Dronacharya", time: 2, fare: 11, distKm: 1.2, line: "Yellow Line", lineCode: "L2" },
        { station: "MG Road", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        // Interchange → Rapid Metro Gurgaon
        { station: "Sikanderpur", time: 4, fare: 0, distKm: 0, line: "Rapid Metro Gurgaon", lineCode: "RMG", interchange: true },
    ],
    "MG Road": [
        { station: "Sikanderpur", time: 2, fare: 11, distKm: 1.1, line: "Yellow Line", lineCode: "L2" },
        { station: "IFFCO Chowk", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
    ],
    "IFFCO Chowk": [
        { station: "MG Road", time: 2, fare: 11, distKm: 1.3, line: "Yellow Line", lineCode: "L2" },
        { station: "HUDA City Centre", time: 2, fare: 11, distKm: 1.4, line: "Yellow Line", lineCode: "L2" },
    ],
    "HUDA City Centre": [
        { station: "IFFCO Chowk", time: 2, fare: 11, distKm: 1.4, line: "Yellow Line", lineCode: "L2" },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // LINE 3 — BLUE LINE  (#1565C0)
    // Dwarka Sector 21 ↔ Noida Electronic City / Vaishali   58.2 km | 50 stations
    // ═══════════════════════════════════════════════════════════════════════════

    "Dwarka Sector 21": [
        { station: "Dwarka Sector 8", time: 2, fare: 11, distKm: 1.3, line: "Blue Line", lineCode: "L3" },
        // Interchange → Airport Express Line
        { station: "Dwarka Sector 21", time: 3, fare: 0, distKm: 0, line: "Airport Express", lineCode: "AEL", interchange: true },
    ],
    "Dwarka Sector 8": [
        { station: "Dwarka Sector 21", time: 2, fare: 11, distKm: 1.3, line: "Blue Line", lineCode: "L3" },
        { station: "Dwarka Sector 9", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
    ],
    "Dwarka Sector 9": [
        { station: "Dwarka Sector 8", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
        { station: "Dwarka Sector 10", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
    ],
    "Dwarka Sector 10": [
        { station: "Dwarka Sector 9", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
        { station: "Dwarka Sector 11", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Dwarka Sector 11": [
        { station: "Dwarka Sector 10", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
        { station: "Dwarka Sector 12", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
    ],
    "Dwarka Sector 12": [
        { station: "Dwarka Sector 11", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
        { station: "Dwarka Sector 13", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
    ],
    "Dwarka Sector 13": [
        { station: "Dwarka Sector 12", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
        { station: "Dwarka Sector 14", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Dwarka Sector 14": [
        { station: "Dwarka Sector 13", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
        { station: "Dwarka", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
    ],
    "Dwarka": [
        { station: "Dwarka Sector 14", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        { station: "Dwarka Mor", time: 2, fare: 11, distKm: 1.4, line: "Blue Line", lineCode: "L3" },
        // Interchange → Grey Line
        { station: "Dwarka", time: 4, fare: 0, distKm: 0, line: "Grey Line", lineCode: "L9", interchange: true },
    ],
    "Dwarka Mor": [
        { station: "Dwarka", time: 2, fare: 11, distKm: 1.4, line: "Blue Line", lineCode: "L3" },
        { station: "Nawada", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
    ],
    "Nawada": [
        { station: "Dwarka Mor", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        { station: "Uttam Nagar West", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
    ],
    "Uttam Nagar West": [
        { station: "Nawada", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Uttam Nagar East", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Uttam Nagar East": [
        { station: "Uttam Nagar West", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
        { station: "Janakpuri West", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
    ],
    "Janakpuri West": [
        { station: "Uttam Nagar East", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        { station: "Janakpuri East", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        // Interchange → Magenta Line
        { station: "Janakpuri West", time: 5, fare: 0, distKm: 0, line: "Magenta Line", lineCode: "L8", interchange: true },
    ],
    "Janakpuri East": [
        { station: "Janakpuri West", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Tilak Nagar", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
    ],
    "Tilak Nagar": [
        { station: "Janakpuri East", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        { station: "Subhash Nagar", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
    ],
    "Subhash Nagar": [
        { station: "Tilak Nagar", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Tagore Garden", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Tagore Garden": [
        { station: "Subhash Nagar", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
        { station: "Rajouri Garden", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
    ],
    "Rajouri Garden": [
        { station: "Tagore Garden", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Ramesh Nagar", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        // Interchange → Pink Line
        { station: "Rajouri Garden", time: 5, fare: 0, distKm: 0, line: "Pink Line", lineCode: "L7", interchange: true },
    ],
    "Ramesh Nagar": [
        { station: "Rajouri Garden", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        { station: "Moti Nagar", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Moti Nagar": [
        { station: "Ramesh Nagar", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
        { station: "Kirti Nagar", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
    ],
    "Kirti Nagar": [
        { station: "Moti Nagar", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Shadipur", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        // Interchange → Green Line
        { station: "Kirti Nagar", time: 5, fare: 0, distKm: 0, line: "Green Line", lineCode: "L5", interchange: true },
    ],
    "Shadipur": [
        { station: "Kirti Nagar", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        { station: "Patel Nagar", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Patel Nagar": [
        { station: "Shadipur", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
        { station: "Rajendra Place", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
    ],
    "Rajendra Place": [
        { station: "Patel Nagar", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Karol Bagh", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Karol Bagh": [
        { station: "Rajendra Place", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
        { station: "Jhandewalan", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
    ],
    "Jhandewalan": [
        { station: "Karol Bagh", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Ramakrishna Ashram Marg", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Ramakrishna Ashram Marg": [
        { station: "Jhandewalan", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
        { station: "Rajiv Chowk", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
    ],
    // Rajiv Chowk interchange already listed in Yellow Line section.
    // Blue Line continues from Rajiv Chowk eastward:
    "Barakhamba Road": [
        { station: "Rajiv Chowk", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
        { station: "Mandi House", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
    ],
    "Mandi House": [
        { station: "Barakhamba Road", time: 2, fare: 11, distKm: 0.9, line: "Blue Line", lineCode: "L3" },
        { station: "Pragati Maidan", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        // Interchange → Violet Line
        { station: "Mandi House", time: 5, fare: 0, distKm: 0, line: "Violet Line", lineCode: "L6", interchange: true },
    ],
    "Pragati Maidan": [
        { station: "Mandi House", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Indraprastha", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
    ],
    "Indraprastha": [
        { station: "Pragati Maidan", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        { station: "Yamuna Bank", time: 2, fare: 11, distKm: 1.6, line: "Blue Line", lineCode: "L3" },
    ],
    "Yamuna Bank": [
        { station: "Indraprastha", time: 2, fare: 11, distKm: 1.6, line: "Blue Line", lineCode: "L3" },
        { station: "Laxmi Nagar", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        // Branch to Anand Vihar / Vaishali
        { station: "Akshardham", time: 2, fare: 11, distKm: 1.5, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Laxmi Nagar": [
        { station: "Yamuna Bank", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        { station: "Nirman Vihar", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
    ],
    "Nirman Vihar": [
        { station: "Laxmi Nagar", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Preet Vihar", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Preet Vihar": [
        { station: "Nirman Vihar", time: 2, fare: 11, distKm: 1.0, line: "Blue Line", lineCode: "L3" },
        { station: "Karkardooma", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
    ],
    "Karkardooma": [
        { station: "Preet Vihar", time: 2, fare: 11, distKm: 1.1, line: "Blue Line", lineCode: "L3" },
        { station: "Anand Vihar ISBT", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
    ],
    "Anand Vihar ISBT": [
        { station: "Karkardooma", time: 2, fare: 11, distKm: 1.2, line: "Blue Line", lineCode: "L3" },
        { station: "Kaushambi", time: 3, fare: 21, distKm: 2.5, line: "Blue Line", lineCode: "L3" },
    ],
    "Kaushambi": [
        { station: "Anand Vihar ISBT", time: 3, fare: 21, distKm: 2.5, line: "Blue Line", lineCode: "L3" },
        { station: "Vaishali", time: 3, fare: 11, distKm: 2.0, line: "Blue Line", lineCode: "L3" },
    ],
    "Vaishali": [
        { station: "Kaushambi", time: 3, fare: 11, distKm: 2.0, line: "Blue Line", lineCode: "L3" },
    ],

    // Blue Line Branch (Yamuna Bank → Noida Electronic City)
    "Akshardham": [
        { station: "Yamuna Bank", time: 2, fare: 11, distKm: 1.5, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Mayur Vihar Phase-1", time: 2, fare: 11, distKm: 1.4, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Mayur Vihar Phase-1": [
        { station: "Akshardham", time: 2, fare: 11, distKm: 1.4, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Mayur Vihar Extension", time: 2, fare: 11, distKm: 1.2, line: "Blue Line Branch", lineCode: "L3B" },
        // Interchange → Pink Line
        { station: "Mayur Vihar Phase-1", time: 5, fare: 0, distKm: 0, line: "Pink Line", lineCode: "L7", interchange: true },
    ],
    "Mayur Vihar Extension": [
        { station: "Mayur Vihar Phase-1", time: 2, fare: 11, distKm: 1.2, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "New Ashok Nagar", time: 2, fare: 11, distKm: 1.4, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "New Ashok Nagar": [
        { station: "Mayur Vihar Extension", time: 2, fare: 11, distKm: 1.4, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida Sector 15", time: 3, fare: 21, distKm: 2.0, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida Sector 15": [
        { station: "New Ashok Nagar", time: 3, fare: 21, distKm: 2.0, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida Sector 16", time: 2, fare: 11, distKm: 1.1, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida Sector 16": [
        { station: "Noida Sector 15", time: 2, fare: 11, distKm: 1.1, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida Sector 18", time: 2, fare: 11, distKm: 1.3, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida Sector 18": [
        { station: "Noida Sector 16", time: 2, fare: 11, distKm: 1.3, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Botanical Garden", time: 2, fare: 11, distKm: 1.2, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Botanical Garden": [
        { station: "Noida Sector 18", time: 2, fare: 11, distKm: 1.2, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Golf Course", time: 2, fare: 11, distKm: 1.3, line: "Blue Line Branch", lineCode: "L3B" },
        // Interchange → Magenta Line
        { station: "Botanical Garden", time: 5, fare: 0, distKm: 0, line: "Magenta Line", lineCode: "L8", interchange: true },
    ],
    "Golf Course": [
        { station: "Botanical Garden", time: 2, fare: 11, distKm: 1.3, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida City Centre", time: 2, fare: 11, distKm: 1.4, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida City Centre": [
        { station: "Golf Course", time: 2, fare: 11, distKm: 1.4, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida Sector 34", time: 2, fare: 11, distKm: 1.5, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida Sector 34": [
        { station: "Noida City Centre", time: 2, fare: 11, distKm: 1.5, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida Sector 52", time: 2, fare: 11, distKm: 1.3, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida Sector 52": [
        { station: "Noida Sector 34", time: 2, fare: 11, distKm: 1.3, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida Sector 61", time: 2, fare: 11, distKm: 1.4, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida Sector 61": [
        { station: "Noida Sector 52", time: 2, fare: 11, distKm: 1.4, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida Sector 59", time: 2, fare: 11, distKm: 1.2, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida Sector 59": [
        { station: "Noida Sector 61", time: 2, fare: 11, distKm: 1.2, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida Sector 62", time: 2, fare: 11, distKm: 1.1, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida Sector 62": [
        { station: "Noida Sector 59", time: 2, fare: 11, distKm: 1.1, line: "Blue Line Branch", lineCode: "L3B" },
        { station: "Noida Electronic City", time: 3, fare: 21, distKm: 2.2, line: "Blue Line Branch", lineCode: "L3B" },
    ],
    "Noida Electronic City": [
        { station: "Noida Sector 62", time: 3, fare: 21, distKm: 2.2, line: "Blue Line Branch", lineCode: "L3B" },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // LINE 5 — GREEN LINE  (#2E7D32)
    // Inderlok ↔ Brigadier Hoshiyar Singh (Bahadurgarh) + branch to Kirti Nagar
    // 28.79 km | 24 stations
    // ═══════════════════════════════════════════════════════════════════════════

    "Ashok Park Main": [
        { station: "Inderlok", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
        { station: "Satguru Ram Singh Marg", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
        // Branch to Kirti Nagar
        { station: "Kirti Nagar", time: 3, fare: 11, distKm: 1.5, line: "Green Line", lineCode: "L5" },
    ],
    "Satguru Ram Singh Marg": [
        { station: "Ashok Park Main", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
        { station: "Punjabi Bagh West", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
    ],
    "Punjabi Bagh West": [
        { station: "Satguru Ram Singh Marg", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
        { station: "ESI Hospital", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
    ],
    "ESI Hospital": [
        { station: "Punjabi Bagh West", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
        { station: "Peeragarhi", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
    ],
    "Peeragarhi": [
        { station: "ESI Hospital", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
        { station: "Paschim Vihar East", time: 2, fare: 11, distKm: 1.3, line: "Green Line", lineCode: "L5" },
    ],
    "Paschim Vihar East": [
        { station: "Peeragarhi", time: 2, fare: 11, distKm: 1.3, line: "Green Line", lineCode: "L5" },
        { station: "Paschim Vihar West", time: 2, fare: 11, distKm: 0.9, line: "Green Line", lineCode: "L5" },
    ],
    "Paschim Vihar West": [
        { station: "Paschim Vihar East", time: 2, fare: 11, distKm: 0.9, line: "Green Line", lineCode: "L5" },
        { station: "Madipur", time: 2, fare: 11, distKm: 1.0, line: "Green Line", lineCode: "L5" },
    ],
    "Madipur": [
        { station: "Paschim Vihar West", time: 2, fare: 11, distKm: 1.0, line: "Green Line", lineCode: "L5" },
        { station: "Shivaji Park", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
    ],
    "Shivaji Park": [
        { station: "Madipur", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
        { station: "Nangloi", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
    ],
    "Nangloi": [
        { station: "Shivaji Park", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
        { station: "Nangloi Railway Station", time: 2, fare: 11, distKm: 1.0, line: "Green Line", lineCode: "L5" },
    ],
    "Nangloi Railway Station": [
        { station: "Nangloi", time: 2, fare: 11, distKm: 1.0, line: "Green Line", lineCode: "L5" },
        { station: "Rajdhani Park", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
    ],
    "Rajdhani Park": [
        { station: "Nangloi Railway Station", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
        { station: "Mundka", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
    ],
    "Mundka": [
        { station: "Rajdhani Park", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
        { station: "Mundka Industrial Area", time: 2, fare: 11, distKm: 1.3, line: "Green Line", lineCode: "L5" },
    ],
    "Mundka Industrial Area": [
        { station: "Mundka", time: 2, fare: 11, distKm: 1.3, line: "Green Line", lineCode: "L5" },
        { station: "Ghevra", time: 3, fare: 21, distKm: 2.0, line: "Green Line", lineCode: "L5" },
    ],
    "Ghevra": [
        { station: "Mundka Industrial Area", time: 3, fare: 21, distKm: 2.0, line: "Green Line", lineCode: "L5" },
        { station: "Tikri Kalan", time: 2, fare: 11, distKm: 1.4, line: "Green Line", lineCode: "L5" },
    ],
    "Tikri Kalan": [
        { station: "Ghevra", time: 2, fare: 11, distKm: 1.4, line: "Green Line", lineCode: "L5" },
        { station: "Tikri Border", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
    ],
    "Tikri Border": [
        { station: "Tikri Kalan", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
        { station: "Pandit Shree Ram Sharma", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
    ],
    "Pandit Shree Ram Sharma": [
        { station: "Tikri Border", time: 2, fare: 11, distKm: 1.1, line: "Green Line", lineCode: "L5" },
        { station: "Bahadurgarh City Park", time: 2, fare: 11, distKm: 1.3, line: "Green Line", lineCode: "L5" },
    ],
    "Bahadurgarh City Park": [
        { station: "Pandit Shree Ram Sharma", time: 2, fare: 11, distKm: 1.3, line: "Green Line", lineCode: "L5" },
        { station: "Brigadier Hoshiyar Singh", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
    ],
    "Brigadier Hoshiyar Singh": [
        { station: "Bahadurgarh City Park", time: 2, fare: 11, distKm: 1.2, line: "Green Line", lineCode: "L5" },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // LINE 6 — VIOLET LINE  (#7B1FA2)
    // Kashmere Gate ↔ Raja Nahar Singh (Ballabhgarh)  46.34 km | 34 stations
    // ═══════════════════════════════════════════════════════════════════════════

    "Lal Quila": [
        { station: "Kashmere Gate", time: 2, fare: 11, distKm: 1.4, line: "Violet Line", lineCode: "L6" },
        { station: "Jama Masjid", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
    ],
    "Jama Masjid": [
        { station: "Lal Quila", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Delhi Gate", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
    ],
    "Delhi Gate": [
        { station: "Jama Masjid", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
        { station: "ITO", time: 2, fare: 11, distKm: 1.0, line: "Violet Line", lineCode: "L6" },
    ],
    "ITO": [
        { station: "Delhi Gate", time: 2, fare: 11, distKm: 1.0, line: "Violet Line", lineCode: "L6" },
        { station: "Mandi House", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
    ],
    // Central Secretariat onwards (Violet Line southward)
    "Khan Market": [
        { station: "Central Secretariat", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Jawaharlal Nehru Stadium", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
    ],
    "Jawaharlal Nehru Stadium": [
        { station: "Khan Market", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
        { station: "Jangpura", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
    ],
    "Jangpura": [
        { station: "Jawaharlal Nehru Stadium", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Lajpat Nagar", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
    ],
    "Lajpat Nagar": [
        { station: "Jangpura", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
        { station: "Moolchand", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        // Interchange → Pink Line
        { station: "Lajpat Nagar", time: 5, fare: 0, distKm: 0, line: "Pink Line", lineCode: "L7", interchange: true },
    ],
    "Moolchand": [
        { station: "Lajpat Nagar", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Kailash Colony", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
    ],
    "Kailash Colony": [
        { station: "Moolchand", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
        { station: "Nehru Place", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
    ],
    "Nehru Place": [
        { station: "Kailash Colony", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
        { station: "Kalkaji Mandir", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
    ],
    "Kalkaji Mandir": [
        { station: "Nehru Place", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Govind Puri", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
        // Interchange → Magenta Line
        { station: "Kalkaji Mandir", time: 5, fare: 0, distKm: 0, line: "Magenta Line", lineCode: "L8", interchange: true },
    ],
    "Govind Puri": [
        { station: "Kalkaji Mandir", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
        { station: "Okhla", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
    ],
    "Okhla": [
        { station: "Govind Puri", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
        { station: "Jasola Apollo", time: 2, fare: 11, distKm: 1.4, line: "Violet Line", lineCode: "L6" },
    ],
    "Jasola Apollo": [
        { station: "Okhla", time: 2, fare: 11, distKm: 1.4, line: "Violet Line", lineCode: "L6" },
        { station: "Sarita Vihar", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
    ],
    "Sarita Vihar": [
        { station: "Jasola Apollo", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Mohan Estate", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
    ],
    "Mohan Estate": [
        { station: "Sarita Vihar", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
        { station: "Tughlakabad", time: 2, fare: 11, distKm: 1.4, line: "Violet Line", lineCode: "L6" },
    ],
    "Tughlakabad": [
        { station: "Mohan Estate", time: 2, fare: 11, distKm: 1.4, line: "Violet Line", lineCode: "L6" },
        { station: "Badarpur Border", time: 2, fare: 11, distKm: 1.5, line: "Violet Line", lineCode: "L6" },
    ],
    "Badarpur Border": [
        { station: "Tughlakabad", time: 2, fare: 11, distKm: 1.5, line: "Violet Line", lineCode: "L6" },
        { station: "Sarai", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
    ],
    "Sarai": [
        { station: "Badarpur Border", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
        { station: "NHPC Chowk", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
    ],
    "NHPC Chowk": [
        { station: "Sarai", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Mewala Maharajpur", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
    ],
    "Mewala Maharajpur": [
        { station: "NHPC Chowk", time: 2, fare: 11, distKm: 1.1, line: "Violet Line", lineCode: "L6" },
        { station: "Sector 28", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
    ],
    "Sector 28": [
        { station: "Mewala Maharajpur", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Badkal Mor", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
    ],
    "Badkal Mor": [
        { station: "Sector 28", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
        { station: "Old Faridabad", time: 2, fare: 11, distKm: 1.4, line: "Violet Line", lineCode: "L6" },
    ],
    "Old Faridabad": [
        { station: "Badkal Mor", time: 2, fare: 11, distKm: 1.4, line: "Violet Line", lineCode: "L6" },
        { station: "Neelam Chowk Ajronda", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
    ],
    "Neelam Chowk Ajronda": [
        { station: "Old Faridabad", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Bata Chowk", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
    ],
    "Bata Chowk": [
        { station: "Neelam Chowk Ajronda", time: 2, fare: 11, distKm: 1.3, line: "Violet Line", lineCode: "L6" },
        { station: "Escorts Mujesar", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
    ],
    "Escorts Mujesar": [
        { station: "Bata Chowk", time: 2, fare: 11, distKm: 1.2, line: "Violet Line", lineCode: "L6" },
        { station: "Sant Surdas (Sihi)", time: 3, fare: 21, distKm: 2.1, line: "Violet Line", lineCode: "L6" },
    ],
    "Sant Surdas (Sihi)": [
        { station: "Escorts Mujesar", time: 3, fare: 21, distKm: 2.1, line: "Violet Line", lineCode: "L6" },
        { station: "Raja Nahar Singh (Ballabhgarh)", time: 3, fare: 21, distKm: 2.0, line: "Violet Line", lineCode: "L6" },
    ],
    "Raja Nahar Singh (Ballabhgarh)": [
        { station: "Sant Surdas (Sihi)", time: 3, fare: 21, distKm: 2.0, line: "Violet Line", lineCode: "L6" },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // LINE 7 — PINK LINE  (#E91E8C)
    // Majlis Park ↔ Shiv Vihar (main) + Maujpur–Babarpur branch  73.49 km | 46 stations
    // (Partial key stations listed — full network too large for one file)
    // ═══════════════════════════════════════════════════════════════════════════

    "Majlis Park": [
        { station: "Azadpur", time: 3, fare: 21, distKm: 2.1, line: "Pink Line", lineCode: "L7" },
    ],
    "South Campus": [
        { station: "Durgabai Deshmukh South Campus", time: 0, fare: 0, distKm: 0, line: "Pink Line", lineCode: "L7", note: "aka Durgabai Deshmukh South Campus" },
    ],
    "Durgabai Deshmukh South Campus": [
        { station: "Hauz Khas", time: 3, fare: 21, distKm: 2.0, line: "Pink Line", lineCode: "L7" },
        { station: "Sir Vishweshwaraiah Moti Bagh", time: 2, fare: 11, distKm: 1.3, line: "Pink Line", lineCode: "L7" },
        // Interchange → Yellow Line
        { station: "Durgabai Deshmukh South Campus", time: 5, fare: 0, distKm: 0, line: "Yellow Line", lineCode: "L2", interchange: true },
    ],
    "Sir Vishweshwaraiah Moti Bagh": [
        { station: "Durgabai Deshmukh South Campus", time: 2, fare: 11, distKm: 1.3, line: "Pink Line", lineCode: "L7" },
        { station: "Bhikaji Cama Place", time: 2, fare: 11, distKm: 1.2, line: "Pink Line", lineCode: "L7" },
    ],
    "Bhikaji Cama Place": [
        { station: "Sir Vishweshwaraiah Moti Bagh", time: 2, fare: 11, distKm: 1.2, line: "Pink Line", lineCode: "L7" },
        { station: "Sarojini Nagar", time: 2, fare: 11, distKm: 1.1, line: "Pink Line", lineCode: "L7" },
    ],
    "Sarojini Nagar": [
        { station: "Bhikaji Cama Place", time: 2, fare: 11, distKm: 1.1, line: "Pink Line", lineCode: "L7" },
        { station: "INA", time: 2, fare: 11, distKm: 1.2, line: "Pink Line", lineCode: "L7" },
    ],
    "South Extension": [
        { station: "Lajpat Nagar", time: 2, fare: 11, distKm: 1.2, line: "Pink Line", lineCode: "L7" },
        { station: "Greater Kailash", time: 2, fare: 11, distKm: 1.3, line: "Pink Line", lineCode: "L7" },
    ],
    "Greater Kailash": [
        { station: "South Extension", time: 2, fare: 11, distKm: 1.3, line: "Pink Line", lineCode: "L7" },
        { station: "Chirag Delhi", time: 2, fare: 11, distKm: 1.2, line: "Pink Line", lineCode: "L7" },
    ],
    "Chirag Delhi": [
        { station: "Greater Kailash", time: 2, fare: 11, distKm: 1.2, line: "Pink Line", lineCode: "L7" },
        { station: "Panchsheel Park", time: 2, fare: 11, distKm: 1.1, line: "Pink Line", lineCode: "L7" },
    ],
    "Panchsheel Park": [
        { station: "Chirag Delhi", time: 2, fare: 11, distKm: 1.1, line: "Pink Line", lineCode: "L7" },
        { station: "Hauz Khas", time: 2, fare: 11, distKm: 1.3, line: "Pink Line", lineCode: "L7" },
    ],
    "Shiv Vihar": [
        { station: "Johri Enclave", time: 2, fare: 11, distKm: 1.2, line: "Pink Line", lineCode: "L7" },
    ],
    "Johri Enclave": [
        { station: "Shiv Vihar", time: 2, fare: 11, distKm: 1.2, line: "Pink Line", lineCode: "L7" },
        { station: "Gokulpuri", time: 2, fare: 11, distKm: 1.3, line: "Pink Line", lineCode: "L7" },
    ],
    "Gokulpuri": [
        { station: "Johri Enclave", time: 2, fare: 11, distKm: 1.3, line: "Pink Line", lineCode: "L7" },
        { station: "Maujpur - Babarpur", time: 2, fare: 11, distKm: 1.1, line: "Pink Line", lineCode: "L7" },
    ],
    "Maujpur - Babarpur": [
        { station: "Gokulpuri", time: 2, fare: 11, distKm: 1.1, line: "Pink Line", lineCode: "L7" },
        { station: "Jafrabad", time: 2, fare: 11, distKm: 1.0, line: "Pink Line", lineCode: "L7" },
    ],
    "Jafrabad": [
        { station: "Maujpur - Babarpur", time: 2, fare: 11, distKm: 1.0, line: "Pink Line", lineCode: "L7" },
        { station: "Welcome", time: 2, fare: 11, distKm: 1.2, line: "Pink Line", lineCode: "L7" },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // LINE 8 — MAGENTA LINE  (#C2185B)
    // Janakpuri West ↔ Botanical Garden  37.6 km | 25 stations
    // ═══════════════════════════════════════════════════════════════════════════

    "Dabri Mor - Janakpuri South": [
        { station: "Janakpuri West", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
        { station: "Dashrath Puri", time: 2, fare: 11, distKm: 1.1, line: "Magenta Line", lineCode: "L8" },
    ],
    "Dashrath Puri": [
        { station: "Dabri Mor - Janakpuri South", time: 2, fare: 11, distKm: 1.1, line: "Magenta Line", lineCode: "L8" },
        { station: "Palam", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
    ],
    "Palam": [
        { station: "Dashrath Puri", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
        { station: "Sadar Bazaar Cantonment", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
    ],
    "Sadar Bazaar Cantonment": [
        { station: "Palam", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
        { station: "Terminal 1 IGI Airport", time: 2, fare: 11, distKm: 1.4, line: "Magenta Line", lineCode: "L8" },
    ],
    "Terminal 1 IGI Airport": [
        { station: "Sadar Bazaar Cantonment", time: 2, fare: 11, distKm: 1.4, line: "Magenta Line", lineCode: "L8" },
        { station: "Shankar Vihar", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
    ],
    "Shankar Vihar": [
        { station: "Terminal 1 IGI Airport", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
        { station: "Vasant Vihar", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
    ],
    "Vasant Vihar": [
        { station: "Shankar Vihar", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
        { station: "Munirka", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
    ],
    "Munirka": [
        { station: "Vasant Vihar", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
        { station: "RK Puram", time: 2, fare: 11, distKm: 1.1, line: "Magenta Line", lineCode: "L8" },
    ],
    "RK Puram": [
        { station: "Munirka", time: 2, fare: 11, distKm: 1.1, line: "Magenta Line", lineCode: "L8" },
        { station: "IIT Delhi", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
    ],
    "IIT Delhi": [
        { station: "RK Puram", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
        { station: "Hauz Khas", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
    ],
    "Panchsheel Park (Magenta)": [
        { station: "Hauz Khas", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
        { station: "Chirag Delhi", time: 2, fare: 11, distKm: 1.1, line: "Magenta Line", lineCode: "L8" },
    ],
    "Saket G Block": [
        { station: "Chirag Delhi", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
        { station: "Malviya Nagar (Magenta)", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
    ],
    "Malviya Nagar (Magenta)": [
        { station: "Saket G Block", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
        { station: "Kalkaji Mandir", time: 2, fare: 11, distKm: 1.1, line: "Magenta Line", lineCode: "L8" },
    ],
    "Okhla NSIC": [
        { station: "Kalkaji Mandir", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
        { station: "Sukhdev Vihar", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
    ],
    "Sukhdev Vihar": [
        { station: "Okhla NSIC", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
        { station: "Jamia Millia Islamia", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
    ],
    "Jamia Millia Islamia": [
        { station: "Sukhdev Vihar", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
        { station: "Okhla Vihar", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
    ],
    "Okhla Vihar": [
        { station: "Jamia Millia Islamia", time: 2, fare: 11, distKm: 1.2, line: "Magenta Line", lineCode: "L8" },
        { station: "Jasola Vihar Shaheen Bagh", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
    ],
    "Jasola Vihar Shaheen Bagh": [
        { station: "Okhla Vihar", time: 2, fare: 11, distKm: 1.3, line: "Magenta Line", lineCode: "L8" },
        { station: "Kalindi Kunj", time: 2, fare: 11, distKm: 1.4, line: "Magenta Line", lineCode: "L8" },
    ],
    "Kalindi Kunj": [
        { station: "Jasola Vihar Shaheen Bagh", time: 2, fare: 11, distKm: 1.4, line: "Magenta Line", lineCode: "L8" },
        { station: "Okhla Bird Sanctuary", time: 2, fare: 11, distKm: 1.5, line: "Magenta Line", lineCode: "L8" },
    ],
    "Okhla Bird Sanctuary": [
        { station: "Kalindi Kunj", time: 2, fare: 11, distKm: 1.5, line: "Magenta Line", lineCode: "L8" },
        { station: "Botanical Garden", time: 3, fare: 21, distKm: 2.0, line: "Magenta Line", lineCode: "L8" },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // LINE 9 — GREY LINE  (#757575)
    // Dwarka ↔ Dhansa Bus Stand   5.19 km | 4 stations
    // ═══════════════════════════════════════════════════════════════════════════

    "Nangli": [
        { station: "Dwarka", time: 3, fare: 11, distKm: 1.5, line: "Grey Line", lineCode: "L9" },
        { station: "Najafgarh", time: 3, fare: 11, distKm: 1.8, line: "Grey Line", lineCode: "L9" },
    ],
    "Najafgarh": [
        { station: "Nangli", time: 3, fare: 11, distKm: 1.8, line: "Grey Line", lineCode: "L9" },
        { station: "Dhansa Bus Stand", time: 3, fare: 11, distKm: 1.9, line: "Grey Line", lineCode: "L9" },
    ],
    "Dhansa Bus Stand": [
        { station: "Najafgarh", time: 3, fare: 11, distKm: 1.9, line: "Grey Line", lineCode: "L9" },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // AIRPORT EXPRESS LINE (Orange Line)  (#FF6F00)
    // New Delhi ↔ Dwarka Sector 21   22.7 km | 6 stations
    // SEPARATE fare structure — flat slabs per DMRC AEL tariff (Aug 2025):
    //   New Delhi ↔ Shivaji Stadium: ₹60
    //   New Delhi ↔ Dhaula Kuan:     ₹70
    //   New Delhi ↔ IGI Airport (T3):₹100
    //   New Delhi ↔ Aerocity:        ₹100
    //   New Delhi ↔ Dwarka Sec 21:   ₹110
    //   Smart Card: 10% off
    //   No interchange discount — always new fare from New Delhi base
    // ═══════════════════════════════════════════════════════════════════════════

    "Shivaji Stadium (AEL)": [
        { station: "New Delhi", time: 4, fare: 60, distKm: 2.0, line: "Airport Express", lineCode: "AEL" },
        { station: "Dhaula Kuan (AEL)", time: 4, fare: 10, distKm: 2.5, line: "Airport Express", lineCode: "AEL", note: "Incremental ₹10 from Shivaji Stadium" },
    ],
    "Dhaula Kuan (AEL)": [
        { station: "Shivaji Stadium (AEL)", time: 4, fare: 10, distKm: 2.5, line: "Airport Express", lineCode: "AEL" },
        { station: "IGI Airport T3", time: 7, fare: 30, distKm: 6.0, line: "Airport Express", lineCode: "AEL" },
    ],
    "IGI Airport T3": [
        { station: "Dhaula Kuan (AEL)", time: 7, fare: 30, distKm: 6.0, line: "Airport Express", lineCode: "AEL" },
        { station: "Aerocity", time: 3, fare: 0, distKm: 1.5, line: "Airport Express", lineCode: "AEL", note: "Same AEL slab ₹100 from New Delhi" },
    ],
    "Aerocity": [
        { station: "IGI Airport T3", time: 3, fare: 0, distKm: 1.5, line: "Airport Express", lineCode: "AEL" },
        { station: "Dwarka Sector 21", time: 8, fare: 10, distKm: 5.5, line: "Airport Express", lineCode: "AEL" },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // RAPID METRO GURGAON  (#1976D2)
    // Sikanderpur ↔ Sector 56  11.7 km | 11 stations
    // Flat fare ₹20 for ANY journey on RMG regardless of distance/stops
    // ═══════════════════════════════════════════════════════════════════════════

    "Sec 42-43": [
        { station: "Sikanderpur", time: 3, fare: 20, distKm: 2.1, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
        { station: "Sec 53-54", time: 3, fare: 20, distKm: 1.8, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
    "Sec 53-54": [
        { station: "Sec 42-43", time: 3, fare: 20, distKm: 1.8, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
        { station: "Sec 54 Chowk", time: 2, fare: 20, distKm: 1.2, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
    "Sec 54 Chowk": [
        { station: "Sec 53-54", time: 2, fare: 20, distKm: 1.2, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
        { station: "Sec 55-56", time: 2, fare: 20, distKm: 1.1, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
    "Sec 55-56": [
        { station: "Sec 54 Chowk", time: 2, fare: 20, distKm: 1.1, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
        { station: "Belvedere Towers", time: 2, fare: 20, distKm: 1.0, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
    "Belvedere Towers": [
        { station: "Sec 55-56", time: 2, fare: 20, distKm: 1.0, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
        { station: "Cyber City", time: 2, fare: 20, distKm: 1.1, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
    "Cyber City": [
        { station: "Belvedere Towers", time: 2, fare: 20, distKm: 1.1, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
        { station: "Phase 3", time: 2, fare: 20, distKm: 1.2, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
    "Phase 3": [
        { station: "Cyber City", time: 2, fare: 20, distKm: 1.2, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
        { station: "Moulsari Avenue", time: 2, fare: 20, distKm: 1.0, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
    "Moulsari Avenue": [
        { station: "Phase 3", time: 2, fare: 20, distKm: 1.0, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
        { station: "Phase 2", time: 2, fare: 20, distKm: 1.1, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
    "Phase 2": [
        { station: "Moulsari Avenue", time: 2, fare: 20, distKm: 1.1, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
        { station: "Phase 1", time: 2, fare: 20, distKm: 1.2, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
    "Phase 1": [
        { station: "Phase 2", time: 2, fare: 20, distKm: 1.2, line: "Rapid Metro Gurgaon", lineCode: "RMG" },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

// Node.js / CommonJS
if (typeof module !== "undefined" && module.exports) {
    module.exports = { graph, LINE_META, INTERCHANGE_STATIONS, getFare, getSmartCardFare };
}

// ES Module (uncomment if using ESM):
// export { graph, LINE_META, INTERCHANGE_STATIONS, getFare, getSmartCardFare };

// ─────────────────────────────────────────────────────────────────────────────
// QUICK DEMO — run with: node dmrc_graph.js
// ─────────────────────────────────────────────────────────────────────────────

if (typeof require !== "undefined" && require.main === module) {
    console.log("=== DMRC Graph Demo ===\n");

    // Example 1: Rajiv Chowk neighbours
    console.log("Rajiv Chowk adjacency:");
    console.log(graph["Rajiv Chowk"]);

    // Example 2: Fare from New Delhi → Dwarka Sector 21 (AEL)
    console.log("\nAirport Express: New Delhi → Dwarka Sector 21 fare = ₹110");
    console.log("  (flat AEL slab, smart card = ₹99)");

    // Example 3: getFare utility
    console.log("\nFare slabs:");
    [1, 3, 8, 15, 25, 35].forEach(km => {
        console.log(`  ${km} km → Token: ₹${getFare(km)}  Smart Card: ₹${getSmartCardFare(km)}`);
    });

    console.log(`\nTotal lines in LINE_META: ${Object.keys(LINE_META).length}`);
    console.log(`Total stations in graph:  ${Object.keys(graph).length}`);
    console.log(`Total interchange nodes:  ${Object.keys(INTERCHANGE_STATIONS).length}`);
}
