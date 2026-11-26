#include "Graph.hpp"
#include "Haversine.hpp"

#include <cassert>
#include <cmath>
#include <iostream>
#include <vector>

int main() {
    // 1. Haversine test (JFK -> LAX ~ 3974 km)
    const double jfkLax = flight::haversineDistanceKm(40.6413, -73.7781, 33.9416, -118.4085);
    assert(jfkLax > 3900.0 && jfkLax < 4050.0);

    // 2. Academic sample graph: A -> C -> B -> D (500 km) beats A -> B -> D (550 km)
    flight::AirportGraph sampleGraph;
    sampleGraph.addAirport({"A", "Airport A", "", "", 38.0, -93.5, true});
    sampleGraph.addAirport({"B", "Airport B", "", "", 37.5, -92.3, true});
    sampleGraph.addAirport({"C", "Airport C", "", "", 37.2, -92.5, true});
    sampleGraph.addAirport({"D", "Airport D", "", "", 38.9, -91.0, true});

    sampleGraph.addRoute({"A", "B", 300.0, 45, 6, 0, true});
    sampleGraph.addRoute({"B", "D", 250.0, 40, 6, 0, true});
    sampleGraph.addRoute({"A", "C", 200.0, 35, 5, 0, true});
    sampleGraph.addRoute({"C", "D", 400.0, 55, 4, 0, true});
    sampleGraph.addRoute({"C", "B", 50.0, 20, 7, 0, true});

    const auto d = flight::runDijkstra(sampleGraph, "A", "D", flight::ObjectiveMode::Distance);
    assert(d.found);
    assert(std::abs(d.totalCost - 500.0) < 1e-6);
    assert((d.path == std::vector<std::string>{"A", "C", "B", "D"}));

    // 3. Minimum stops objective prefers A -> B -> D (2 edges)
    const auto stopsRes = flight::runDijkstra(sampleGraph, "A", "D", flight::ObjectiveMode::Stops);
    assert(stopsRes.found);
    assert(std::abs(stopsRes.totalCost - 2.0) < 1e-6);
    assert(stopsRes.path.size() == 3);

    // 4. Same source & destination
    const auto same = flight::runDijkstra(sampleGraph, "A", "A");
    assert(same.found && same.totalCost == 0.0 && same.path.size() == 1);

    // 5. Disconnected node handling
    sampleGraph.addAirport({"Z", "Isolated", "", "", 10.0, 10.0, true});
    const auto disconnected = flight::runDijkstra(sampleGraph, "A", "Z");
    assert(!disconnected.found);

    std::cout << "All C++17 Dijkstra flight engine unit tests passed.\n";
    return 0;
}
