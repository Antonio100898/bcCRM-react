import { Avatar, Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { IMAGES_PATH_WORKERS } from '../../Consts/Consts';
import NotaficationButton from '../Notafication/NotaficationButton';
import { useUser } from '../../Context/useUser';

export function SidebarHeader() {
  const {
    user,
    updateRefreshProblemCount,
    showScreensMenu,
    updateShowScreensMenu,
  } = useUser();

  useEffect(() => {
    updateRefreshProblemCount(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flex: 'row',
          alignItems: 'center',
        }}
      >
        <Tooltip title={user! && `${user?.workerName} - ${user?.jobTitle}`}>
          <Avatar
            alt={user! && `${user?.workerName} - ${user?.jobTitle}`}
            src={`${IMAGES_PATH_WORKERS}${user?.imgPath}`}
            onClick={() => {
              updateShowScreensMenu(!showScreensMenu);
            }}
            sx={{ width: 48, height: 48 }}
            style={{ margin: 5, marginRight: 10 }}
          />
        </Tooltip>

        <div>
          <NotaficationButton />
        </div>
        {/* <div>
           <Badge
            badgeContent="0"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <NotificationsNoneIcon
              style={{
                fontSize: 50,
                borderRadius: 40,
                padding: 5,
                marginTop: "10px",
                background: "#FDEEE6",
                border: "1px solid #FFFFFF",
              }}
            />
          </Badge> 
        </div> */}
      </div>
    </div>
  );
}
