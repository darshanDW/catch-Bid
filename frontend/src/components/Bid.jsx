import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { io } from 'socket.io-client';
import '../style/Bid_new.css';
  const backendUrl=import.meta.env.VITE_BACKEND_URL

const socket = io(`${backendUrl}`);

function Bid({ userId, propsitemId }) {
  const { paramsId } = useParams();
  let itemId = propsitemId 
  if(paramsId) {
    console.log("paramsId", paramsId);    
    itemId = paramsId;

  }
console.log(userId);
  console.log("itemId", itemId);
  if (!itemId) {
    return <div>Invalid item ID</div>;
  }
  const [listData, setListData] = useState(null);
  const [cp, setCp] = useState(null);
  const [bids, setBids] = useState([]);
  useEffect(() => {
    // Fetch item data by itemId
    const fetchItem = async () => {
      try {
        const res = await fetch(`${backendUrl}/User/Item/${itemId}`);
        if (res.ok) {
          const data = await res.json();
          setListData(data.response);
          setCp(data.response.current_price);
        }
      } catch (err) {
        setListData(null);
      }
    };
    fetchItem();
  }, [itemId]);

  useEffect(() => {
    if (!listData) return;
    setCp(listData.current_price);
  }, [listData]);
useEffect(() => {
  // Fetch bids for the item
  const fetchBids = async () => {
    try {
      const res = await fetch(`${backendUrl}/User/bids/${itemId}`);
      if (res.ok) {
        const data = await res.json();
        setBids(data.response);
      }
    } catch (err) {
      console.error("Error fetching bids:", err);
    }
  };
  fetchBids();
}, [itemId]);

useEffect(() => {
  socket.on('getbid', (data) => {
    console.log("Bid data received:", data);
    const bidData = data.bid; // fixed
  setBids(prev => {
    const updated = [bidData, ...prev.filter(b => b._id !== bidData._id)];
    return updated.slice(0, 5);               // keep only first 5
  });
    setCp(data.currentPrice);
  });
  return () => {
    socket.off('getbid');
  };
}, [])

  useEffect(() => {
    // Emit join_room event when component mounts
    socket.emit('join_room', { item_id: itemId });
    console.log('join_room event emitted with:', { item_id: itemId });
  }, [itemId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  function formattimestamp(timestamp) {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  }

  const placebid = async () => {
    console.log('place bid');
    console.log(userId);
    try {
      socket.emit('bid', JSON.stringify({
        amount: cp + listData.bid_interval,
        user_id: userId,
        item_id: listData._id
      }));
    } catch (err) {
      console.error({ message: err });
    }
  };

  if (!listData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="auction-container">
      <h1 className="auction-title">Auction for {listData.itemname}</h1>
      <h1 className="auction-status">{(new Date(listData.end_date) < new Date()) ? 'status off' : 'status on'}</h1>
      <div className="auction-content">
        {listData.itemimage && (
          <img src={listData.itemimage} alt="Item" className="item-image" />
        )}
        <div x><div className="auction-details">
          <h2>current price: {cp}</h2>
          <h2>starting price: {listData.starting_price}</h2>
          <h2>Bid interval: {listData.bid_interval}</h2>
          {new Date(listData.end_date) < new Date() && <h4>winner is {bids[0]?.name}</h4>}
        </div>
        <div className="bids-section">
          {(!(listData.user_id[0] === userId) && (new Date(listData.end_date) > new Date())) && (
            <button onClick={placebid} className="bid-button">placebid</button>
          )}
          <p>current bids</p>
          {bids.length ? (
            <ul>
              {bids.map(bid => (
                <li key={bid._id}>{bid.amount} by {bid.name}...... {formattimestamp(bid.timestamp)}</li>
              ))}
            </ul>
          ) : (
            <ul><li>no bid yet</li></ul>
          )}
        </div></div>
      </div>
    </div>
  );
}

export default Bid;
