import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_KEY } from '../../Consts/Consts';
import { useUser } from '../../Context/useUser';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { updateShowLoader, showLoader, login } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    updateShowLoader(true);
    const workerKey = localStorage.getItem(TOKEN_KEY);

    if (workerKey !== null) {
      login({ workerKey })
        .then(() => {
          navigate('/');
        })
        .finally(() => {
          updateShowLoader(false);
        });
    } else {
      updateShowLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    updateShowLoader(true);
    const loginUser = await login({ userName, password });
    updateShowLoader(false);

    if (loginUser !== null) navigate('/');
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '40%',
        transform: 'translate(-50%, -50%)',
        visibility: showLoader ? 'hidden' : 'visible',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img
        src="beecomm-logo.png"
        alt="logo"
        style={{ width: '100px', paddingTop: '50px', paddingBottom: '25px' }}
      />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <TextField
            id="txtUserName"
            label="שם משתמש"
            autoFocus
            type="text"
            autoComplete="current-password"
            variant="outlined"
            onChange={(e) => setUserName(e.target.value)}
            style={{ textAlign: 'start', backgroundColor: '#FFF' }}
          />
        </div>

        <TextField
          id="txtPassword"
          label="סיסמה"
          type="password"
          autoComplete="current-password"
          style={{ backgroundColor: '#FFF' }}
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ marginTop: '12px' }}>
          <Button fullWidth color="primary" variant="contained" type="submit">
            היכנס
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
