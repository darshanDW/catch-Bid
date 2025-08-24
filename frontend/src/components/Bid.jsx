import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io(`${backendUrl}`);

function Bid({ userId, propsitemId }) {
  const { paramsId } = useParams();
  let itemId = propsitemId;
  if (paramsId) {
    itemId = paramsId;
  }

  if (!itemId) {
    return <div className="alert alert-danger">Invalid item ID</div>;
  }

  const [listData, setListData] = useState(null);
  const [cp, setCp] = useState(null);
  const [bids, setBids] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${backendUrl}/User/Item/${itemId}`);
        if (res.ok) {
          const data = await res.json();
          setListData(data.response);


          setCp(data.response.current_price);
        }
      } catch {
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
      const bidData = data.bid;
      setBids(prev => {
        const updated = [bidData, ...prev.filter(b => b._id !== bidData._id)];
        return updated.slice(0, 5);
      });
      setCp(data.currentPrice);
      if(listData!=null)
      {listData.bid_interval=data.bidInterval;
      }
setLoader(false);
    });
    return () => {
      socket.off('getbid');
    };
  }, [listData]);

  useEffect(() => {
    socket.emit('join_room', { item_id: itemId });
  }, [itemId]);

  function formattimestamp(timestamp) {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  }

  const placebid = () => {
    setLoader(true);
    try {
      socket.emit('bid', JSON.stringify({
      
        amount: cp + listData.bid_interval,
        user_id: userId,
        item_id: listData._id
      }));
      
    } catch (err) {
      console.error({ message: err });
      setLoader(false);
    }
  
  };

  if (!listData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-3">
            Auction for <span className="text-primary">{listData.itemname}</span>
          </h2>

          <h5 className={`text-center ${new Date(listData.end_date) < new Date() ? 'text-danger' : 'text-success'}`}>
            {(new Date(listData.end_date) < new Date()) ? 'Status: Off' : 'Status: On'}
          </h5>

          <div className="row mt-4">
            {listData.itemimage && (
              <div className="col-md-6 text-center">
                <img src={listData.itemimage} alt="Item" className="img-fluid rounded shadow-sm" />
              </div>
            )}

            <div className="col-md-6">
              <div className="mb-3">
                <h5>Current Price: <span className="badge bg-primary">{cp}</span></h5>
                <h6>Starting Price: {listData.starting_price}</h6>
                <h6>Bid Interval: {listData.bid_interval}</h6>
                {new Date(listData.end_date) < new Date() && (
                  <h6 className="text-success">Winner: {bids[0]?.name}</h6>
                )}
              </div>

              <div className="border rounded p-3 bg-light" >
                {(!(listData.user_id[0] === userId) && (new Date(listData.end_date) > new Date())) && (
                  <div className="d-flex justify-content-center">
   {loader&&  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
}  {!loader&&    <button 
        onClick={placebid} 
        className="btn w-50 mb-3" 
        style={{ backgroundColor: "#0c335eb1", color: "#fff" }}
      >
        Place Bid
      </button>}
    </div>
                )}

                <h6 className="fw-bold">Current Bids</h6>
                {bids.length ? (
                  <ul className="list-group">
                    {bids.map(bid => (
                      <li key={bid._id} className="list-group-item d-flex justify-content-between">
                        <span>{bid.amount} by <strong>{bid.name}</strong></span>
                        <small className="text-muted">{formattimestamp(bid.timestamp)}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="alert alert-secondary mt-2">No bids yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bid;
