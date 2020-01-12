import React, { useState } from "react";
import { Button } from "antd";
import PinPad from "./PinPad";

export const CheckInOut = ({ record, onCheckInOut }) => {
  const [isOpen, setOpen] = useState(false);
  const button =
    record.checkinTime && !record.checkoutTime ? (
      <Button style={{ backgroundColor: "#b71c1c", color: "white" }} onClick={() => setOpen(true)}>
        Kijelentkezés
      </Button>
    ) : (
      <Button style={{ backgroundColor: "#43a047", color: "white" }} onClick={() => setOpen(true)}>
        Bejelentkezés
      </Button>
    );

  const onSave = (comment) => {
    onCheckInOut(comment);
    setOpen(false);
  };

  return (
    <>
      <div style={{ textAlign: "right" }}>{button}</div>
      <PinPad isCheckout={record.checkinTime && !record.checkoutTime} pin={record.pin} onClose={() => setOpen(false)} isOpen={isOpen} onSave={onSave}></PinPad>
    </>
  );
};
