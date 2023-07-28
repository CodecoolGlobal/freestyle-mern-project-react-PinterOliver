import React, { useEffect, useState } from 'react';
import './CartCompletePage.css';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

function CartCompletePage() {
  const cartId = localStorage.getItem('cartid');
  const cart = JSON.parse(localStorage.getItem('cart'));
  const [address, setAddress] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [usersName, setUsersName] = useState();
  const [email, setEmail] = useState();
  const navigate = useNavigate();

  function handleSendOrder() {

    fetch(`/api/orderheaders/${cartId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newstate: 'placed' }),
    })
      .then(() => {
        localStorage.removeItem('cartid');
        localStorage.removeItem('cart');
        navigate('/');
      });
  }

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
      <div className='completeContainer'>
        <h1 className='pageTitle'>Complete Order</h1>
        <hr />
        <table>
          <tbody>
            {cart.map((book) => (
              <tr key={book.id}>
                <td className='titleColumn'>{book.title}</td>
                <td className='amtCol'>{book.amount}</td>
                <td className='priceCol'>
                  {book.price.toLocaleString('hu')} HUF
                </td>
                <td className='totPriceCol'>
                  {(book.price * book.amount).toLocaleString('hu')} HUF
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Summary</th>
              <td className='amtCol'></td>
              <td className='priceCol'></td>
              <td className='totPriceCol'>
                {cart.reduce(
                  (acc, cv) => (acc += Number(cv.amount) * Number(cv.price)),
                  0,
                )}{' '}
                HUF
              </td>
            </tr>
          </tfoot>
        </table>
        <hr />
        <div className='addressContent'>
          <span>{usersName && usersName ? usersName.first : null}</span>
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
        <hr />
        <div className='buttonsContainer'>
          <button className='sendOrderButton' onClick={handleSendOrder}>
            Send order
          </button>
          <Link className='directionContainer' to='/cart/address'>
            <button className='directionButton'>previous</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartCompletePage;
