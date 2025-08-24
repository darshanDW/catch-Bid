import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import'../index.css'
function Allauction({userId}) {
  const [lists, setLists] = useState([]);
  const t = userId; // TODO: Replace with actual user ID logic
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
    <div className="container py-5">
      <h1 className="text-center mb-4">Items for Sale</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {lists.map((list) => (
          <div key={list._id} className="col">
            <div className="card h-100 shadow-sm">
              {list.itemimage && (
                <img
                  src={list.itemimage}
                  alt="Item"
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{list.itemname}</h5>
                <ul className="list-unstyled mb-3">
                  <li><strong>Starting Price:</strong> ${list.starting_price}</li>
                  <li><strong>End Date:</strong> {formatDate(list.end_date)}</li>
                </ul>
                <Link
                  to={`/bid/${list._id}`}
                  className="btn btn-white w-100"
                  style={{ backgroundColor: "#0c335eb1", color: '#fff' }}
                >
                  {(new Date(list.end_date) < new Date() || t === list.user_id[0])
                    ? 'View bid'
                    : 'Place bid'}
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
