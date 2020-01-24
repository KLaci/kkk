import React, { useEffect, useState, useContext } from "react";
import { loadAdminData } from "../utils/dataService";
import { Input } from "antd";
import { SelectedDateContext } from "./App";

const AdminRow = ({ data }) => {
  return (
    <tr>
      <td>{data.name}</td>
      <td>{data.checkinTime && data.checkinTime.toLocaleTimeString("hu-HU")}</td>
      <td>{data.checkoutTime && data.checkoutTime.toLocaleTimeString("hu-HU")}</td>
      <td>
        <Input value={data.comment}></Input>
      </td>
    </tr>
  );
};

export default () => {
  const [adminData, setAdminData] = useState([]);
  const { selectedMonth } = useContext(SelectedDateContext);
  useEffect(() => {
    setAdminData(loadAdminData(selectedMonth));
  }, [selectedMonth]);

  return (
    <table>
      <thead>
        <tr>
          <th>Név</th>
          <th>Bejelentkezési idő</th>
          <th>Kijelentkezési idő</th>
          <th>Megjegyzés</th>
        </tr>
      </thead>
      <tbody>
        {adminData.map((d, index) => (
          <AdminRow key={index} data={d}></AdminRow>
        ))}
      </tbody>
    </table>
  );
};
