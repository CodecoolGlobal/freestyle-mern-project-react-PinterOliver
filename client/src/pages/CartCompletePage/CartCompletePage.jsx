import React, { useEffect, useState } from "react";
import "./CartCompletePage.css";
import { Link } from "react-router-dom";

function CartPage() {
  const [address, setAddress] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`/api/user/token/${token}`)
      .then((res) => res.json())
      .then((res) => (console.log(res), setAddress(res.address)));
  }, []);

  return (
    <div className="addressContainingContainer">
      <div className="addressContainer">
        <h1 className="pageTitle">Address</h1>
        <hr />
        <div className="addressContent">
          <div>{address && address ? address.country : null}</div>
          <div>{address && address ? address.post_code : null}</div>
          <div>{address && address ? address.city : null}</div>
          <div>{address && address ? address.address : null}</div>
        </div>
        <Link to="/cart">
          <button className="changeAddressButton">Change address</button>
        </Link>
        <hr />
        <div className="buttonsContainer">
          <Link className="directionContainer" to="/cart/complete">
            <button className="directionButton">next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
