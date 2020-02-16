import React, { useEffect, useState } from "react";
import { loadData } from "../utils/dbService";
import { Table } from "antd";
import Column from "antd/lib/table/Column";
import { addEntry, calculateSum, calculateDailySum, cachedEntries } from "../utils/dbService";
import { CheckInOut } from "./CheckInOut";

const SumTime = ({ sumTime, emptyText }) => {
    if (!sumTime) return <span>{emptyText}</span>;
    const seconds = sumTime / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;

    return (
        <span>
            {Math.floor(hours)} óra, {Math.floor(minutes) % 60} perc
        </span>
    );
};

export default () => {
    const [records, setRecords] = useState([]);
    useEffect(() => {
        loadData().then(d => {
            setRecords(d);
        });
    }, []);

    const setModifiedEmployee = employee => {
        setRecords(records.map(r => (r.name === employee.name ? employee : r)));
    };

    return (
        <Table dataSource={records} style={{ width: "100%" }}>
            <Column title="Név" dataIndex="name" key="name" sorter={(a, b) => a.name.localeCompare(b.name)} sortDirections={["descend", "ascend"]}></Column>
            <Column
                title="Bejelentkezési idő"
                dataIndex="checkinTime"
                key="checkinDate"
                render={time => {
                    return <span>{time && time.toLocaleTimeString("hu-HU")}</span>;
                }}
            ></Column>
            <Column
                title="Kijelentkezési idő"
                dataIndex="checkoutTime"
                key="checkoutTime"
                render={time => {
                    return <span>{time && time.toLocaleTimeString("hu-HU")}</span>;
                }}
            ></Column>
            <Column
                title="Napi órák"
                dataIndex="dailySumTime"
                key="dailySumTime"
                render={time => {
                    return <SumTime sumTime={time} emptyText={"Nincs bejegyzett óra a napon"}></SumTime>;
                }}
            ></Column>
            <Column
                title="Havi órák"
                dataIndex="sumTime"
                key="sumTime"
                render={time => {
                    return <SumTime sumTime={time} emptyText={"Nincs bejegyzett óra a hónapban"}></SumTime>;
                }}
            ></Column>
            <Column
                title=""
                dataIndex="action"
                key="action"
                render={(_, employee) => {
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
                        newRecord.dailySumTime = calculateDailySum(employee.name, cachedEntries);
                        setModifiedEmployee(newRecord);
                    };

                    return <CheckInOut record={employee} onCheckInOut={onCheckInOut}></CheckInOut>;
                }}
            ></Column>
        </Table>
    );
};
