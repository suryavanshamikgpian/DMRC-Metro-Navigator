// ─────────────────────────────────────────────────────────────────
// dmrc_data.cpp — Full DMRC network: 223 stations, 11 lines
// ─────────────────────────────────────────────────────────────────
// FARE SLAB (Token, DMRC official rates — Aug 2025):
//   0–2 km   → ₹11    2–5 km   → ₹21
//   5–12 km  → ₹32    12–21 km → ₹43
//   21–32 km → ₹54    >32 km   → ₹64
//
// LINE CODES:
//   L1  Red Line          L2  Yellow Line      L3  Blue Line
//   L3B Blue Line Branch  L5  Green Line       L6  Violet Line
//   L7  Pink Line         L8  Magenta Line     L9  Grey Line
//   AEL Airport Express   RMG Rapid Metro Gurgaon
// ─────────────────────────────────────────────────────────────────

#include "dmrc_data.h"

AdjList buildGraph() {
    AdjList g;

    // ─── Helper lambda to add an edge ─────────────────────────────
    auto add = [&](const std::string& from, Edge e) {
        g[from].push_back(std::move(e));
    };

    // ═══════════════════════════════════════════════════════════════
    // LINE 1 — RED LINE
    // Rithala ↔ Shaheed Sthal (New Bus Adda)   29 stations
    // ═══════════════════════════════════════════════════════════════
    add("Rithala",             {"Rohini West",           2, 11, 1.2, "Red Line", "L1", false});
    add("Rohini West",         {"Rithala",               2, 11, 1.2, "Red Line", "L1", false});
    add("Rohini West",         {"Rohini East",           2, 11, 1.1, "Red Line", "L1", false});
    add("Rohini East",         {"Rohini West",           2, 11, 1.1, "Red Line", "L1", false});
    add("Rohini East",         {"Madhuban Chowk",        2, 11, 1.3, "Red Line", "L1", false});
    add("Madhuban Chowk",      {"Rohini East",           2, 11, 1.3, "Red Line", "L1", false});
    add("Madhuban Chowk",      {"Kohat Enclave",         2, 11, 1.2, "Red Line", "L1", false});
    add("Kohat Enclave",       {"Madhuban Chowk",        2, 11, 1.2, "Red Line", "L1", false});
    add("Kohat Enclave",       {"Netaji Subhash Place",  2, 11, 1.1, "Red Line", "L1", false});
    add("Netaji Subhash Place",{"Kohat Enclave",         2, 11, 1.1, "Red Line", "L1", false});
    add("Netaji Subhash Place",{"Keshav Puram",          2, 11, 1.2, "Red Line", "L1", false});
    add("Netaji Subhash Place",{"Netaji Subhash Place",  5,  0, 0.0, "Pink Line","L7", true});  // interchange
    add("Keshav Puram",        {"Netaji Subhash Place",  2, 11, 1.2, "Red Line", "L1", false});
    add("Keshav Puram",        {"Kanhaiya Nagar",        2, 11, 1.3, "Red Line", "L1", false});
    add("Kanhaiya Nagar",      {"Keshav Puram",          2, 11, 1.3, "Red Line", "L1", false});
    add("Kanhaiya Nagar",      {"Inderlok",              2, 11, 1.1, "Red Line", "L1", false});
    add("Inderlok",            {"Kanhaiya Nagar",        2, 11, 1.1, "Red Line", "L1", false});
    add("Inderlok",            {"Shastri Nagar",         2, 11, 1.0, "Red Line", "L1", false});
    add("Inderlok",            {"Inderlok",              4,  0, 0.0, "Green Line","L5", true}); // interchange
    add("Shastri Nagar",       {"Inderlok",              2, 11, 1.0, "Red Line", "L1", false});
    add("Shastri Nagar",       {"Pratap Nagar",          2, 11, 1.2, "Red Line", "L1", false});
    add("Pratap Nagar",        {"Shastri Nagar",         2, 11, 1.2, "Red Line", "L1", false});
    add("Pratap Nagar",        {"Pul Bangash",           2, 11, 1.1, "Red Line", "L1", false});
    add("Pul Bangash",         {"Pratap Nagar",          2, 11, 1.1, "Red Line", "L1", false});
    add("Pul Bangash",         {"Tis Hazari",            2, 11, 1.0, "Red Line", "L1", false});
    add("Tis Hazari",          {"Pul Bangash",           2, 11, 1.0, "Red Line", "L1", false});
    add("Tis Hazari",          {"Kashmere Gate",         2, 11, 1.3, "Red Line", "L1", false});
    add("Kashmere Gate",       {"Tis Hazari",            2, 11, 1.3, "Red Line", "L1", false});
    add("Kashmere Gate",       {"Shastri Park",          2, 11, 1.1, "Red Line", "L1", false});
    add("Kashmere Gate",       {"Kashmere Gate",         5,  0, 0.0, "Yellow Line","L2", true}); // interchange
    add("Kashmere Gate",       {"Kashmere Gate",         5,  0, 0.0, "Violet Line","L6", true}); // interchange
    add("Shastri Park",        {"Kashmere Gate",         2, 11, 1.1, "Red Line", "L1", false});
    add("Shastri Park",        {"Seelampur",             2, 11, 1.2, "Red Line", "L1", false});
    add("Seelampur",           {"Shastri Park",          2, 11, 1.2, "Red Line", "L1", false});
    add("Seelampur",           {"Welcome",               2, 11, 1.0, "Red Line", "L1", false});
    add("Welcome",             {"Seelampur",             2, 11, 1.0, "Red Line", "L1", false});
    add("Welcome",             {"Shahdara",              2, 11, 1.1, "Red Line", "L1", false});
    add("Welcome",             {"Welcome",               5,  0, 0.0, "Pink Line","L7", true}); // interchange
    add("Shahdara",            {"Welcome",               2, 11, 1.1, "Red Line", "L1", false});
    add("Shahdara",            {"Mansarovar Park",       2, 11, 1.0, "Red Line", "L1", false});
    add("Mansarovar Park",     {"Shahdara",              2, 11, 1.0, "Red Line", "L1", false});
    add("Mansarovar Park",     {"Jhilmil",               2, 11, 1.2, "Red Line", "L1", false});
    add("Jhilmil",             {"Mansarovar Park",       2, 11, 1.2, "Red Line", "L1", false});
    add("Jhilmil",             {"Dilshad Garden",        2, 11, 1.1, "Red Line", "L1", false});
    add("Dilshad Garden",      {"Jhilmil",               2, 11, 1.1, "Red Line", "L1", false});
    add("Dilshad Garden",      {"Shaheed Nagar",         2, 11, 1.2, "Red Line", "L1", false});
    add("Shaheed Nagar",       {"Dilshad Garden",        2, 11, 1.2, "Red Line", "L1", false});
    add("Shaheed Nagar",       {"Raj Bagh",              2, 11, 1.1, "Red Line", "L1", false});
    add("Raj Bagh",            {"Shaheed Nagar",         2, 11, 1.1, "Red Line", "L1", false});
    add("Raj Bagh",            {"Rajendra Nagar",        2, 11, 1.2, "Red Line", "L1", false});
    add("Rajendra Nagar",      {"Raj Bagh",              2, 11, 1.2, "Red Line", "L1", false});
    add("Rajendra Nagar",      {"Shyam Park",            2, 11, 1.1, "Red Line", "L1", false});
    add("Shyam Park",          {"Rajendra Nagar",        2, 11, 1.1, "Red Line", "L1", false});
    add("Shyam Park",          {"Mohan Nagar",           2, 11, 1.3, "Red Line", "L1", false});
    add("Mohan Nagar",         {"Shyam Park",            2, 11, 1.3, "Red Line", "L1", false});
    add("Mohan Nagar",         {"Arthala",               2, 11, 1.2, "Red Line", "L1", false});
    add("Arthala",             {"Mohan Nagar",           2, 11, 1.2, "Red Line", "L1", false});
    add("Arthala",             {"Hindon River",          2, 11, 1.2, "Red Line", "L1", false});
    add("Hindon River",        {"Arthala",               2, 11, 1.2, "Red Line", "L1", false});
    add("Hindon River",        {"Shaheed Sthal",         2, 11, 1.3, "Red Line", "L1", false});
    add("Shaheed Sthal",       {"Hindon River",          2, 11, 1.3, "Red Line", "L1", false});

    // ═══════════════════════════════════════════════════════════════
    // LINE 2 — YELLOW LINE
    // Samaypur Badli ↔ HUDA City Centre   37 stations
    // ═══════════════════════════════════════════════════════════════
    add("Samaypur Badli",        {"Rohini Sector 18, 19",   2, 11, 1.2, "Yellow Line","L2", false});
    add("Rohini Sector 18, 19",  {"Samaypur Badli",         2, 11, 1.2, "Yellow Line","L2", false});
    add("Rohini Sector 18, 19",  {"Haiderpur Badli Mor",    2, 11, 1.1, "Yellow Line","L2", false});
    add("Haiderpur Badli Mor",   {"Rohini Sector 18, 19",   2, 11, 1.1, "Yellow Line","L2", false});
    add("Haiderpur Badli Mor",   {"Jahangirpuri",           2, 11, 1.2, "Yellow Line","L2", false});
    add("Jahangirpuri",          {"Haiderpur Badli Mor",    2, 11, 1.2, "Yellow Line","L2", false});
    add("Jahangirpuri",          {"Adarsh Nagar",           2, 11, 1.3, "Yellow Line","L2", false});
    add("Adarsh Nagar",          {"Jahangirpuri",           2, 11, 1.3, "Yellow Line","L2", false});
    add("Adarsh Nagar",          {"Azadpur",               2, 11, 1.1, "Yellow Line","L2", false});
    add("Azadpur",               {"Adarsh Nagar",           2, 11, 1.1, "Yellow Line","L2", false});
    add("Azadpur",               {"Model Town",             2, 11, 1.2, "Yellow Line","L2", false});
    add("Azadpur",               {"Azadpur",               5,  0, 0.0, "Pink Line",  "L7", true}); // interchange
    add("Model Town",            {"Azadpur",               2, 11, 1.2, "Yellow Line","L2", false});
    add("Model Town",            {"GTB Nagar",              2, 11, 1.1, "Yellow Line","L2", false});
    add("GTB Nagar",             {"Model Town",             2, 11, 1.1, "Yellow Line","L2", false});
    add("GTB Nagar",             {"Vishwavidyalaya",        2, 11, 1.0, "Yellow Line","L2", false});
    add("Vishwavidyalaya",       {"GTB Nagar",              2, 11, 1.0, "Yellow Line","L2", false});
    add("Vishwavidyalaya",       {"Vidhan Sabha",           2, 11, 1.1, "Yellow Line","L2", false});
    add("Vidhan Sabha",          {"Vishwavidyalaya",        2, 11, 1.1, "Yellow Line","L2", false});
    add("Vidhan Sabha",          {"Civil Lines",            2, 11, 1.2, "Yellow Line","L2", false});
    add("Civil Lines",           {"Vidhan Sabha",           2, 11, 1.2, "Yellow Line","L2", false});
    add("Civil Lines",           {"Kashmere Gate",          2, 11, 1.0, "Yellow Line","L2", false});
    add("Chandni Chowk",         {"Kashmere Gate",          2, 11, 1.3, "Yellow Line","L2", false});
    add("Chandni Chowk",         {"Chawri Bazaar",          2, 11, 1.1, "Yellow Line","L2", false});
    add("Chawri Bazaar",         {"Chandni Chowk",          2, 11, 1.1, "Yellow Line","L2", false});
    add("Chawri Bazaar",         {"New Delhi",              2, 11, 1.2, "Yellow Line","L2", false});
    add("New Delhi",             {"Chawri Bazaar",          2, 11, 1.2, "Yellow Line","L2", false});
    add("New Delhi",             {"Rajiv Chowk",            2, 11, 0.8, "Yellow Line","L2", false});
    add("New Delhi",             {"New Delhi",              3,  0, 0.0, "Airport Express","AEL", true}); // interchange
    add("Rajiv Chowk",           {"New Delhi",              2, 11, 0.8, "Yellow Line","L2", false});
    add("Rajiv Chowk",           {"Patel Chowk",            2, 11, 1.0, "Yellow Line","L2", false});
    add("Rajiv Chowk",           {"Rajiv Chowk",           5,  0, 0.0, "Blue Line","L3", true}); // interchange
    add("Patel Chowk",           {"Rajiv Chowk",            2, 11, 1.0, "Yellow Line","L2", false});
    add("Patel Chowk",           {"Central Secretariat",    2, 11, 1.1, "Yellow Line","L2", false});
    add("Central Secretariat",   {"Patel Chowk",            2, 11, 1.1, "Yellow Line","L2", false});
    add("Central Secretariat",   {"Udyog Bhawan",           2, 11, 1.0, "Yellow Line","L2", false});
    add("Central Secretariat",   {"Central Secretariat",   5,  0, 0.0, "Violet Line","L6", true}); // interchange
    add("Udyog Bhawan",          {"Central Secretariat",    2, 11, 1.0, "Yellow Line","L2", false});
    add("Udyog Bhawan",          {"Lok Kalyan Marg",        2, 11, 1.2, "Yellow Line","L2", false});
    add("Lok Kalyan Marg",       {"Udyog Bhawan",           2, 11, 1.2, "Yellow Line","L2", false});
    add("Lok Kalyan Marg",       {"Jor Bagh",               2, 11, 1.1, "Yellow Line","L2", false});
    add("Jor Bagh",              {"Lok Kalyan Marg",        2, 11, 1.1, "Yellow Line","L2", false});
    add("Jor Bagh",              {"INA",                   2, 11, 1.3, "Yellow Line","L2", false});
    add("INA",                   {"Jor Bagh",               2, 11, 1.3, "Yellow Line","L2", false});
    add("INA",                   {"AIIMS",                  2, 11, 1.1, "Yellow Line","L2", false});
    add("AIIMS",                 {"INA",                   2, 11, 1.1, "Yellow Line","L2", false});
    add("AIIMS",                 {"Green Park",             2, 11, 1.2, "Yellow Line","L2", false});
    add("Green Park",            {"AIIMS",                  2, 11, 1.2, "Yellow Line","L2", false});
    add("Green Park",            {"Hauz Khas",              2, 11, 1.3, "Yellow Line","L2", false});
    add("Hauz Khas",             {"Green Park",             2, 11, 1.3, "Yellow Line","L2", false});
    add("Hauz Khas",             {"Malviya Nagar",          2, 11, 1.4, "Yellow Line","L2", false});
    add("Hauz Khas",             {"Hauz Khas",             5,  0, 0.0, "Magenta Line","L8", true}); // interchange
    add("Malviya Nagar",         {"Hauz Khas",              2, 11, 1.4, "Yellow Line","L2", false});
    add("Malviya Nagar",         {"Saket",                  2, 11, 1.2, "Yellow Line","L2", false});
    add("Saket",                 {"Malviya Nagar",          2, 11, 1.2, "Yellow Line","L2", false});
    add("Saket",                 {"Qutab Minar",            2, 11, 1.5, "Yellow Line","L2", false});
    add("Qutab Minar",           {"Saket",                  2, 11, 1.5, "Yellow Line","L2", false});
    add("Qutab Minar",           {"Chhattarpur",            2, 11, 1.3, "Yellow Line","L2", false});
    add("Chhattarpur",           {"Qutab Minar",            2, 11, 1.3, "Yellow Line","L2", false});
    add("Chhattarpur",           {"Sultanpur",              2, 11, 1.4, "Yellow Line","L2", false});
    add("Sultanpur",             {"Chhattarpur",            2, 11, 1.4, "Yellow Line","L2", false});
    add("Sultanpur",             {"Ghitorni",               2, 11, 1.3, "Yellow Line","L2", false});
    add("Ghitorni",              {"Sultanpur",              2, 11, 1.3, "Yellow Line","L2", false});
    add("Ghitorni",              {"Arjangarh",              2, 11, 1.5, "Yellow Line","L2", false});
    add("Arjangarh",             {"Ghitorni",               2, 11, 1.5, "Yellow Line","L2", false});
    add("Arjangarh",             {"Guru Dronacharya",       2, 11, 1.4, "Yellow Line","L2", false});
    add("Guru Dronacharya",      {"Arjangarh",              2, 11, 1.4, "Yellow Line","L2", false});
    add("Guru Dronacharya",      {"Sikanderpur",            2, 11, 1.2, "Yellow Line","L2", false});
    add("Sikanderpur",           {"Guru Dronacharya",       2, 11, 1.2, "Yellow Line","L2", false});
    add("Sikanderpur",           {"MG Road",                2, 11, 1.1, "Yellow Line","L2", false});
    add("Sikanderpur",           {"Sikanderpur",           4,  0, 0.0, "Rapid Metro Gurgaon","RMG", true}); // interchange
    add("MG Road",               {"Sikanderpur",            2, 11, 1.1, "Yellow Line","L2", false});
    add("MG Road",               {"IFFCO Chowk",            2, 11, 1.3, "Yellow Line","L2", false});
    add("IFFCO Chowk",           {"MG Road",                2, 11, 1.3, "Yellow Line","L2", false});
    add("IFFCO Chowk",           {"HUDA City Centre",       2, 11, 1.4, "Yellow Line","L2", false});
    add("HUDA City Centre",      {"IFFCO Chowk",            2, 11, 1.4, "Yellow Line","L2", false});

    // ═══════════════════════════════════════════════════════════════
    // LINE 3 — BLUE LINE
    // Dwarka Sector 21 ↔ Vaishali (main) + branch to Noida Electronic City
    // ═══════════════════════════════════════════════════════════════
    add("Dwarka Sector 21",   {"Dwarka Sector 8",     2, 11, 1.3, "Blue Line","L3", false});
    add("Dwarka Sector 21",   {"Dwarka Sector 21",    3,  0, 0.0, "Airport Express","AEL", true}); // interchange
    add("Dwarka Sector 8",    {"Dwarka Sector 21",    2, 11, 1.3, "Blue Line","L3", false});
    add("Dwarka Sector 8",    {"Dwarka Sector 9",     2, 11, 0.9, "Blue Line","L3", false});
    add("Dwarka Sector 9",    {"Dwarka Sector 8",     2, 11, 0.9, "Blue Line","L3", false});
    add("Dwarka Sector 9",    {"Dwarka Sector 10",    2, 11, 0.9, "Blue Line","L3", false});
    add("Dwarka Sector 10",   {"Dwarka Sector 9",     2, 11, 0.9, "Blue Line","L3", false});
    add("Dwarka Sector 10",   {"Dwarka Sector 11",    2, 11, 1.0, "Blue Line","L3", false});
    add("Dwarka Sector 11",   {"Dwarka Sector 10",    2, 11, 1.0, "Blue Line","L3", false});
    add("Dwarka Sector 11",   {"Dwarka Sector 12",    2, 11, 0.9, "Blue Line","L3", false});
    add("Dwarka Sector 12",   {"Dwarka Sector 11",    2, 11, 0.9, "Blue Line","L3", false});
    add("Dwarka Sector 12",   {"Dwarka Sector 13",    2, 11, 0.9, "Blue Line","L3", false});
    add("Dwarka Sector 13",   {"Dwarka Sector 12",    2, 11, 0.9, "Blue Line","L3", false});
    add("Dwarka Sector 13",   {"Dwarka Sector 14",    2, 11, 1.0, "Blue Line","L3", false});
    add("Dwarka Sector 14",   {"Dwarka Sector 13",    2, 11, 1.0, "Blue Line","L3", false});
    add("Dwarka Sector 14",   {"Dwarka",              2, 11, 1.2, "Blue Line","L3", false});
    add("Dwarka",             {"Dwarka Sector 14",    2, 11, 1.2, "Blue Line","L3", false});
    add("Dwarka",             {"Dwarka Mor",          2, 11, 1.4, "Blue Line","L3", false});
    add("Dwarka",             {"Dwarka",              4,  0, 0.0, "Grey Line","L9", true}); // interchange
    add("Dwarka Mor",         {"Dwarka",              2, 11, 1.4, "Blue Line","L3", false});
    add("Dwarka Mor",         {"Nawada",              2, 11, 1.2, "Blue Line","L3", false});
    add("Nawada",             {"Dwarka Mor",          2, 11, 1.2, "Blue Line","L3", false});
    add("Nawada",             {"Uttam Nagar West",    2, 11, 1.1, "Blue Line","L3", false});
    add("Uttam Nagar West",   {"Nawada",              2, 11, 1.1, "Blue Line","L3", false});
    add("Uttam Nagar West",   {"Uttam Nagar East",    2, 11, 1.0, "Blue Line","L3", false});
    add("Uttam Nagar East",   {"Uttam Nagar West",    2, 11, 1.0, "Blue Line","L3", false});
    add("Uttam Nagar East",   {"Janakpuri West",      2, 11, 1.2, "Blue Line","L3", false});
    add("Janakpuri West",     {"Uttam Nagar East",    2, 11, 1.2, "Blue Line","L3", false});
    add("Janakpuri West",     {"Janakpuri East",      2, 11, 1.1, "Blue Line","L3", false});
    add("Janakpuri West",     {"Janakpuri West",      5,  0, 0.0, "Magenta Line","L8", true}); // interchange
    add("Janakpuri East",     {"Janakpuri West",      2, 11, 1.1, "Blue Line","L3", false});
    add("Janakpuri East",     {"Tilak Nagar",         2, 11, 1.2, "Blue Line","L3", false});
    add("Tilak Nagar",        {"Janakpuri East",      2, 11, 1.2, "Blue Line","L3", false});
    add("Tilak Nagar",        {"Subhash Nagar",       2, 11, 1.1, "Blue Line","L3", false});
    add("Subhash Nagar",      {"Tilak Nagar",         2, 11, 1.1, "Blue Line","L3", false});
    add("Subhash Nagar",      {"Tagore Garden",       2, 11, 1.0, "Blue Line","L3", false});
    add("Tagore Garden",      {"Subhash Nagar",       2, 11, 1.0, "Blue Line","L3", false});
    add("Tagore Garden",      {"Rajouri Garden",      2, 11, 1.1, "Blue Line","L3", false});
    add("Rajouri Garden",     {"Tagore Garden",       2, 11, 1.1, "Blue Line","L3", false});
    add("Rajouri Garden",     {"Ramesh Nagar",        2, 11, 1.2, "Blue Line","L3", false});
    add("Rajouri Garden",     {"Rajouri Garden",      5,  0, 0.0, "Pink Line","L7", true}); // interchange
    add("Ramesh Nagar",       {"Rajouri Garden",      2, 11, 1.2, "Blue Line","L3", false});
    add("Ramesh Nagar",       {"Moti Nagar",          2, 11, 1.0, "Blue Line","L3", false});
    add("Moti Nagar",         {"Ramesh Nagar",        2, 11, 1.0, "Blue Line","L3", false});
    add("Moti Nagar",         {"Kirti Nagar",         2, 11, 1.1, "Blue Line","L3", false});
    add("Kirti Nagar",        {"Moti Nagar",          2, 11, 1.1, "Blue Line","L3", false});
    add("Kirti Nagar",        {"Shadipur",            2, 11, 1.2, "Blue Line","L3", false});
    add("Kirti Nagar",        {"Kirti Nagar",         5,  0, 0.0, "Green Line","L5", true}); // interchange
    add("Shadipur",           {"Kirti Nagar",         2, 11, 1.2, "Blue Line","L3", false});
    add("Shadipur",           {"Patel Nagar",         2, 11, 1.0, "Blue Line","L3", false});
    add("Patel Nagar",        {"Shadipur",            2, 11, 1.0, "Blue Line","L3", false});
    add("Patel Nagar",        {"Rajendra Place",      2, 11, 1.1, "Blue Line","L3", false});
    add("Rajendra Place",     {"Patel Nagar",         2, 11, 1.1, "Blue Line","L3", false});
    add("Rajendra Place",     {"Karol Bagh",          2, 11, 1.0, "Blue Line","L3", false});
    add("Karol Bagh",         {"Rajendra Place",      2, 11, 1.0, "Blue Line","L3", false});
    add("Karol Bagh",         {"Jhandewalan",         2, 11, 1.1, "Blue Line","L3", false});
    add("Jhandewalan",        {"Karol Bagh",          2, 11, 1.1, "Blue Line","L3", false});
    add("Jhandewalan",        {"Ramakrishna Ashram Marg", 2, 11, 1.0, "Blue Line","L3", false});
    add("Ramakrishna Ashram Marg", {"Jhandewalan",    2, 11, 1.0, "Blue Line","L3", false});
    add("Ramakrishna Ashram Marg", {"Rajiv Chowk",   2, 11, 0.9, "Blue Line","L3", false});
    add("Barakhamba Road",    {"Rajiv Chowk",         2, 11, 0.9, "Blue Line","L3", false});
    add("Barakhamba Road",    {"Mandi House",         2, 11, 0.9, "Blue Line","L3", false});
    add("Mandi House",        {"Barakhamba Road",     2, 11, 0.9, "Blue Line","L3", false});
    add("Mandi House",        {"Pragati Maidan",      2, 11, 1.1, "Blue Line","L3", false});
    add("Mandi House",        {"Mandi House",         5,  0, 0.0, "Violet Line","L6", true}); // interchange
    add("Pragati Maidan",     {"Mandi House",         2, 11, 1.1, "Blue Line","L3", false});
    add("Pragati Maidan",     {"Indraprastha",        2, 11, 1.2, "Blue Line","L3", false});
    add("Indraprastha",       {"Pragati Maidan",      2, 11, 1.2, "Blue Line","L3", false});
    add("Indraprastha",       {"Yamuna Bank",         2, 11, 1.6, "Blue Line","L3", false});
    add("Yamuna Bank",        {"Indraprastha",        2, 11, 1.6, "Blue Line","L3", false});
    add("Yamuna Bank",        {"Laxmi Nagar",         2, 11, 1.2, "Blue Line","L3", false});
    add("Yamuna Bank",        {"Akshardham",          2, 11, 1.5, "Blue Line Branch","L3B", false});
    add("Laxmi Nagar",        {"Yamuna Bank",         2, 11, 1.2, "Blue Line","L3", false});
    add("Laxmi Nagar",        {"Nirman Vihar",        2, 11, 1.1, "Blue Line","L3", false});
    add("Nirman Vihar",       {"Laxmi Nagar",         2, 11, 1.1, "Blue Line","L3", false});
    add("Nirman Vihar",       {"Preet Vihar",         2, 11, 1.0, "Blue Line","L3", false});
    add("Preet Vihar",        {"Nirman Vihar",        2, 11, 1.0, "Blue Line","L3", false});
    add("Preet Vihar",        {"Karkardooma",         2, 11, 1.1, "Blue Line","L3", false});
    add("Karkardooma",        {"Preet Vihar",         2, 11, 1.1, "Blue Line","L3", false});
    add("Karkardooma",        {"Anand Vihar ISBT",    2, 11, 1.2, "Blue Line","L3", false});
    add("Anand Vihar ISBT",   {"Karkardooma",         2, 11, 1.2, "Blue Line","L3", false});
    add("Anand Vihar ISBT",   {"Kaushambi",           3, 21, 2.5, "Blue Line","L3", false});
    add("Kaushambi",          {"Anand Vihar ISBT",    3, 21, 2.5, "Blue Line","L3", false});
    add("Kaushambi",          {"Vaishali",            3, 11, 2.0, "Blue Line","L3", false});
    add("Vaishali",           {"Kaushambi",           3, 11, 2.0, "Blue Line","L3", false});

    // Blue Line Branch (Yamuna Bank → Noida Electronic City)
    add("Akshardham",            {"Yamuna Bank",           2, 11, 1.5, "Blue Line Branch","L3B", false});
    add("Akshardham",            {"Mayur Vihar Phase-1",   2, 11, 1.4, "Blue Line Branch","L3B", false});
    add("Mayur Vihar Phase-1",   {"Akshardham",            2, 11, 1.4, "Blue Line Branch","L3B", false});
    add("Mayur Vihar Phase-1",   {"Mayur Vihar Extension", 2, 11, 1.2, "Blue Line Branch","L3B", false});
    add("Mayur Vihar Phase-1",   {"Mayur Vihar Phase-1",  5,  0, 0.0, "Pink Line","L7", true}); // interchange
    add("Mayur Vihar Extension", {"Mayur Vihar Phase-1",   2, 11, 1.2, "Blue Line Branch","L3B", false});
    add("Mayur Vihar Extension", {"New Ashok Nagar",       2, 11, 1.4, "Blue Line Branch","L3B", false});
    add("New Ashok Nagar",       {"Mayur Vihar Extension", 2, 11, 1.4, "Blue Line Branch","L3B", false});
    add("New Ashok Nagar",       {"Noida Sector 15",       3, 21, 2.0, "Blue Line Branch","L3B", false});
    add("Noida Sector 15",       {"New Ashok Nagar",       3, 21, 2.0, "Blue Line Branch","L3B", false});
    add("Noida Sector 15",       {"Noida Sector 16",       2, 11, 1.1, "Blue Line Branch","L3B", false});
    add("Noida Sector 16",       {"Noida Sector 15",       2, 11, 1.1, "Blue Line Branch","L3B", false});
    add("Noida Sector 16",       {"Noida Sector 18",       2, 11, 1.3, "Blue Line Branch","L3B", false});
    add("Noida Sector 18",       {"Noida Sector 16",       2, 11, 1.3, "Blue Line Branch","L3B", false});
    add("Noida Sector 18",       {"Botanical Garden",      2, 11, 1.2, "Blue Line Branch","L3B", false});
    add("Botanical Garden",      {"Noida Sector 18",       2, 11, 1.2, "Blue Line Branch","L3B", false});
    add("Botanical Garden",      {"Golf Course",           2, 11, 1.3, "Blue Line Branch","L3B", false});
    add("Botanical Garden",      {"Botanical Garden",     5,  0, 0.0, "Magenta Line","L8", true}); // interchange
    add("Golf Course",           {"Botanical Garden",      2, 11, 1.3, "Blue Line Branch","L3B", false});
    add("Golf Course",           {"Noida City Centre",     2, 11, 1.4, "Blue Line Branch","L3B", false});
    add("Noida City Centre",     {"Golf Course",           2, 11, 1.4, "Blue Line Branch","L3B", false});
    add("Noida City Centre",     {"Noida Sector 34",       2, 11, 1.5, "Blue Line Branch","L3B", false});
    add("Noida Sector 34",       {"Noida City Centre",     2, 11, 1.5, "Blue Line Branch","L3B", false});
    add("Noida Sector 34",       {"Noida Sector 52",       2, 11, 1.3, "Blue Line Branch","L3B", false});
    add("Noida Sector 52",       {"Noida Sector 34",       2, 11, 1.3, "Blue Line Branch","L3B", false});
    add("Noida Sector 52",       {"Noida Sector 61",       2, 11, 1.4, "Blue Line Branch","L3B", false});
    add("Noida Sector 61",       {"Noida Sector 52",       2, 11, 1.4, "Blue Line Branch","L3B", false});
    add("Noida Sector 61",       {"Noida Sector 59",       2, 11, 1.2, "Blue Line Branch","L3B", false});
    add("Noida Sector 59",       {"Noida Sector 61",       2, 11, 1.2, "Blue Line Branch","L3B", false});
    add("Noida Sector 59",       {"Noida Sector 62",       2, 11, 1.1, "Blue Line Branch","L3B", false});
    add("Noida Sector 62",       {"Noida Sector 59",       2, 11, 1.1, "Blue Line Branch","L3B", false});
    add("Noida Sector 62",       {"Noida Electronic City", 3, 21, 2.2, "Blue Line Branch","L3B", false});
    add("Noida Electronic City", {"Noida Sector 62",       3, 21, 2.2, "Blue Line Branch","L3B", false});

    // ═══════════════════════════════════════════════════════════════
    // LINE 5 — GREEN LINE
    // Inderlok ↔ Brigadier Hoshiyar Singh + branch to Kirti Nagar
    // ═══════════════════════════════════════════════════════════════
    add("Ashok Park Main",           {"Inderlok",                   2, 11, 1.1, "Green Line","L5", false});
    add("Ashok Park Main",           {"Satguru Ram Singh Marg",     2, 11, 1.2, "Green Line","L5", false});
    add("Ashok Park Main",           {"Kirti Nagar",                3, 11, 1.5, "Green Line","L5", false});
    add("Satguru Ram Singh Marg",    {"Ashok Park Main",            2, 11, 1.2, "Green Line","L5", false});
    add("Satguru Ram Singh Marg",    {"Punjabi Bagh West",          2, 11, 1.1, "Green Line","L5", false});
    add("Punjabi Bagh West",         {"Satguru Ram Singh Marg",     2, 11, 1.1, "Green Line","L5", false});
    add("Punjabi Bagh West",         {"ESI Hospital",               2, 11, 1.2, "Green Line","L5", false});
    add("ESI Hospital",              {"Punjabi Bagh West",          2, 11, 1.2, "Green Line","L5", false});
    add("ESI Hospital",              {"Peeragarhi",                 2, 11, 1.1, "Green Line","L5", false});
    add("Peeragarhi",                {"ESI Hospital",               2, 11, 1.1, "Green Line","L5", false});
    add("Peeragarhi",                {"Paschim Vihar East",         2, 11, 1.3, "Green Line","L5", false});
    add("Paschim Vihar East",        {"Peeragarhi",                 2, 11, 1.3, "Green Line","L5", false});
    add("Paschim Vihar East",        {"Paschim Vihar West",         2, 11, 0.9, "Green Line","L5", false});
    add("Paschim Vihar West",        {"Paschim Vihar East",         2, 11, 0.9, "Green Line","L5", false});
    add("Paschim Vihar West",        {"Madipur",                    2, 11, 1.0, "Green Line","L5", false});
    add("Madipur",                   {"Paschim Vihar West",         2, 11, 1.0, "Green Line","L5", false});
    add("Madipur",                   {"Shivaji Park",               2, 11, 1.1, "Green Line","L5", false});
    add("Shivaji Park",              {"Madipur",                    2, 11, 1.1, "Green Line","L5", false});
    add("Shivaji Park",              {"Nangloi",                    2, 11, 1.2, "Green Line","L5", false});
    add("Nangloi",                   {"Shivaji Park",               2, 11, 1.2, "Green Line","L5", false});
    add("Nangloi",                   {"Nangloi Railway Station",    2, 11, 1.0, "Green Line","L5", false});
    add("Nangloi Railway Station",   {"Nangloi",                    2, 11, 1.0, "Green Line","L5", false});
    add("Nangloi Railway Station",   {"Rajdhani Park",              2, 11, 1.1, "Green Line","L5", false});
    add("Rajdhani Park",             {"Nangloi Railway Station",    2, 11, 1.1, "Green Line","L5", false});
    add("Rajdhani Park",             {"Mundka",                     2, 11, 1.2, "Green Line","L5", false});
    add("Mundka",                    {"Rajdhani Park",              2, 11, 1.2, "Green Line","L5", false});
    add("Mundka",                    {"Mundka Industrial Area",     2, 11, 1.3, "Green Line","L5", false});
    add("Mundka Industrial Area",    {"Mundka",                     2, 11, 1.3, "Green Line","L5", false});
    add("Mundka Industrial Area",    {"Ghevra",                     3, 21, 2.0, "Green Line","L5", false});
    add("Ghevra",                    {"Mundka Industrial Area",     3, 21, 2.0, "Green Line","L5", false});
    add("Ghevra",                    {"Tikri Kalan",                2, 11, 1.4, "Green Line","L5", false});
    add("Tikri Kalan",               {"Ghevra",                     2, 11, 1.4, "Green Line","L5", false});
    add("Tikri Kalan",               {"Tikri Border",               2, 11, 1.2, "Green Line","L5", false});
    add("Tikri Border",              {"Tikri Kalan",                2, 11, 1.2, "Green Line","L5", false});
    add("Tikri Border",              {"Pandit Shree Ram Sharma",    2, 11, 1.1, "Green Line","L5", false});
    add("Pandit Shree Ram Sharma",   {"Tikri Border",               2, 11, 1.1, "Green Line","L5", false});
    add("Pandit Shree Ram Sharma",   {"Bahadurgarh City Park",      2, 11, 1.3, "Green Line","L5", false});
    add("Bahadurgarh City Park",     {"Pandit Shree Ram Sharma",    2, 11, 1.3, "Green Line","L5", false});
    add("Bahadurgarh City Park",     {"Brigadier Hoshiyar Singh",   2, 11, 1.2, "Green Line","L5", false});
    add("Brigadier Hoshiyar Singh",  {"Bahadurgarh City Park",      2, 11, 1.2, "Green Line","L5", false});

    // ═══════════════════════════════════════════════════════════════
    // LINE 6 — VIOLET LINE
    // Kashmere Gate ↔ Raja Nahar Singh (Ballabhgarh)   34 stations
    // ═══════════════════════════════════════════════════════════════
    add("Lal Quila",                    {"Kashmere Gate",               2, 11, 1.4, "Violet Line","L6", false});
    add("Lal Quila",                    {"Jama Masjid",                 2, 11, 1.2, "Violet Line","L6", false});
    add("Jama Masjid",                  {"Lal Quila",                   2, 11, 1.2, "Violet Line","L6", false});
    add("Jama Masjid",                  {"Delhi Gate",                  2, 11, 1.1, "Violet Line","L6", false});
    add("Delhi Gate",                   {"Jama Masjid",                 2, 11, 1.1, "Violet Line","L6", false});
    add("Delhi Gate",                   {"ITO",                         2, 11, 1.0, "Violet Line","L6", false});
    add("ITO",                          {"Delhi Gate",                  2, 11, 1.0, "Violet Line","L6", false});
    add("ITO",                          {"Mandi House",                 2, 11, 1.1, "Violet Line","L6", false});
    add("Khan Market",                  {"Central Secretariat",         2, 11, 1.2, "Violet Line","L6", false});
    add("Khan Market",                  {"Jawaharlal Nehru Stadium",    2, 11, 1.3, "Violet Line","L6", false});
    add("Jawaharlal Nehru Stadium",     {"Khan Market",                 2, 11, 1.3, "Violet Line","L6", false});
    add("Jawaharlal Nehru Stadium",     {"Jangpura",                    2, 11, 1.2, "Violet Line","L6", false});
    add("Jangpura",                     {"Jawaharlal Nehru Stadium",    2, 11, 1.2, "Violet Line","L6", false});
    add("Jangpura",                     {"Lajpat Nagar",                2, 11, 1.1, "Violet Line","L6", false});
    add("Lajpat Nagar",                 {"Jangpura",                    2, 11, 1.1, "Violet Line","L6", false});
    add("Lajpat Nagar",                 {"Moolchand",                   2, 11, 1.2, "Violet Line","L6", false});
    add("Lajpat Nagar",                 {"Lajpat Nagar",               5,  0, 0.0, "Pink Line","L7", true}); // interchange
    add("Moolchand",                    {"Lajpat Nagar",                2, 11, 1.2, "Violet Line","L6", false});
    add("Moolchand",                    {"Kailash Colony",              2, 11, 1.1, "Violet Line","L6", false});
    add("Kailash Colony",               {"Moolchand",                   2, 11, 1.1, "Violet Line","L6", false});
    add("Kailash Colony",               {"Nehru Place",                 2, 11, 1.3, "Violet Line","L6", false});
    add("Nehru Place",                  {"Kailash Colony",              2, 11, 1.3, "Violet Line","L6", false});
    add("Nehru Place",                  {"Kalkaji Mandir",              2, 11, 1.2, "Violet Line","L6", false});
    add("Kalkaji Mandir",               {"Nehru Place",                 2, 11, 1.2, "Violet Line","L6", false});
    add("Kalkaji Mandir",               {"Govind Puri",                 2, 11, 1.1, "Violet Line","L6", false});
    add("Kalkaji Mandir",               {"Kalkaji Mandir",             5,  0, 0.0, "Magenta Line","L8", true}); // interchange
    add("Govind Puri",                  {"Kalkaji Mandir",              2, 11, 1.1, "Violet Line","L6", false});
    add("Govind Puri",                  {"Okhla",                       2, 11, 1.3, "Violet Line","L6", false});
    add("Okhla",                        {"Govind Puri",                 2, 11, 1.3, "Violet Line","L6", false});
    add("Okhla",                        {"Jasola Apollo",               2, 11, 1.4, "Violet Line","L6", false});
    add("Jasola Apollo",                {"Okhla",                       2, 11, 1.4, "Violet Line","L6", false});
    add("Jasola Apollo",                {"Sarita Vihar",                2, 11, 1.2, "Violet Line","L6", false});
    add("Sarita Vihar",                 {"Jasola Apollo",               2, 11, 1.2, "Violet Line","L6", false});
    add("Sarita Vihar",                 {"Mohan Estate",                2, 11, 1.3, "Violet Line","L6", false});
    add("Mohan Estate",                 {"Sarita Vihar",                2, 11, 1.3, "Violet Line","L6", false});
    add("Mohan Estate",                 {"Tughlakabad",                 2, 11, 1.4, "Violet Line","L6", false});
    add("Tughlakabad",                  {"Mohan Estate",                2, 11, 1.4, "Violet Line","L6", false});
    add("Tughlakabad",                  {"Badarpur Border",             2, 11, 1.5, "Violet Line","L6", false});
    add("Badarpur Border",              {"Tughlakabad",                 2, 11, 1.5, "Violet Line","L6", false});
    add("Badarpur Border",              {"Sarai",                       2, 11, 1.3, "Violet Line","L6", false});
    add("Sarai",                        {"Badarpur Border",             2, 11, 1.3, "Violet Line","L6", false});
    add("Sarai",                        {"NHPC Chowk",                  2, 11, 1.2, "Violet Line","L6", false});
    add("NHPC Chowk",                   {"Sarai",                       2, 11, 1.2, "Violet Line","L6", false});
    add("NHPC Chowk",                   {"Mewala Maharajpur",           2, 11, 1.1, "Violet Line","L6", false});
    add("Mewala Maharajpur",            {"NHPC Chowk",                  2, 11, 1.1, "Violet Line","L6", false});
    add("Mewala Maharajpur",            {"Sector 28",                   2, 11, 1.2, "Violet Line","L6", false});
    add("Sector 28",                    {"Mewala Maharajpur",           2, 11, 1.2, "Violet Line","L6", false});
    add("Sector 28",                    {"Badkal Mor",                  2, 11, 1.3, "Violet Line","L6", false});
    add("Badkal Mor",                   {"Sector 28",                   2, 11, 1.3, "Violet Line","L6", false});
    add("Badkal Mor",                   {"Old Faridabad",               2, 11, 1.4, "Violet Line","L6", false});
    add("Old Faridabad",                {"Badkal Mor",                  2, 11, 1.4, "Violet Line","L6", false});
    add("Old Faridabad",                {"Neelam Chowk Ajronda",        2, 11, 1.2, "Violet Line","L6", false});
    add("Neelam Chowk Ajronda",         {"Old Faridabad",               2, 11, 1.2, "Violet Line","L6", false});
    add("Neelam Chowk Ajronda",         {"Bata Chowk",                  2, 11, 1.3, "Violet Line","L6", false});
    add("Bata Chowk",                   {"Neelam Chowk Ajronda",        2, 11, 1.3, "Violet Line","L6", false});
    add("Bata Chowk",                   {"Escorts Mujesar",             2, 11, 1.2, "Violet Line","L6", false});
    add("Escorts Mujesar",              {"Bata Chowk",                  2, 11, 1.2, "Violet Line","L6", false});
    add("Escorts Mujesar",              {"Sant Surdas (Sihi)",          3, 21, 2.1, "Violet Line","L6", false});
    add("Sant Surdas (Sihi)",           {"Escorts Mujesar",             3, 21, 2.1, "Violet Line","L6", false});
    add("Sant Surdas (Sihi)",           {"Raja Nahar Singh (Ballabhgarh)", 3, 21, 2.0, "Violet Line","L6", false});
    add("Raja Nahar Singh (Ballabhgarh)",{"Sant Surdas (Sihi)",         3, 21, 2.0, "Violet Line","L6", false});

    // ═══════════════════════════════════════════════════════════════
    // LINE 7 — PINK LINE
    // Majlis Park ↔ Shiv Vihar + branch to Maujpur-Babarpur
    // ═══════════════════════════════════════════════════════════════
    add("Majlis Park",                    {"Azadpur",                        3, 21, 2.1, "Pink Line","L7", false});
    add("Durgabai Deshmukh South Campus", {"Hauz Khas",                      3, 21, 2.0, "Pink Line","L7", false});
    add("Durgabai Deshmukh South Campus", {"Sir Vishweshwaraiah Moti Bagh",   2, 11, 1.3, "Pink Line","L7", false});
    add("Durgabai Deshmukh South Campus", {"Durgabai Deshmukh South Campus", 5,  0, 0.0, "Yellow Line","L2", true}); // interchange
    add("South Campus",                   {"Durgabai Deshmukh South Campus",  0,  0, 0.0, "Pink Line","L7", false});
    add("Sir Vishweshwaraiah Moti Bagh",  {"Durgabai Deshmukh South Campus",  2, 11, 1.3, "Pink Line","L7", false});
    add("Sir Vishweshwaraiah Moti Bagh",  {"Bhikaji Cama Place",              2, 11, 1.2, "Pink Line","L7", false});
    add("Bhikaji Cama Place",             {"Sir Vishweshwaraiah Moti Bagh",   2, 11, 1.2, "Pink Line","L7", false});
    add("Bhikaji Cama Place",             {"Sarojini Nagar",                  2, 11, 1.1, "Pink Line","L7", false});
    add("Sarojini Nagar",                 {"Bhikaji Cama Place",              2, 11, 1.1, "Pink Line","L7", false});
    add("Sarojini Nagar",                 {"INA",                             2, 11, 1.2, "Pink Line","L7", false});
    add("South Extension",                {"Lajpat Nagar",                    2, 11, 1.2, "Pink Line","L7", false});
    add("South Extension",                {"Greater Kailash",                 2, 11, 1.3, "Pink Line","L7", false});
    add("Greater Kailash",                {"South Extension",                 2, 11, 1.3, "Pink Line","L7", false});
    add("Greater Kailash",                {"Chirag Delhi",                    2, 11, 1.2, "Pink Line","L7", false});
    add("Chirag Delhi",                   {"Greater Kailash",                 2, 11, 1.2, "Pink Line","L7", false});
    add("Chirag Delhi",                   {"Panchsheel Park",                 2, 11, 1.1, "Pink Line","L7", false});
    add("Panchsheel Park",                {"Chirag Delhi",                    2, 11, 1.1, "Pink Line","L7", false});
    add("Panchsheel Park",                {"Hauz Khas",                       2, 11, 1.3, "Pink Line","L7", false});
    add("Shiv Vihar",                     {"Johri Enclave",                   2, 11, 1.2, "Pink Line","L7", false});
    add("Johri Enclave",                  {"Shiv Vihar",                      2, 11, 1.2, "Pink Line","L7", false});
    add("Johri Enclave",                  {"Gokulpuri",                       2, 11, 1.3, "Pink Line","L7", false});
    add("Gokulpuri",                      {"Johri Enclave",                   2, 11, 1.3, "Pink Line","L7", false});
    add("Gokulpuri",                      {"Maujpur - Babarpur",              2, 11, 1.1, "Pink Line","L7", false});
    add("Maujpur - Babarpur",             {"Gokulpuri",                       2, 11, 1.1, "Pink Line","L7", false});
    add("Maujpur - Babarpur",             {"Jafrabad",                        2, 11, 1.0, "Pink Line","L7", false});
    add("Jafrabad",                       {"Maujpur - Babarpur",              2, 11, 1.0, "Pink Line","L7", false});
    add("Jafrabad",                       {"Welcome",                         2, 11, 1.2, "Pink Line","L7", false});

    // ═══════════════════════════════════════════════════════════════
    // LINE 8 — MAGENTA LINE
    // Janakpuri West ↔ Botanical Garden   25 stations
    // ═══════════════════════════════════════════════════════════════
    add("Dabri Mor - Janakpuri South", {"Janakpuri West",         2, 11, 1.2, "Magenta Line","L8", false});
    add("Dabri Mor - Janakpuri South", {"Dashrath Puri",          2, 11, 1.1, "Magenta Line","L8", false});
    add("Dashrath Puri",               {"Dabri Mor - Janakpuri South", 2, 11, 1.1, "Magenta Line","L8", false});
    add("Dashrath Puri",               {"Palam",                  2, 11, 1.2, "Magenta Line","L8", false});
    add("Palam",                       {"Dashrath Puri",          2, 11, 1.2, "Magenta Line","L8", false});
    add("Palam",                       {"Sadar Bazaar Cantonment",2, 11, 1.3, "Magenta Line","L8", false});
    add("Sadar Bazaar Cantonment",     {"Palam",                  2, 11, 1.3, "Magenta Line","L8", false});
    add("Sadar Bazaar Cantonment",     {"Terminal 1 IGI Airport", 2, 11, 1.4, "Magenta Line","L8", false});
    add("Terminal 1 IGI Airport",      {"Sadar Bazaar Cantonment",2, 11, 1.4, "Magenta Line","L8", false});
    add("Terminal 1 IGI Airport",      {"Shankar Vihar",          2, 11, 1.2, "Magenta Line","L8", false});
    add("Shankar Vihar",               {"Terminal 1 IGI Airport", 2, 11, 1.2, "Magenta Line","L8", false});
    add("Shankar Vihar",               {"Vasant Vihar",           2, 11, 1.3, "Magenta Line","L8", false});
    add("Vasant Vihar",                {"Shankar Vihar",          2, 11, 1.3, "Magenta Line","L8", false});
    add("Vasant Vihar",                {"Munirka",                2, 11, 1.2, "Magenta Line","L8", false});
    add("Munirka",                     {"Vasant Vihar",           2, 11, 1.2, "Magenta Line","L8", false});
    add("Munirka",                     {"RK Puram",               2, 11, 1.1, "Magenta Line","L8", false});
    add("RK Puram",                    {"Munirka",                2, 11, 1.1, "Magenta Line","L8", false});
    add("RK Puram",                    {"IIT Delhi",              2, 11, 1.3, "Magenta Line","L8", false});
    add("IIT Delhi",                   {"RK Puram",               2, 11, 1.3, "Magenta Line","L8", false});
    add("IIT Delhi",                   {"Hauz Khas",              2, 11, 1.2, "Magenta Line","L8", false});
    add("Panchsheel Park (Magenta)",   {"Hauz Khas",              2, 11, 1.2, "Magenta Line","L8", false});
    add("Panchsheel Park (Magenta)",   {"Chirag Delhi",           2, 11, 1.1, "Magenta Line","L8", false});
    add("Saket G Block",               {"Chirag Delhi",           2, 11, 1.3, "Magenta Line","L8", false});
    add("Saket G Block",               {"Malviya Nagar (Magenta)",2, 11, 1.2, "Magenta Line","L8", false});
    add("Malviya Nagar (Magenta)",     {"Saket G Block",          2, 11, 1.2, "Magenta Line","L8", false});
    add("Malviya Nagar (Magenta)",     {"Kalkaji Mandir",         2, 11, 1.1, "Magenta Line","L8", false});
    add("Okhla NSIC",                  {"Kalkaji Mandir",         2, 11, 1.3, "Magenta Line","L8", false});
    add("Okhla NSIC",                  {"Sukhdev Vihar",          2, 11, 1.2, "Magenta Line","L8", false});
    add("Sukhdev Vihar",               {"Okhla NSIC",             2, 11, 1.2, "Magenta Line","L8", false});
    add("Sukhdev Vihar",               {"Jamia Millia Islamia",   2, 11, 1.3, "Magenta Line","L8", false});
    add("Jamia Millia Islamia",        {"Sukhdev Vihar",          2, 11, 1.3, "Magenta Line","L8", false});
    add("Jamia Millia Islamia",        {"Okhla Vihar",            2, 11, 1.2, "Magenta Line","L8", false});
    add("Okhla Vihar",                 {"Jamia Millia Islamia",   2, 11, 1.2, "Magenta Line","L8", false});
    add("Okhla Vihar",                 {"Jasola Vihar Shaheen Bagh", 2, 11, 1.3, "Magenta Line","L8", false});
    add("Jasola Vihar Shaheen Bagh",   {"Okhla Vihar",            2, 11, 1.3, "Magenta Line","L8", false});
    add("Jasola Vihar Shaheen Bagh",   {"Kalindi Kunj",           2, 11, 1.4, "Magenta Line","L8", false});
    add("Kalindi Kunj",                {"Jasola Vihar Shaheen Bagh", 2, 11, 1.4, "Magenta Line","L8", false});
    add("Kalindi Kunj",                {"Okhla Bird Sanctuary",   2, 11, 1.5, "Magenta Line","L8", false});
    add("Okhla Bird Sanctuary",        {"Kalindi Kunj",           2, 11, 1.5, "Magenta Line","L8", false});
    add("Okhla Bird Sanctuary",        {"Botanical Garden",       3, 21, 2.0, "Magenta Line","L8", false});

    // ═══════════════════════════════════════════════════════════════
    // LINE 9 — GREY LINE
    // Dwarka ↔ Dhansa Bus Stand   4 stations
    // ═══════════════════════════════════════════════════════════════
    add("Nangli",          {"Dwarka",          3, 11, 1.5, "Grey Line","L9", false});
    add("Nangli",          {"Najafgarh",       3, 11, 1.8, "Grey Line","L9", false});
    add("Najafgarh",       {"Nangli",          3, 11, 1.8, "Grey Line","L9", false});
    add("Najafgarh",       {"Dhansa Bus Stand",3, 11, 1.9, "Grey Line","L9", false});
    add("Dhansa Bus Stand",{"Najafgarh",       3, 11, 1.9, "Grey Line","L9", false});

    // ═══════════════════════════════════════════════════════════════
    // AIRPORT EXPRESS LINE (AEL)
    // New Delhi ↔ Dwarka Sector 21   6 stations
    // ═══════════════════════════════════════════════════════════════
    add("Shivaji Stadium (AEL)", {"New Delhi",           4, 60, 2.0, "Airport Express","AEL", false});
    add("Shivaji Stadium (AEL)", {"Dhaula Kuan (AEL)",   4, 10, 2.5, "Airport Express","AEL", false});
    add("Dhaula Kuan (AEL)",     {"Shivaji Stadium (AEL)", 4, 10, 2.5, "Airport Express","AEL", false});
    add("Dhaula Kuan (AEL)",     {"IGI Airport T3",      7, 30, 6.0, "Airport Express","AEL", false});
    add("IGI Airport T3",        {"Dhaula Kuan (AEL)",   7, 30, 6.0, "Airport Express","AEL", false});
    add("IGI Airport T3",        {"Aerocity",            3,  0, 1.5, "Airport Express","AEL", false});
    add("Aerocity",              {"IGI Airport T3",      3,  0, 1.5, "Airport Express","AEL", false});
    add("Aerocity",              {"Dwarka Sector 21",    8, 10, 5.5, "Airport Express","AEL", false});

    // ═══════════════════════════════════════════════════════════════
    // RAPID METRO GURGAON (RMG)
    // Sikanderpur ↔ Phase 1   11 stations, flat ₹20
    // ═══════════════════════════════════════════════════════════════
    add("Sec 42-43",       {"Sikanderpur",   3, 20, 2.1, "Rapid Metro Gurgaon","RMG", false});
    add("Sec 42-43",       {"Sec 53-54",     3, 20, 1.8, "Rapid Metro Gurgaon","RMG", false});
    add("Sec 53-54",       {"Sec 42-43",     3, 20, 1.8, "Rapid Metro Gurgaon","RMG", false});
    add("Sec 53-54",       {"Sec 54 Chowk",  2, 20, 1.2, "Rapid Metro Gurgaon","RMG", false});
    add("Sec 54 Chowk",    {"Sec 53-54",     2, 20, 1.2, "Rapid Metro Gurgaon","RMG", false});
    add("Sec 54 Chowk",    {"Sec 55-56",     2, 20, 1.1, "Rapid Metro Gurgaon","RMG", false});
    add("Sec 55-56",       {"Sec 54 Chowk",  2, 20, 1.1, "Rapid Metro Gurgaon","RMG", false});
    add("Sec 55-56",       {"Belvedere Towers", 2, 20, 1.0, "Rapid Metro Gurgaon","RMG", false});
    add("Belvedere Towers",{"Sec 55-56",     2, 20, 1.0, "Rapid Metro Gurgaon","RMG", false});
    add("Belvedere Towers",{"Cyber City",    2, 20, 1.1, "Rapid Metro Gurgaon","RMG", false});
    add("Cyber City",      {"Belvedere Towers", 2, 20, 1.1, "Rapid Metro Gurgaon","RMG", false});
    add("Cyber City",      {"Phase 3",       2, 20, 1.2, "Rapid Metro Gurgaon","RMG", false});
    add("Phase 3",         {"Cyber City",    2, 20, 1.2, "Rapid Metro Gurgaon","RMG", false});
    add("Phase 3",         {"Moulsari Avenue", 2, 20, 1.0, "Rapid Metro Gurgaon","RMG", false});
    add("Moulsari Avenue", {"Phase 3",       2, 20, 1.0, "Rapid Metro Gurgaon","RMG", false});
    add("Moulsari Avenue", {"Phase 2",       2, 20, 1.1, "Rapid Metro Gurgaon","RMG", false});
    add("Phase 2",         {"Moulsari Avenue", 2, 20, 1.1, "Rapid Metro Gurgaon","RMG", false});
    add("Phase 2",         {"Phase 1",       2, 20, 1.2, "Rapid Metro Gurgaon","RMG", false});
    add("Phase 1",         {"Phase 2",       2, 20, 1.2, "Rapid Metro Gurgaon","RMG", false});

    return g;
}
