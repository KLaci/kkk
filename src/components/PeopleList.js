import React, { useEffect, useState } from "react";
import { loadData } from "../utils/dbService";
import PersonRow from "./PersonRow";

export default () => {
    const [records, setRecords] = useState([]);
    useEffect(() => {
        loadData().then(d => {
            setRecords(d);
        });
    }, []);

    return (
        <table style={{ width: "100%" }}>
            <thead>
                <tr>
                    <th>Név</th>
                    <th>Bejelentkezési idő</th>
                    <th>Kijelentkezési idő</th>
                    <th>Havi órák</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {records.map(entry => (
                    <PersonRow key={entry.name} entry={entry}></PersonRow>
                ))}
            </tbody>
        </table>
    );
};
