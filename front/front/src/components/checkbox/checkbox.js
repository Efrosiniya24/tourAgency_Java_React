import React from 'react';
import checkbox from "./checkbox.module.css";

const Checkbox = ({ checked, onClick }) => {
    return (
        <div 
            className={`${checkbox.style} ${checked ? checkbox.active : ''}`} 
            onClick={onClick}>
        </div>
    );
};

export default Checkbox;
