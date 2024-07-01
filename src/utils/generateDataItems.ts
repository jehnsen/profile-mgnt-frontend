import { DataItem } from "../interfaces/dataTable";

// Generates a large array of data items for demonstration purposes, do not need to modify.
export const generateDataItems = (count: number): DataItem[] => {
    return Array.from({ length: count }, (v, k) => ({
        id: k,
        value: `Item ${k}`,
        number: Math.floor(Math.random() * 100),
    }));
};