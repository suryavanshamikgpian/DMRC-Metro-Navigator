// ─────────────────────────────────────────────────────────────────
// PriorityQueue.h — Min-priority queue for Dijkstra
// ─────────────────────────────────────────────────────────────────
// WHY: Dijkstra must always expand the node with the lowest
//      accumulated cost. std::priority_queue is a max-heap by
//      default, so we use a greater<> comparator to flip it into
//      a min-heap.
//
//      Element type: pair<double cost, string station>
// ─────────────────────────────────────────────────────────────────
#pragma once

#include <queue>
#include <string>
#include <utility>
#include <functional>

// Entry in the priority queue
struct PQEntry {
    double      cost;
    std::string station;

    // Min-heap: lower cost = higher priority
    bool operator>(const PQEntry& other) const {
        return cost > other.cost;
    }
};

class PriorityQueue {
public:
    void enqueue(const std::string& station, double cost) {
        pq_.push({cost, station});
    }

    PQEntry dequeue() {
        PQEntry top = pq_.top();
        pq_.pop();
        return top;
    }

    bool isEmpty() const {
        return pq_.empty();
    }

private:
    std::priority_queue<PQEntry,
                        std::vector<PQEntry>,
                        std::greater<PQEntry>> pq_;
};
