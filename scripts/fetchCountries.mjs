import fs from "fs";
import path from "path";

const fetchCountries = async () => {
    try {
        console.log("Fetching countries from REST Countries API (French)...");
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags,translations");
        const data = await response.json();

        const formatted = data
            .filter((c) => c.idd && c.idd.root)
            .map((c) => {
                const root = c.idd.root;
                const suffixes = c.idd.suffixes || [""];
                const code = suffixes.length === 1 ? root + suffixes[0] : root;

                // Use French name if available, fallback to common name
                const name = c.translations?.fra?.common || c.name.common;
                const flagUrl = `https://flagcdn.com/w40/${c.cca2.toLowerCase()}.png`;

                return {
                    name: name,
                    code: code,
                    iso: c.cca2,
                    flagUrl: flagUrl
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));

        const content = `export interface Country {
  name: string;
  code: string;
  iso: string;
  flagUrl: string;
}

export const countries: Country[] = ${JSON.stringify(formatted, null, 2)};
`;

        const outputPath = path.resolve("lib/constants/countries.ts");
        fs.writeFileSync(outputPath, content);
        console.log(`Successfully generated ${formatted.length} countries in French with flag URLs in ${outputPath}`);
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
};

fetchCountries();
