import { useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import Departments from '../Departments/Departments';
import SpeedDialAddNumber from '../SpeedDialMenu/SpeedDialAddNumber';
import SpeedDialAnswerPhone from '../SpeedDialMenu/SpeedDialAnswerPhone';
import ScreenMenu from './ScreenMenu';
import { useUser } from '../../Context/useUser';

export function Sidebar() {
  const { updateRefreshProblemCount, showScreensMenu } = useUser();
  const media6 = useMediaQuery('(max-width: 500px)');

  useEffect(() => {
    updateRefreshProblemCount(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {showScreensMenu && <ScreenMenu />}
      <div
        style={{
          // height: "100vh",
          background: '#FFFFFF',
          display: media6 ? 'none' : 'block',
        }}
      >
        <Departments />
      </div>

      <div
        style={{
          display: media6 ? 'none' : 'flex',
          position: 'fixed',
          bottom: '0',
          marginBottom: '20px',
          borderLeft: 'black 1px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 'Row',
            justifyContent: 'space-around',
            width: '100%',
            marginRight: '20px',
          }}
        >
          <SpeedDialAddNumber />
          <SpeedDialAnswerPhone />
        </div>
      </div>
    </div>
  );
}
