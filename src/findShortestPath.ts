import {
  convertCsvToJavaScriptObject,
  TrackInfo,
} from "./convertCsvToJavaScriptObject";
import { createDictOfRoutes, OnwardsRoute } from "./createDictOfRoutes";

/*
Parameters: 
START string
END string

set REMANING-NODES to be an empty array
set NODES as the dictionary of nodes
find START in NODE and set its weight to 0, with all others a large number (infinity??)
add all NODE-NAMES to REMAINING-NODES

while REMAINING-NODES is not empty
  sort REMAINING-NODES from smallest weight to highest weight
  set CURRENT-NODE to the first element from REMAINING-NODES
  for DESTINATION-NODES of CURRENT-NODE
    add DESTINATION-NODE-WEIGHT to CURRENT-NODE-WEIGHT
    if this is less than the DESINATION-NODEs weight in NODES then the path from start is now shorter
      update NODES[DESTINATION-NODE].weight to be the lower weight
    end if
  remove CURRENT-NODE from REMAINING NODES
  end for
end while

set SHORTEST-DISTANCE to be the weight of NODES[END]
find each station along this route
the length of this array will be the number of tracks
return all of the above.
*/

export type dictType = {
  [key: string]: {
    name: string;
    nodes: OnwardsRoute[];
    weight: number;
  };
};

type Results = {
  start: string;
  end: string;
  distance: number;
  tracks: number;
  stations: string[];
};

/**
 *
 * @param start starting node
 * @param end ending node
 * @returns results array
 */

export function findShortestPath(start: string, end: string): Results {
  const database = convertCsvToJavaScriptObject("./tracks.csv");
  const nodes = convertDataToGraphFormat(database);
  const remainingNodes: string[] = [];

  //set up the weights based on starting point
  for (const station in nodes) {
    if (nodes[station].name === start.toUpperCase()) {
      nodes[station].weight = 0;
    } else {
      nodes[station].weight = Infinity;
    }
    remainingNodes.push(nodes[station].name);
  }

  //loop until all nodes have been visited
  while (remainingNodes.length > 0) {
    //sort remaining nodes in ascending order (lowest first)
    const remainingNodesSortedByWeight: string[] = remainingNodes.sort(
      (a, b) => nodes[a].weight - nodes[b].weight,
    );

    //set current node
    const currentNode = nodes[remainingNodesSortedByWeight[0]];

    //for onwards nodes of current node, set it's weight if shorter than previous weight
    for (const desinationNode of currentNode.nodes) {
      const nameOfStation = desinationNode.name;
      if (nameOfStation !== undefined) {
        const cumulativeWeight = currentNode.weight + desinationNode.weight;
        const existingWeight = nodes[nameOfStation].weight;
        if (cumulativeWeight < existingWeight) {
          nodes[nameOfStation].weight = cumulativeWeight;
        }
      }
    }
    //remove it from the remaining nodes array
    const indexToRemove = remainingNodes.findIndex(
      (node) => node === remainingNodesSortedByWeight[0],
    );
    indexToRemove !== -1 && remainingNodes.splice(indexToRemove, 1);
  }

  const distanceFromStartToEnd: number = nodes[end].weight;
  //find shortest route through the graph with all distances from start set
  const stationsAlongRoute: string[] = findPointsAlongShortestRoute(
    start,
    end,
    nodes,
  ).reverse();
  const noTracks = stationsAlongRoute.length;
  stationsAlongRoute.push(end);
  return {
    start: start,
    end: end,
    distance: distanceFromStartToEnd / 1000,
    tracks: noTracks,
    stations: stationsAlongRoute,
  };
}

function findPointsAlongShortestRoute(
  start: string,
  end: string,
  nodes: dictType,
): string[] {
  let nextNode: string = end;
  const pointsAlongRoute: string[] = [];
  //picks the shortest route from start each time
  let counter = 0;
  //HAVE ADDED COUNTER DUE TO INFINITE LOOP ON JOURNEYS WHERE THE ALGORITHM GETS STUCK BETWEEN TWO STATIONS
  while (nextNode !== start && counter < 40) {
    //reset minWeight and currentStation
    let minWeight = Infinity;
    let currentStation = "";
    //find onwards routes
    for (const desinationNode of nodes[nextNode].nodes) {
      // onwards node's distance from start + distance to current node
      const cumulativeWeight =
        desinationNode.weight + nodes[desinationNode.name].weight;
      if (
        cumulativeWeight < minWeight &&
        desinationNode.weight > 0 &&
        !pointsAlongRoute.includes(desinationNode.name)
      ) {
        minWeight = nodes[desinationNode.name].weight;
        currentStation = desinationNode.name;
      }
    }
    //push the shortest
    pointsAlongRoute.push(currentStation);
    nextNode = currentStation;
    counter++;
  }

  return pointsAlongRoute;
}

function convertDataToGraphFormat(database: TrackInfo[]) {
  return createDictOfRoutes(database);
}
