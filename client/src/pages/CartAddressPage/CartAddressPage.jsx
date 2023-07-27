import React, { useEffect, useState } from 'react';
import './CartAddressPage.css';
import { Link } from 'react-router-dom';

function CartAddressPage() {
  const [address, setAddress] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [usersName, setUsersName] = useState();
  const [email, setEmail] = useState();

  useEffect(() => {
    fetch('/api/users/token')
      .then((res) => res.json())
      .then(
        (res) => (
          console.log(res),
          setAddress(res.address),
          setPhoneNumber(res.phone_number),
          setEmail(res.email),
          setUsersName(res.name)
        ),
      );
  }, []);

  return (
    <div className='addressContainingContainer'>
      <div className='addressContainer'>
        <h1 className='pageTitle'>Address</h1>
        <hr />
        <div className='addressContent'>
          <span>{usersName && usersName ? usersName.first  : null}</span>
          <span>{usersName && usersName ? usersName.last : null}</span>
          <div>{email && email ? email : null}</div>
          <div>{phoneNumber && phoneNumber ? phoneNumber : null}</div>
        </div>
        <hr />
        <div className='addressContent'>
          <div>{address && address ? address.country : null}</div>
          <div>{address && address ? address.post_code : null}</div>
          <div>{address && address ? address.city : null}</div>
          <div>{address && address ? address.address : null}</div>
        </div>
        <Link to='/cart'>
          <button className='changeAddressButton'>Change address</button>
        </Link>
        <hr />
        <div className='buttonsContainer'>
          <Link className='directionContainer' to='/cart'>
            <button className='directionButton'>previous</button>
          </Link>
          <Link className='directionContainer' to='/cart/complete'>
            <button className='directionButton'>next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartAddressPage;
