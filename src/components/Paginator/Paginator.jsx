import React from "react";
import styles from "./Paginator.module.css";
import { useSearchParams } from "react-router-dom";
import Button from "../Button/Button";

const Paginator = ({ pages }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;

    const onClick = (i) => {
        setSearchParams((previous) => {
            previous.set("page", i);
            return previous;
        });
    };

    const buttons = [];
    const limit = 2;
    const totalPages = pages;


    const startPage = Math.max(2, page - limit);
    const endPage = Math.min(totalPages - 1, page + limit);


    buttons.push(
        <Button
            key={1}
            className={page === 1 ? "active" : "inactive"}
            onClick={() => onClick(1)}
        >
            1
        </Button>
    );

    if (startPage > 2) {
        buttons.push("...");
    }

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

    if (endPage < totalPages - 1) {
        buttons.push("...");
    }

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

    return <div className={styles.paginator}>{buttons}</div>;
};

export default Paginator;
