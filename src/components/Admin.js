import React, { useEffect, useState, useContext } from "react";
import { loadAdminData, changeComment } from "../utils/dbService";
import { Input, Table, Button } from "antd";
import { SelectedDateContext } from "./App";
import Column from "antd/lib/table/Column";

const CommentField = ({ id, comment }) => {
    const [currentComment, setCurrentComment] = useState(comment);
    const [originalComment, setOriginalComment] = useState(comment);
    useEffect(() => {
        setCurrentComment(comment);
        setOriginalComment(comment);
    }, [comment, id]);

    const saveComment = async () => {
        await changeComment(id, currentComment);
        setOriginalComment(currentComment);
    };

    return (
        <div style={{ display: "flex" }}>
            <Input value={currentComment} onChange={c => setCurrentComment(c.target.value)}></Input>
            <Button disabled={originalComment === currentComment} style={{ marginLeft: 8 }} onClick={saveComment}>
                Mentés
            </Button>
        </div>
    );
};

export default () => {
    const [adminData, setAdminData] = useState([]);
    const { selectedMonth } = useContext(SelectedDateContext);
    useEffect(() => {
        loadAdminData(selectedMonth).then(setAdminData);
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
                render={(comment, { id }) => <CommentField comment={comment} id={id}></CommentField>}
            />
        </Table>
    );
};
