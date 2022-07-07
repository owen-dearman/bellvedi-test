import path from "path";
import { readFileSync } from "fs";

type DataOptions =
  | "FROM_TIPLOC"
  | "TO_TIPLOC"
  | "DISTANCE"
  | "ELECTRIC"
  | "PASSENGER_USE"
  | "LINE_CODE";

export interface TrackInfo {
  FROM_TIPLOC: string;
  TO_TIPLOC: string;
  DISTANCE: string;
  ELECTRIC: string;
  PASSENGER_USE: string;
  LINE_CODE: string;
}

/**
 *
 * @param file route path of csv file
 * @returns JS object of csv file
 */

export function convertCsvToJavaScriptObject(file: string): TrackInfo[] {
  const filePath = path.join(__dirname, file);
  const csvArray = readFileSync(filePath).toString().split("\r\n");
  //get keys from header row of CSV file
  const headers = csvArray[0].split(",");

  const computedArr: TrackInfo[] = [];

  for (let i = 1; i < csvArray.length; i++) {
    const row = csvArray[i];
    const computedObject: { [key in DataOptions]: string } = {
      FROM_TIPLOC: "",
      TO_TIPLOC: "",
      DISTANCE: "",
      ELECTRIC: "",
      PASSENGER_USE: "",
      LINE_CODE: "",
    };

    //split the data up
    const valuesArr = row.split(",");

    //loop through the headers and find corresponding value
    for (let j = 0; j < headers.length; j++) {
      if (valuesArr[j] !== undefined) {
        const { key, value } = mapKeysToValues(headers, valuesArr, j);
        computedObject[key as keyof TrackInfo] = value;
      }
    }
    computedArr.push(computedObject);
  }
  return computedArr;
}

/**
 *
 * @param keyArr array of keys
 * @param valueArr array of values
 * @param index index to pick from each array
 * @returns matched key:value pair
 */

function mapKeysToValues(
  keyArr: string[],
  valueArr: string[],
  index: number,
): { key: string; value: string } {
  const key = keyArr[index];
  const value = valueArr[index];
  return { key: key, value: value };
}
