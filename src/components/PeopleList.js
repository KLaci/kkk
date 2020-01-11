import React, { useState } from "react";
import employees from "./employees.json";
import { Table } from "antd";
import { CheckInOut } from "./CheckInOut";

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
    key: "sumTime"
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

export default () => {
  const onCheckInOut = record => {
    console.log("TCL: data", data);
    let newRecord = {
      ...record
    };

    if (newRecord.checkinTime) {
      newRecord.checkoutTime = new Date();
    } else {
      newRecord.checkinTime = new Date();
    }

    setData(data.map(d => (d.name === record.name ? newRecord : d)));
  };

  const [data, setData] = useState(
    employees.map(p => ({ name: p.name, pin: p.pin, onCheckInOut }))
  );

  return (
    <div>
      <Table dataSource={data} columns={columns} />;
    </div>
  );
};
