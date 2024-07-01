import { DataItem } from "../interfaces/dataTable";
import { IUserProfile } from "../interfaces/userProfile";

// converted to a utility function to make it re-usable to other components
export const calcTotal = (items: DataItem[]) => items.reduce((acc, item) => acc + item.number, 0)

// input validation
export const validateInput = (profile: IUserProfile, setErrors: (errors: { [key: string]: string }) => void): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!profile.name) newErrors.name = "Name is required";
    if (!profile.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profile.email)) newErrors.email = "Email is invalid";
    if (!profile.age) newErrors.age = "Age is required";
    else if (profile.age <= 0) newErrors.age = "Age must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};