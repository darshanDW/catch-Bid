import React, { useState } from 'react';
import '../style/CreateAuction.css'; // Import your CSS for styling
function CreateAuction({ userId }) {
  const user_id = userId;
  const [itemname, setItemname] = useState('');
  const [startingPrice, setStartingPrice] = useState(0);
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
  };

  return (
    <div className="form-container">
      <h1>post an item</h1>
      <form onSubmit={uploadFile} className="upload-form">
        <input type="text" placeholder="name of item" value={itemname} onChange={e => setItemname(e.target.value)} className="form-input" /><br />
        <input type="number" placeholder="starting price" value={startingPrice} onChange={e => setStartingPrice(Number(e.target.value))} className="form-input" /><br />
        <input type="date" placeholder="Pick end date" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-input" /><br />
        <input type="file" onChange={onFileChange} className="form-input" />
        <button type="submit" className="submit-button">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateAuction;
