import React, { useState } from "react";
import { CheckInOut } from "./CheckInOut";
import { addEntry, calculateSum, cachedEntries } from "../utils/dataService";

export default ({ entry }) => {
  const [employee, setEmployee] = useState(entry);
  const onCheckInOut = comment => {
    const isCheckout = employee.checkinTime && !employee.checkoutTime;

    const newRecord = { ...employee };
    if (isCheckout) {
      newRecord.checkoutTime = new Date();
      newRecord.comment = comment;
      addEntry(newRecord);
    } else {
      newRecord.checkinTime = new Date();
      newRecord.checkoutTime = null;
    }

    newRecord.sumTime = calculateSum(employee.name, cachedEntries);
    setEmployee(newRecord);
  };

  const seconds = employee.sumTime / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;

  return (
    <tr>
      <td>{employee.name}</td>
      <td>{employee.checkinTime && employee.checkinTime.toLocaleTimeString("hu-HU")}</td>
      <td>{employee.checkoutTime && employee.checkoutTime.toLocaleTimeString("hu-HU")}</td>
      {employee.sumTime ? (
        <td>
          {Math.floor(hours)} óra, {Math.floor(minutes) % 60} perc
        </td>
      ) : (
        <td>Nincs bejegyzett óra a hónapban</td>
      )}
      <td>
        <CheckInOut record={employee} onCheckInOut={onCheckInOut}></CheckInOut>
      </td>
    </tr>
  );
};
