import React from 'react';
import styles from "./pointer.module.css";
import pointer from "./pointer.png"

const Pointer = () => {
    return (
        <div className={styles.image}>
            <img src={pointer} alt="Pointer"/>
        </div>
    );
};

export default Pointer;
