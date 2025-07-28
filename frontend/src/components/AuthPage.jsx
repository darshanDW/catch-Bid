import React, { useState } from 'react';
import '../style/Authpage_new.css'; // Import your CSS for styling
function AuthPage({ onAuthSuccess }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;    
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = isSignup ? e.target.name.value : undefined;

    try {
      const res = await fetch(`${backendUrl}/User/${isSignup ? 'signup' : 'signin'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (res.ok) {
        const data = await res.json();
        onAuthSuccess(data);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Authentication failed');
      }
    } catch (err) {
        console.error('Error during authentication:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <h1>{isSignup ? 'Sign Up' : 'Sign In'}</h1>
      {error && <p className="error-message">{error}</p>}
      <form className='auth-form' onSubmit={handleSubmit}>
        {isSignup && <input type="text" className='auth-input' name="name" placeholder="Name" required />}
        <input className='auth-input' type="email" name="email" placeholder="Email" required />
        <input className='auth-input' type="password" name="password" placeholder="Password" required />
        <button className='auth-button' type="submit">{isSignup ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <button className='auth-toggle' onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}

export default AuthPage;
