import React from 'react';
import like from "./like.module.css";
import likePhoto from "./like.png"
import { NavLink } from "react-router-dom";

const Like = () => {
    return ( 
        <div className={like.style}>
            <img src = {likePhoto}/>
        </div>
     );
}
 
export default Like;