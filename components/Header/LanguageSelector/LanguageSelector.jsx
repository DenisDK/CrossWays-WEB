import React, { useState } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import FlagIcon from "./FlagIcon";

const LanguageSelector = () => {
  const [language, setLanguage] = useState("EN");

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  const countryCodes = {
    EN: "gb",
    UA: "ua",
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
      <InputLabel>Language</InputLabel>
      <Select
        value={language}
        onChange={handleChange}
        label="Language"
        renderValue={(value) => (
          <span className="flex items-center">
            <FlagIcon countryCode={countryCodes[value]} />
            {value}
          </span>
        )}
      >
        <MenuItem value="EN">
          <FlagIcon countryCode="gb" />
          EN
        </MenuItem>
        <MenuItem value="UA">
          <FlagIcon countryCode="ua" />
          UA
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
