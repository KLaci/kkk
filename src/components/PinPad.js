import React, { useState, useEffect, useRef } from "react";
import { Input, Modal } from "antd";

export default ({ isOpen, onClose, pin, onSave, isCheckout }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [comment, setComment] = useState("");
  const pinRef = useRef(null);

  useEffect(() => {
    if (pinRef.current) pinRef.current.focus();
  }, [isOpen]);

  const onOk = () => {
    if (pin === currentPin) onSave(comment);
    else alert("Hibás PIN kód");

    setCurrentPin("");
    setComment("");
  };

  return (
    <Modal
      visible={isOpen}
      onCancel={() => {
        setCurrentPin("");
        setComment("");
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
        <div>
          <Input
            ref={pinRef}
            style={{ maxWidth: "100%", marginBottom: 16, marginTop: 16 }}
            placeholder="PIN"
            autoFocus={true}
            size={"large"}
            value={currentPin}
            onChange={e => setCurrentPin(e.target.value)}
          />
          {isCheckout && <Input placeholder="Megjegyzés" value={comment} onChange={e => setComment(e.target.value)}></Input>}
        </div>
      </div>
    </Modal>
  );
};
