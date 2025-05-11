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
  for (let i = 1; i <= pages; i++) {
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

  return <div className={styles.paginator}>{buttons}</div>;
};

export default Paginator;
