import React from "react";
import styles from "./Paginator.module.css";
import { useSearchParams } from "react-router-dom";
import Button from "../Button/Button";

// This component renders a paginator that allows users to navigate through pages of content.
const Paginator = ({ pages }) => {
    // Using useSearchParams to manage the current page in the URL query parameters
    const [searchParams, setSearchParams] = useSearchParams();

    // Parsing the current page from the search parameters, defaulting to 1 if not set
    const page = parseInt(searchParams.get("page")) || 1;

    // Function to handle page button clicks and update the search parameters
    const onClick = (index) => {
        setSearchParams((previous) => {
            previous.set("page", index);
            return previous;
        });
    };

    // If there are no pages, return null to avoid rendering the paginator
    const buttons = [];

    // Calculate the range of pages to display around the current page
    const limit = 2;
    const totalPages = pages;

    const startPage = Math.max(2, page - limit);
    const endPage = Math.min(totalPages - 1, page + limit);

    // Always show the first page button
    buttons.push(
        <Button
            key={1}
            className={page === 1 ? "active" : "inactive"}
            onClick={() => onClick(1)}
        >
            1
        </Button>
    );

    // Conditionally add ellipsis and page buttons based on the current page
    if (startPage > 2) {
        buttons.push("...");
    }

    // Add page buttons for the range around the current page
    for (let i = startPage; i <= endPage; i++) {
        buttons.push(
            <Button
                key={i}
                className={page === i ? "active" : "inactive"}
                onClick={() => onClick(i)}
            >
                {i}
            </Button>
        );
    }

    // Conditionally add ellipsis if there are more pages after the current range
    if (endPage < totalPages - 1) {
        buttons.push("...");
    }

    // Always show the last page button if there are more than one page
    if (totalPages > 1) {
        buttons.push(
            <Button
                key={totalPages}
                className={page === totalPages ? "active" : "inactive"}
                onClick={() => onClick(totalPages)}
            >
                {totalPages}
            </Button>
        );
    }

    // If there are no pages, return null to avoid rendering the paginator
    if (pages === 0 || pages === 1) {
        return null;
    }

    // Render the paginator with the generated buttons
    return <section className={styles.paginator}>{buttons}</section>;
};

export default Paginator;
