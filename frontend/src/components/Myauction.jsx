import React, { useEffect, useState } from 'react';
import Bid from './Bid';
import '../style/Myauction.css'; // Import your CSS for styling
function Myauction({userId}) {
  const t = userId;
  const [lists, setLists] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${backendUrl}/User/mybid/${t}`, {
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
  }, [t]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getList = (list) => {
    setSelectedList(list);
    setShow(true);
  };

  const del = async (list) => {
    try {
      const response = await fetch(`${backendUrl}/User/del/`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({ userId: t, itemId: list._id }),
      });
      if (response.ok) {
        setLists(lists.filter(item => item._id !== list._id));
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      console.error({ message: err });
    }
  };

  const m = () => {
  };
console.log("lists", selectedList);
  return (
    <div className="grid-container">
      {!show && lists.length > 0 && lists.map(list => (
        <div key={list._id} className="item-container">
          <div>
            {list.itemimage && (
              <img src={list.itemimage} alt="Item" className="item-image" />
            )}
            <div className="item-info">
              <ul>
                <li>item name: {list.itemname}</li>
                <li>current price: {list.current_price}</li>
                <li>starting price: {list.starting_price}</li>
                <li>end date: {formatDate(list.end_date)}</li>
              </ul>
              <button onClick={() => getList(list)} className="bid-button">view bid</button>
              <button onClick={() => del(list)} className="bid-button">delete item</button>
            </div>
          </div>
        </div>
      ))}
      {!show && lists.length === 0 && (
        <button onClick={m} className="create-auction-button">create auction</button>
      )}
{show && <Bid userId={userId} propsitemId={selectedList._id} />}
    </div>
  );
}

export default Myauction;
