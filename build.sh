#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# build.sh — Compile DMRC Metro Navigator with clang++
# Usage:  ./build.sh        → compiles into ./metro
# ─────────────────────────────────────────────────────────────────
set -e

CXX="${CXX:-clang++}"
CXXFLAGS="-std=c++17 -O2 -Wall -Wextra -Isrc"
OUT="metro"
SRCS=(
    src/main.cpp
    src/data/dmrc_data.cpp
    src/graph/Graph.cpp
    src/algorithms/bfs.cpp
    src/algorithms/dijkstra.cpp
    src/services/RouteService.cpp
    src/utils/Printer.cpp
)

echo "Building DMRC Metro Navigator..."
"$CXX" $CXXFLAGS "${SRCS[@]}" -o "$OUT"
echo "Done!  Run with:  ./$OUT"
