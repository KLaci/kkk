import React, { useState } from "react";
import { Button } from "antd";
import PinPad from "./PinPad";

export const CheckInOut = ({ record }) => {
  const [isOpen, setOpen] = useState(false);
  const button = record.checkinTime && !record.checkoutTime ? (
    <Button
      style={{ backgroundColor: "#b71c1c", color: "white" }}
      onClick={() => setOpen(true)}
    >
      Kijelentkezés
    </Button>
  ) : (
    <Button
      style={{ backgroundColor: "#43a047", color: "white" }}
      onClick={() => setOpen(true)}
    >
      Bejelentkezés
    </Button>
  );

  const onSave = () => {
    record.onCheckInOut(record);
    setOpen(false);
  };

  return (
    <>
      <div style={{ textAlign: "right" }}>{button}</div>
      <PinPad
        pin={record.pin}
        onClose={() => setOpen(false)}
        isOpen={isOpen}
        onSave={onSave}
      ></PinPad>
    </>
  );
};
