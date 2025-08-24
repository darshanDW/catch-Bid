import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateAuction({ userId }) {
  const user_id = userId;
  const [itemname, setItemname] = useState('');
  const [startingPrice, setStartingPrice] = useState(0);
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loader, setLoader] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('itemname', itemname);
    formData.append('starting_price', startingPrice);
    formData.append('end_date', endDate);
    formData.append('user_id', user_id);
    try {
      setLoader(true);
      const response = await fetch(`${backendUrl}/uploads`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {  
        setMessage('Upload successful!');
      } else {
        setMessage(data.message || 'Upload failed');
      }
    } catch (err) {
      setMessage('Error uploading file');
      console.error({ message: err });
    }
    finally {
      setLoader(false)
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4">Post an Item</h2>
        <form onSubmit={uploadFile}>
          <div className="mb-3">
            <input 
              type="text" 
              placeholder="Name of item" 
              value={itemname} 
              onChange={e => setItemname(e.target.value)} 
              className="form-control" 
            />
          </div>
          <div className="mb-3">
            <input 
              type="number" 
              placeholder="Starting price" 
              value={startingPrice} 
              onChange={e => setStartingPrice(Number(e.target.value))} 
              className="form-control" 
            />
          </div>
          <div className="mb-3">
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="form-control" 
            />
          </div>
          <div className="mb-3">
            <input 
              type="file" 
              onChange={onFileChange} 
              className="form-control" 
            />
          </div>
         {!loader&& <button type="submit" className="btn btn w-100" style={{ backgroundColor: '#0c335eb1', color: '#fff' }}>Upload</button>}
         {loader && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
}

export default CreateAuction;
