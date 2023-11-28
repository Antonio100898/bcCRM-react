import './WorkersHeader.styles.css';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { IMAGES_PATH_WORKERS } from '../../Consts/Consts';
import { useUser } from '../../Context/useUser';

export default function WorkersHeader() {
  const { user } = useUser();
  const history = useNavigate();

  return (
    <div className="row right">
      <div
        className="col-xs-12 col-sm-12 col-md-12 col-xl-12"
        style={{
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <img
          src={`${IMAGES_PATH_WORKERS}${user?.imgPath}`}
          alt="iamge"
          style={{
            width: 80,
            height: 80,
            margin: 5,
            marginRight: 10,
            borderRadius: 80,
          }}
        />

        <div>
          <p className="workerName">
            {user && `${user?.workerName} - ${user?.jobTitle}`}
            <Tooltip title="ערוך פרטי עובד">
              <IconButton
                onClick={() => {
                  history('/WorkerInfo/');
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </p>

          <p className="jobTitle">{user && user?.teudatZehut}</p>
        </div>
      </div>
    </div>
  );
}
