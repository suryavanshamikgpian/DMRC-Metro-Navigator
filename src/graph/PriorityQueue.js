// ─────────────────────────────────────────────────────────────────
// PriorityQueue.js — Simple min-priority queue for Dijkstra
// ─────────────────────────────────────────────────────────────────
// WHY:  Dijkstra needs to always process the station with the
//       LOWEST accumulated cost next. A normal array (FIFO) can't
//       do that. This queue keeps items sorted by priority so
//       dequeue() always returns the cheapest/fastest option.
//
// HOW:  Internally just a sorted array. Not the fastest approach
//       (a binary heap would be O(log n)), but it's readable and
//       plenty fast for 223 stations.
// ─────────────────────────────────────────────────────────────────

class PriorityQueue {

    constructor() {
        this.items = [];
    }

    /**
     * Add an item with a given priority (lower = higher urgency).
     * @param {*} element — the data (e.g. a station name)
     * @param {number} priority — the cost so far
     */
    enqueue(element, priority) {
        const entry = { element, priority };

        // Find the right position to insert (keep sorted)
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (entry.priority < this.items[i].priority) {
                this.items.splice(i, 0, entry);
                added = true;
                break;
            }
        }

        // If it has the highest cost, add at the end
        if (!added) {
            this.items.push(entry);
        }
    }

    /**
     * Remove and return the item with the lowest priority.
     * @returns {{ element, priority }} or undefined if empty
     */
    dequeue() {
        return this.items.shift();
    }

    /**
     * Check if the queue is empty.
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    }
}

module.exports = PriorityQueue;
