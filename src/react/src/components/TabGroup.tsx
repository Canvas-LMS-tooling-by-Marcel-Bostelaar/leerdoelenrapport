import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState, type ReactElement } from "react";

type TabGroupProps = {
    names: string[];
    children: ReactElement[];
}

export function TabGroup({children, names} : TabGroupProps){
    const [tabIndex, setTabIndex] = useState('1');

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setTabIndex(newValue);
    };

    if(names.length !== children.length){
        throw new Error("Number of names must match number of children");
    }

    return (
        <TabContext value={tabIndex}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                {
                    names.map((name, index) => (
                        <Tab key={index} label={name} value={(index + 1).toString()} />
                    ))
                }
                </TabList>
            </Box>
            {
                children.map((child, index) => (
                    <TabPanel key={index} value={(index + 1).toString()}>{child}</TabPanel>
                ))
            }
        </TabContext>
    );
}