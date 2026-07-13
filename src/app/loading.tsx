'use client';

export default function Loading() {
  return (
    <div className="global-loader-container">
      <div className="loader-content">
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-dot"></div>
        </div>
        <h3 className="loading-text">جاري تحميل البيانات...</h3>
        <p className="loading-subtext">يرجى الانتظار لحظات</p>
      </div>

      <style jsx>{`
        .global-loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 100px);
          width: 100%;
          background: transparent;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.8);
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .spinner {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 1.5rem;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid transparent;
          border-top-color: #2563eb;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }

        .spinner-ring:nth-child(1) {
          border-top-color: #2563eb;
          animation-delay: 0s;
        }

        .spinner-ring:nth-child(2) {
          border-top-color: #3b82f6;
          border-right-color: #3b82f6;
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          animation-duration: 2s;
          animation-direction: reverse;
        }

        .spinner-ring:nth-child(3) {
          border-top-color: #60a5fa;
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          animation-duration: 1s;
        }

        .spinner-dot {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #2563eb;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .loading-text {
          margin: 0;
          color: #1e293b;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .loading-subtext {
          margin: 0.5rem 0 0;
          color: #64748b;
          font-size: 0.875rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
