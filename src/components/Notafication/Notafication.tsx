import { useCallback, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import { IconButton, Tooltip } from '@mui/material';
import { INotafiction } from '../../Model/INotafication';
import { TOKEN_KEY } from '../../Consts/Consts';
import { api } from '../../API/Api';

export type Props = {
  nota: INotafiction;
};

function Notafication({ nota }: Props) {
  const [notafication, setNotafication] = useState<INotafiction>(nota);
  const workerKey: string = localStorage.getItem(TOKEN_KEY) || '';

  const deleteNotification = useCallback(() => {
    api.post('/DeleteNotification', {
      workerKey,
      notificationId: notafication.id,
    });
  }, [notafication.id, workerKey]);

  const changeHasRead = useCallback(() => {
    api
      .post('/UpdateNotificationHadSeen', {
        workerKey,
        notificationId: notafication.id,
        hasSeen: !notafication.hadSeen,
      })
      .then(() => {
        setNotafication({
          ...notafication,
          hadSeen: !notafication.hadSeen,
        });
      });
  }, [notafication, workerKey]);

  return (
    <div
      style={{
        position: 'relative',
        minWidth: '250px',
        background: '#FFE9C9',
        border: '1px solid rgba(0, 0, 0, 0.25)',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
      }}
    >
      <p
        style={{
          fontFamily: 'Rubik',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '22px',
          lineHeight: '30px',
          textAlign: 'right',
          color: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {notafication.msg}
      </p>
      <div style={{ display: 'flex', flex: 'row', justifyContent: 'left' }}>
        <IconButton onClick={deleteNotification}>
          <Tooltip title="מחק איזכור">
            <DeleteOutlineIcon />
          </Tooltip>
        </IconButton>

        <IconButton onClick={changeHasRead}>
          <Tooltip title={notafication.hadSeen ? 'סמן כלא נקרא' : 'נקרא'}>
            <div>
              {notafication.hadSeen && <MarkAsUnreadIcon />}
              {!notafication.hadSeen && <MailOutlineIcon />}
            </div>
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
}

export default Notafication;
