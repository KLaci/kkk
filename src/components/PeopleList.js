import React from "react";
import { loadData } from "../utils/dataService";
import PersonRow from "./PersonRow";

const latestEntries = loadData();

export default () => {
  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Név</th>
          <th>Bejelentkezési idő</th>
          <th>Kijelentkezési idő</th>
          <th>Havi órák</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {latestEntries.map(entry => (
          <PersonRow key={entry.name} entry={entry}></PersonRow>
        ))}
      </tbody>
    </table>
  );
};
