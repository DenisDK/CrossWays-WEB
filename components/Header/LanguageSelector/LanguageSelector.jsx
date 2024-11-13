"use client";

import React, { useState, useTransition } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import FlagIcon from "./FlagIcon"; // Не забудьте створити компонент FlagIcon, якщо його ще немає
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

const LanguageSelector = () => {
  const t = useTranslations("LanguageSelector");
  const [language, setLanguage] = useState(useLocale()); // Використання початкової локалі
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const countryCodes = {
    en: "gb",
    ua: "ua",
  };

  const handleChange = (event) => {
    const nextLocale = event.target.value;

    startTransition(() => {
      setLanguage(nextLocale);
      router.replace({ pathname }, { locale: nextLocale });
    });
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
      <InputLabel>{t("selectorTitle")}</InputLabel>
      <Select
        value={language}
        onChange={handleChange}
        label={t("selectorTitle")}
        disabled={isPending}
        renderValue={(value) => (
          <span className="flex items-center">
            <FlagIcon countryCode={countryCodes[value]} />
            {value.toUpperCase()}
          </span>
        )}
      >
        {routing.locales.map((cur) => (
          <MenuItem key={cur} value={cur}>
            <FlagIcon countryCode={countryCodes[cur]} />
            {cur.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
