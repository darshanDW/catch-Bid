import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Import Bootstrap

function AuthPage({ onAuthSuccess }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;    
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
const[loader,setloader]=useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = isSignup ? e.target.name.value : undefined;

    try {
      setloader(true);
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
        setloader(false);
      }
    } catch (err) {
      setloader(false);
      console.error('Error during authentication:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">{isSignup ? 'Sign Up' : 'Sign In'}</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                name="name" 
                placeholder="Name" 
                required 
              />
            </div>
          )}
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              name="email" 
              placeholder="Email" 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              name="password" 
              placeholder="Password" 
              required 
            />
          </div>
          {loader&&  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
}

          {!loader&&<button type="submit" className="btn btn w-100" style={{ backgroundColor: "#0c335eb1", color: '#fff' }}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>}
        </form>

        <div className="text-center mt-3">
          <button 
            className="btn btn-link" 
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
