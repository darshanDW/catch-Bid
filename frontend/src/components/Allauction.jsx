import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/AllAuction_new.css';
import '../index.css'
function Allauction() {
  const [lists, setLists] = useState([]);
  // TODO: Replace with actual user id logic if needed
  const t = '';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${backendUrl}/User/lists`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setLists(data.response);
        } else {
          alert('No auctions found');
        }
      } catch (err) {
        console.error({ message: err });
      }
    };
    getData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };



  return (
    <div className="grid-container">
      <h1>Item for sale</h1>
      <div className='item-list'>
        {lists.map(list => (
          <div key={list._id} className="item-container">
            <div>
              {list.itemimage && (
                <img src={list.itemimage} alt="Item" width={150} height={200} className="item-image" />
              )}
              <div className="item-info">
                <ul>
                  <li>Item name: {list.itemname}</li>
                  <li>Starting price: {list.starting_price}</li>
                  <li>End date: {formatDate(list.end_date)}</li>
                </ul>
                <Link to={`/bid/${list._id}`} className="bid-button">
                  {(new Date(list.end_date) < new Date() || t === list.user_id[0]) ? 'View bid' : 'Place bid'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Allauction;
