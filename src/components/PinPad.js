import React, { useState, useEffect } from "react";
import { InputNumber, Modal } from "antd";

export default ({ isOpen, onClose, pin, onSave }) => {
  const [currentPin, setCurrentPin] = useState("");

  const onOk = () => {
    if (pin === currentPin) onSave();
    else alert("Hibás PIN kód");

    setCurrentPin("");
  };

  return (
    <Modal
      visible={isOpen}
      onCancel={() => {
        setCurrentPin("");
        onClose();
      }}
      cancelText="Mégsem"
      onOk={onOk}
      style={{ maxWidth: 240 }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h3>PIN</h3>
        <div>
          <InputNumber
            autoFocus={true}
            size={"large"}
            min={1}
            max={9999}
            value={currentPin}
            onChange={setCurrentPin}
          />
        </div>
      </div>
    </Modal>
  );
};
