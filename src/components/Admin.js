import React, { useEffect, useState, useContext } from "react";
import { loadAdminData } from "../utils/dataService";
import { Input, Table } from "antd";
import { SelectedDateContext } from "./App";
import Column from "antd/lib/table/Column";

const AdminRow = ({ data }) => {
    return (
        <tr>
            <td>{data.name}</td>
            <td>{data.checkinTime && data.checkinTime.toLocaleDateString("hu-HU")}</td>
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
        <Table dataSource={adminData} style={{ width: "100%" }}>
            <Column title="Név" dataIndex="name" key="name" sorter={(a, b) => a.name.localeCompare(b.name)} sortDirections={["descend", "ascend"]} />
            <Column
                title="Nap"
                dataIndex="checkinTime"
                key="checkinDate"
                render={time => {
                    return <span>{time && time.toLocaleDateString("hu-HU")}</span>;
                }}
            />
            <Column
                title="Bejelentkezési idő"
                dataIndex="checkinTime"
                key="checkinTimeTime"
                render={time => {
                    return <span>{time && time.toLocaleTimeString("hu-HU")}</span>;
                }}
            />
            <Column
                title="Kijelentkezési idő"
                dataIndex="checkoutTime"
                key="checkoutTime"
                render={time => {
                    return <span>{time && time.toLocaleTimeString("hu-HU")}</span>;
                }}
            />
            <Column
                title="Megjegyzés"
                dataIndex="comment"
                key="comment"
                render={comment => {
                    return <Input value={comment}></Input>;
                }}
            />
        </Table>
    );
};
