import { DataItem } from "../interfaces/dataTable";

// converted to a utility function to make it re-usable to other components
export const calcTotal = (items: DataItem[]) => items.reduce((sum, item) => sum + item.number, 0)
