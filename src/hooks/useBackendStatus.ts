import { useState, useEffect } from 'react';

type BackendStatus = 'checking' | 'active' | 'inactive';

export const useBackendStatus = () => {
  const [status, setStatus] = useState<BackendStatus>('checking');

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/health', {
          method: 'GET',
          timeout: 5000,
        } as RequestInit);
        
        if (response.ok) {
          setStatus('active');
        } else {
          setStatus('inactive');
        }
      } catch (error) {
        setStatus('inactive');
      }
    };

    // Check immediately
    checkBackendStatus();

    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return status;
};