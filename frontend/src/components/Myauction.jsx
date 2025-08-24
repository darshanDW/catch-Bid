import React, { useEffect, useState } from 'react';
import Bid from './Bid';
import 'bootstrap/dist/css/bootstrap.min.css';

function Myauction({ userId }) {
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
    // future "create auction" action
  };

  return (
    <div className="container my-4">
      {!show && lists.length > 0 && (
        <div className="row g-4">
          {lists.map(list => (
            <div key={list._id} className="col-md-4">
              <div className="card shadow-sm h-100">
                {list.itemimage && (
                  <img
                    src={list.itemimage}
                    alt="Item"
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                )}
                <div className="card-body">
                  <ul className="list-unstyled mb-3">
                    <li><strong>Item Name:</strong> {list.itemname}</li>
                    <li><strong>Current Price:</strong> {list.current_price}</li>
                    <li><strong>Starting Price:</strong> {list.starting_price}</li>
                    <li><strong>End Date:</strong> {formatDate(list.end_date)}</li>
                  </ul>
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => getList(list)}
 className='btn flex-fill' style={{ background: "#0c335eb1", color: "#fff" }}
                    >
                      View Bids
                    </button>
                    <button
                      onClick={() => del(list)}
                      className="btn btn-danger flex-fill"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!show && lists.length === 0 && (
        <div className="text-center mt-5">
          <button onClick={m} className="btn btn"   style={{ background: "#0c335eb1", color: "#fff" }}
>
            Create Auction
          </button>
        </div>
      )}

      {show && <Bid userId={userId} propsitemId={selectedList._id} />}
    </div>
  );
}

export default Myauction;
