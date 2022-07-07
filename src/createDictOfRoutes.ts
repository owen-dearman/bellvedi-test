import { TrackInfo } from "./convertCsvToJavaScriptObject";
import { dictType } from "./findShortestPath";

/*
Parameters: DATABASE (the JS object of the csv file)
Returns: DICT of type dictType

set DICT as an empty object
for each ROW of the DATABASE do
  set ROUTE-DESTINATIONS to be an empty array 
  set ENDPOINTS to be an array of tracks away from the current ROW's tracks
  map through ENDPOINTS to create the DATA-OBJECT for possible destination from ROW
    DATA-OBJECT = {name: ENDPOINT-NAME, weight: DISTANCE-FROM-ROW }
    push DATA-OBJECT to ROUTE-DESTINATIONS
  end map

  add ROUTE-DESTINATIONS, ROW-NAME, and set ROW-WEIGHT as 1 into the DICT
  {name: ROW-NAME, nodes: ROUTE-DESTINATIONS, weight: ROW-WEIGHT}
end for

return DICT
*/

export type OnwardsRoute = { name: string; weight: number };

/**
 *
 * @param database JavaScript Object of csv data
 * @returns dictionary of each station with name, onward stations and weight
 */

export function createDictOfRoutes(database: TrackInfo[]): dictType {
  //an empty object with type assertion
  const dict = {} as dictType;

  for (const node of database) {
    let routeDestinations: OnwardsRoute[] = [];
    //get onward stations from current node
    const onwardStationsArr = filterDatabaseForOnwardTracks(node, database);
    //push the relevant info in the required format to routeDestinations
    onwardStationsArr.forEach((station) => {
      routeDestinations.push(convertDestinationToDictFormat(station));
    });

    routeDestinations = removeDuplicates(routeDestinations);

    //add all information for node into the dictionary with a default weight
    dict[node.FROM_TIPLOC] = {
      name: node.FROM_TIPLOC,
      nodes: routeDestinations,
      weight: 1,
    };
  }
  return dict;
}

function removeDuplicates(nodes: OnwardsRoute[]): OnwardsRoute[] {
  const newArr: OnwardsRoute[] = [];
  for (const n of nodes) {
    if (newArr.filter((x) => x.name === n.name).length < 1) {
      newArr.push(n);
    }
  }
  return newArr;
}

/**
 *
 * @param currentStation current node
 * @param databaseOfStations database of nodes
 * @returns array of routes from database that start at current node
 */

function filterDatabaseForOnwardTracks(
  currentStation: TrackInfo,
  databaseOfStations: TrackInfo[],
): TrackInfo[] {
  const currentStationName = currentStation.FROM_TIPLOC;
  //return array of stations with a starting point of the same name as the current station
  return databaseOfStations.filter(
    (track) => track.FROM_TIPLOC === currentStationName,
  );
}

/**
 *
 * @param node onwards route
 * @returns name and weight of destination station
 */

function convertDestinationToDictFormat(node: TrackInfo): OnwardsRoute {
  const distance = parseFloat(node.DISTANCE);
  const name = node.TO_TIPLOC;
  return { name: name, weight: distance };
}
