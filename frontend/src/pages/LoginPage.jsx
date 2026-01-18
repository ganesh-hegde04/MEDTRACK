import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        { username, password }
      );

      if (res.data.token) {
        const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 1 week

        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userPhone", res.data.phone || "");
        localStorage.setItem("userEmail", res.data.email || "");
        localStorage.setItem("tokenExpiry", expiry.toString());

        // Success animation before navigation
        document.querySelector('.success-glow')?.classList.add('active');
        setTimeout(() => navigate("/user/dashboard"), 600);
      } else {
        setError("Invalid credentials.");
        setIsLoading(false);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background decorative elements */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Success animation overlay */}
      <div className="success-glow"></div>

      <div className="login-card">
        {/* Logo/Header section */}
        <div className="login-header">
          <div className="logo-circle">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
                    fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                    strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <div className="input-icon">
              <svg className="input-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
              autoComplete="username"
              aria-label="Username"
            />
            <div className="input-border"></div>
          </div>

          <div className="input-group">
            <div className="input-icon">
              <svg className="input-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
              autoComplete="current-password"
              aria-label="Password"
            />
            <div className="input-border"></div>
          </div>

          {error && (
            <div className="error-message" role="alert">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            <span className="button-text">{isLoading ? "Signing In..." : "Sign In"}</span>
            <div className="button-loader" style={{ opacity: isLoading ? 1 : 0 }}>
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
            </div>
            <svg className="button-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="register-prompt">
            <p className="register-text">Don't have an account?</p>
            <Link to="/user-register" className="register-link">
              <span>Create Account</span>
              <svg className="link-arrow" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 4.5L12.5 8L9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </form>

        {/* Additional links for future use */}
        <div className="login-footer">
          <Link to="/forgot-password" className="footer-link">Forgot password?</Link>
          <span className="footer-separator">•</span>
          <Link to="/" className="footer-link">Back to Home</Link>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .background-blobs {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          filter: blur(40px);
          animation: float 20s infinite linear;
        }

        .blob-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          right: -100px;
          animation-delay: 0s;
        }

        .blob-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          left: -100px;
          animation-delay: -5s;
          animation-duration: 25s;
        }

        .blob-3 {
          width: 200px;
          height: 200px;
          top: 50%;
          right: 20%;
          animation-delay: -10s;
          animation-duration: 30s;
        }

        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -50px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }

        .success-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s;
          z-index: 1;
          pointer-events: none;
        }

        .success-glow.active {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 2;
          animation: cardAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: white;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .logo-icon {
          width: 40px;
          height: 40px;
        }

        .login-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 400;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #667eea;
          width: 20px;
          height: 20px;
          z-index: 1;
        }

        .input-svg {
          width: 100%;
          height: 100%;
        }

        .login-input {
          width: 100%;
          padding: 18px 18px 18px 52px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          color: #1a1a1a;
          transition: all 0.3s ease;
          outline: none;
          font-family: inherit;
          position: relative;
          z-index: 2;
        }

        .login-input:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .login-input:hover {
          border-color: #667eea;
        }

        .input-border {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
          border-radius: 1px;
          z-index: 3;
        }

        .login-input:focus ~ .input-border {
          width: calc(100% - 104px);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 8px;
          color: #dc2626;
          font-size: 14px;
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }

        .error-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .login-button {
          position: relative;
          padding: 18px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-family: inherit;
          letter-spacing: 0.5px;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-text {
          transition: opacity 0.3s ease;
        }

        .button-loader {
          display: flex;
          gap: 4px;
          transition: opacity 0.3s ease;
        }

        .loader-dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loader-dot:nth-child(1) { animation-delay: -0.32s; }
        .loader-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .button-arrow {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .login-button:hover:not(:disabled) .button-arrow {
          transform: translateX(4px);
        }

        .register-prompt {
          text-align: center;
          margin-top: 8px;
        }

        .register-text {
          color: #666;
          font-size: 14px;
          margin: 0 0 8px;
        }

        .register-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s ease;
          padding: 8px 16px;
          border-radius: 8px;
        }

        .register-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #764ba2;
          gap: 10px;
        }

        .link-arrow {
          width: 12px;
          height: 12px;
          transition: transform 0.3s ease;
        }

        .register-link:hover .link-arrow {
          transform: translateX(3px);
        }

        .login-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .footer-link {
          color: #666;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: #667eea;
        }

        .footer-separator {
          color: #999;
          font-size: 12px;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .login-card {
            padding: 32px 24px;
            margin: 16px;
            max-width: 100%;
          }

          .login-title {
            font-size: 28px;
          }

          .logo-circle {
            width: 64px;
            height: 64px;
            margin-bottom: 20px;
          }

          .logo-icon {
            width: 32px;
            height: 32px;
          }

          .login-input {
            padding: 16px 16px 16px 48px;
            font-size: 15px;
          }

          .input-icon {
            left: 14px;
            width: 18px;
            height: 18px;
          }

          .login-button {
            padding: 16px 20px;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 24px 20px;
            border-radius: 20px;
          }

          .login-title {
            font-size: 24px;
          }

          .login-subtitle {
            font-size: 14px;
          }

          .login-form {
            gap: 20px;
          }

          .register-link {
            font-size: 14px;
          }

          .login-footer {
            flex-direction: column;
            gap: 8px;
            margin-top: 24px;
            padding-top: 16px;
          }

          .footer-separator {
            display: none;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .blob,
          .success-glow,
          .login-card,
          .logo-circle,
          .login-input,
          .input-border,
          .error-message,
          .login-button,
          .button-arrow,
          .register-link,
          .link-arrow {
            animation: none;
            transition: none;
          }
        }

        /* Focus styles for accessibility */
        .login-input:focus-visible,
        .login-button:focus-visible,
        .register-link:focus-visible,
        .footer-link:focus-visible {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .login-card {
            background: rgba(26, 26, 26, 0.95);
            border-color: rgba(255, 255, 255, 0.1);
          }

          .login-title {
            color: white;
          }

          .login-subtitle {
            color: #aaa;
          }

          .login-input {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(102, 126, 234, 0.3);
            color: white;
          }

          .login-input:focus {
            background: rgba(255, 255, 255, 0.1);
          }

          .register-text {
            color: #aaa;
          }

          .footer-link {
            color: #aaa;
          }

          .login-footer {
            border-top-color: rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;