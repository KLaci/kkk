import React, { useState } from "react";
import employees from "./employees.json";
import { Table } from "antd";
import { CheckInOut } from "./CheckInOut";
import dataService from "../utils/dataService";

const columns = [
  {
    title: "Név",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Bejelentkezési idő",
    dataIndex: "checkinTime",
    key: "checkinTime",
    render: checkinTime => {
      return (
        <span>{checkinTime && checkinTime.toLocaleTimeString("hu-HU")}</span>
      );
    }
  },
  {
    title: "Kijelentkezési idő",
    dataIndex: "checkoutTime",
    key: "checkoutTime",
    render: checkoutTime => {
      return (
        <span>{checkoutTime && checkoutTime.toLocaleTimeString("hu-HU")}</span>
      );
    }
  },
  {
    title: "Havi összes idő",
    dataIndex: "sumTime",
    key: "sumTime",
    render: sumTime => {
      const seconds = sumTime / 1000;
      const minutes = seconds / 60;
      const hours = minutes / 60;
      return sumTime ? (
        <span>
          {Math.floor(hours)} óra, {Math.floor(minutes) % 60} perc
        </span>
      ) : (
        <span>Nincs bejegyzett óra a hónapban</span>
      );
    }
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    render: (_, record) => {
      return <CheckInOut record={record}></CheckInOut>;
    }
  }
];

const latestEntries = dataService.loadData();

export default () => {
  const onCheckInOut = record => {
    let newRecord = {
      ...record
    };

    const isCheckout = record.checkinTime && !record.checkoutTime;

    if (isCheckout) {
      newRecord.checkoutTime = new Date();
      dataService.addEntry(newRecord);
    } else {
      newRecord.checkinTime = new Date();
      newRecord.checkoutTime = null;
    }

    setData(data.map(d => (d.name === newRecord.name ? newRecord : d)));
  };

  const [data, setData] = useState(
    employees.map(p => ({
      ...latestEntries[p.name],
      name: p.name,
      pin: p.pin,
      onCheckInOut
    }))
  );

  return (
    <div>
      <Table dataSource={data} columns={columns} />;
    </div>
  );
};
