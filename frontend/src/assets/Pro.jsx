import React, { useState, useEffect } from "react";
import axios from "axios";

function Pro() {
  const [pro, setPro] = useState([]);

  useEffect(() => {
    axios
      .get("v1/product")
      .then((res) => {
        console.log(res);
        setPro(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },[]);
  return (
    <>
      <ul>
        {pro.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}

export default Pro;
