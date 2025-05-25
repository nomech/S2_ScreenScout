import { useEffect, useState } from "react";
import styles from "./FilterPanel.module.css";

import Button from "../Button/Button";

const FilterPanel = ({ setFilterParameters }) => {
    const [year, setYear] = useState();
    const [adult, setAdult] = useState(false);

    const handleOnChangeYear = (e) => {
        const value = e.target.value;
        setYear(value);
        setFilterParameters((previous) => {
            return {
                ...previous,
                year: value,
            };
        });
    };

    const handleOnChangeAdult = (e) => {
        const checked = e.target.checked;
        setAdult(checked);
        setFilterParameters((previous) => {
            return {
                ...previous,
                include_adult: checked,
            };
        });
    };

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        if (!year) {
            setYear(currentYear);
        }
    }, [currentYear, year]);

    return (
        <div className={styles.filterPanel}>
            <div className={styles.year}>
                <label htmlFor="range">
                    <h3>Release Year</h3>
                </label>
                <input
                    type="range"
                    value={year}
                    onChange={(e) => handleOnChangeYear(e)}
                    min="1920"
                    max={currentYear + 2}
                    className={styles.yearRange}
                    id="yearRange"
                    name="yearRange"
                    step="1"
                />
                <p>{year}</p>
            </div>

            <div className={styles.adultContent}>
                <label htmlFor="adult">
                    <h3>Adult Content (NSFW)</h3>
                </label>
                <input
                    type="checkbox"
                    id="adult"
                    name="adult"
                    value={adult}
                    onChange={(e) => handleOnChangeAdult(e)}
                />
            </div>
            <Button className="clearButton">Reset</Button>
        </div>
    );
};

export default FilterPanel;
