import React, { useState, useEffect, useContext } from "react";
import { Button } from "antd";
import { Select } from "antd";
import PinPad from "./PinPad";
import { exportData } from "../utils/dataService";
import { SelectedDateContext } from "./App";
import { loadConfig } from "../utils/configService";
const { Option } = Select;
const { dialog } = window.require("electron").remote;

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

const dateFormatter = new Intl.DateTimeFormat("hu-HU", { month: "long" });

const DateExporter = () => {
    const [months, setMonths] = useState([]);
    const { selectedMonth, setSelectedMonth } = useContext(SelectedDateContext);

    useEffect(() => {
        const date = new Date();
        const newMonths = [];
        let year = date.getFullYear();
        for (let i = year - 1; i < year + 1; i++) {
            for (let j = 0; j < 12; j++) {
                newMonths.push(new Date(i, j, 1));
            }
        }
        setSelectedMonth(newMonths.find(m => m.getFullYear() === new Date().getFullYear() && m.getMonth() === new Date().getMonth()));
        setMonths(newMonths);
    }, [setSelectedMonth]);

    const onExportData = () => {
        const fileName = dialog.showSaveDialogSync({ defaultPath: `${selectedMonth.getFullYear()}-${selectedMonth.getMonth() + 1}.csv` });
        if (fileName) exportData(selectedMonth, fileName);
    };

    const handleChange = m => {
        setSelectedMonth(new Date(m));
    };

    return (
        <div style={{ display: "flex" }}>
            <Select value={selectedMonth?.toString()} style={{ width: 160 }} onChange={handleChange}>
                {months.map(m => (
                    <Option value={m.toString()} key={`${m.getFullYear()}.${m.getMonth()}`}>
                        {m.getFullYear()}. {dateFormatter.format(m)}
                    </Option>
                ))}
            </Select>
            <Button style={{ marginLeft: 16 }} type="danger" onClick={onExportData}>
                Havi adatok exportálása
            </Button>
        </div>
    );
};

const config = loadConfig();

export default ({ activeWindow, to }) => {
    const [isOpen, setOpen] = useState(false);

    const onAdminClick = () => {
        to("admin");
        setOpen(false);
    };

    return (
        <div
            style={{
                display: "flex",
                marginBottom: 16,
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <div style={{ display: "flex" }}>
                {activeWindow === "normal" && (
                    <Button type="primary" onClick={() => setOpen(true)}>
                        Admin
                    </Button>
                )}
                {activeWindow === "admin" && (
                    <Button type="primary" onClick={() => to("normal")}>
                        Lista
                    </Button>
                )}
            </div>

            {activeWindow === "admin" && <DateExporter></DateExporter>}

            <PinPad isCheckout={false} pin={config.adminPin} onClose={() => setOpen(false)} isOpen={isOpen} onSave={onAdminClick}></PinPad>
            <DateComponent></DateComponent>
        </div>
    );
};
