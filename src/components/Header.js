import React, { useState, useEffect } from "react";
import { Button } from "antd";

const DateComponent = () => {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div style={{}}>{date.toLocaleString("hu-HU")}</div>;
};

export default () => {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: 16,
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Button type="primary">Admin</Button>
      <DateComponent></DateComponent>
    </div>
  );
};
