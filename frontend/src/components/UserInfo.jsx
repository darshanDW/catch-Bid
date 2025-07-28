import React from 'react';

function UserInfo({ name, url }) {
  return (
    <div className="user-info">
      <img src={url} alt="User profile" className="profile-picture" />
      <h1>{name}</h1>
    </div>
  );
}

export default UserInfo;
