cmake_minimum_required(VERSION 3.16)
project(MetroNavigator CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ─── Sources ────────────────────────────────────────────────────────────────
add_executable(metro
    src/main.cpp
    src/data/dmrc_data.cpp
    src/graph/Graph.cpp
    src/algorithms/bfs.cpp
    src/algorithms/dijkstra.cpp
    src/services/RouteService.cpp
    src/utils/Printer.cpp
)

# ─── Include dirs ───────────────────────────────────────────────────────────
target_include_directories(metro PRIVATE src)
