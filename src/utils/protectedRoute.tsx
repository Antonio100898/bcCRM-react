import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { TOKEN_KEY } from '../Consts/Consts';
import { useUser } from '../Context/useUser';

export function ProtectedRoute() {
  const navigate = useNavigate();
  const { user, updateShowLoader, login } = useUser();

  useEffect(() => {
    if (user) return;

    updateShowLoader(true);
    const storageToken = localStorage.getItem(TOKEN_KEY);

    if (storageToken !== null) {
      login({ workerKey: storageToken }).finally(() => {
        updateShowLoader(false);
      });
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Outlet />;
}