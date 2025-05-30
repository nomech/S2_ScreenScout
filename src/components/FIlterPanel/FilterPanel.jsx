import { useEffect, useState } from "react";
import styles from "./FilterPanel.module.css";
import reset from "../../assets/icons/reset.svg";

import Button from "../Button/Button";

// This component provides a filter panel for selecting the release year and adult content preference.
const FilterPanel = ({ setFilterParameters }) => {
    // Hooks to manage state and side effects
    const [year, setYear] = useState();
    const [adult, setAdult] = useState(false);

    // Handlers for changing filter parameters
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

    // Handler for toggling adult content filter
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

    // Get the current year to set year filter default value
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
                {/* Range input for selecting the release year */}
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

            {/* Checkbox for filtering adult content */}
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

            {/* Button to reset filters */}
            <Button className="clearButton">
                <img className="icons" src={reset} alt="Reset icon" />
                Reset
            </Button>
        </div>
    );
};

export default FilterPanel;
