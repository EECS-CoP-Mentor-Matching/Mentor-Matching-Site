import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import selectionItemsDb from "../../../../../dal/selectionItemsDb";
import { TimeZone } from "../../../../../types/userProfile";
import { DocItem } from "../../../../../types/types";

interface AdminSelectTimeZoneProps {
    value: string,
    onChange: (value: string) => void;
}

function AdminSelectTimeZone() {
    return(<></>)
}

export default AdminSelectTimeZone;