import { useCallback, useEffect, useState } from 'react';
import { IshiftDetail } from '../../Model';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Tooltip } from '@mui/material';
import './Shift.styles.css';
import InfoIcon from '@mui/icons-material/Info';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useSnackbar } from 'notistack';
import { api } from '../../API/Api';
import { TOKEN_KEY } from '../../Consts/Consts';
import ShiftEdit from './ShiftEdit';

const FONST_SIZE = 24;

export type Props = {
  shift: Partial<IshiftDetail>;
  jobTypeId: number;
  shiftTypeId: number;
  defDate: Date;
  refreshList: () => void;
  showDetails: boolean;
  shiftGroupId: number;
};

export default function Shift({
  shift,
  jobTypeId,
  shiftTypeId,
  defDate,
  refreshList,
  showDetails,
  shiftGroupId,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [currentShift, setCurrentShift] =
    useState<Partial<IshiftDetail>>(shift);
  const [showEditShift, setShowEditShift] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentShift(shift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift]);

  const handleCloseEdit = useCallback(() => {
    setShowEditShift(false);
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift]);

  const showEmptyShift = useCallback(() => {
    const d: Partial<IshiftDetail> = {
      id: 0,
      workerId: 199,
      jobTypeId,
      shiftTypeId,
      placeName: '',
      phone: '',
      remark: '',
      contactName: '',
      startDate: defDate.toString(),
      finishTime: defDate.toString(),
      startDateEN: defDate.toString(),
      finishTimeEN: defDate.toString(),
    };

    // 12/26/2022 12:01:39

    // console.log([d, defDate]);
    setCurrentShift(d);
    setShowEditShift(true);
  }, [defDate, jobTypeId, shiftTypeId]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text', event.currentTarget.id);
  };
  const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  function UpdateShiftStartDate(id: number) {
    api
      .post('/UpdateShiftStartDate', {
        workerKey: localStorage.getItem(TOKEN_KEY),
        shiftId: id,
        newDate: defDate,
      })
      .then(({ data }) => {
        // console.log(data.d);
        if (!data.d.success) {
          enqueueSnackbar({
            message: `נכשל לעדכן תקלה. ${data.d.msg}`,
            variant: 'error',
          });
          return;
        }

        refreshList();
      });
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const idName = event.dataTransfer.getData('text');

    const id = parseInt(idName.replace('shift', ''), 10);
    UpdateShiftStartDate(id);
  };

  function getDayName(dayNum: number) {
    switch (dayNum) {
      case 0:
        return 'א';
      case 1:
        return 'ב';
      case 2:
        return 'ג';
      case 3:
        return 'ד';
      case 4:
        return 'ה';
      case 5:
        return 'ו';
      case 6:
        return 'ש';
      default:
        return 'X';
    }
  }

  return (
    <div className="shift" onDragOver={enableDropping} onDrop={handleDrop}>
      {currentShift && currentShift!.id! > 0 && (
        <Box
          id={`shift${currentShift.id}`}
          draggable="true"
          onDragStart={handleDragStart}
          onClick={() => setShowEditShift(true)}
          style={{ overflow: 'hidden' }}
        >
          <div
            className="shiftDivTop text"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              color: currentShift!.workerName === 'עובד כללי' ? 'red' : 'black',
              position: 'relative',
            }}
          >
            {currentShift!.workerName}
            <div
              style={{
                position: 'absolute',
                right: '0px',
                fontSize: '16px',
                opacity: '0.2',
                margin: '3px',
                color: 'black',
              }}
            >
              {getDayName(defDate.getDay())}
            </div>
          </div>

          {currentShift!.placeName && (
            <div
              className="shiftDivMiddle textSmall"
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: `calc(100% - ${FONST_SIZE + 8}px)`,
                  textAlign: 'right',
                }}
              >
                {currentShift!.placeName}
              </div>
              {currentShift!.remark && currentShift!.remark?.length > 1 && (
                <Tooltip
                  title={
                    <h3
                      style={{
                        color: 'lightblue',
                        textAlign: 'right',
                      }}
                    >
                      {currentShift!.remark}
                    </h3>
                  }
                >
                  <InfoIcon
                    style={{
                      color: 'blue',
                      fontSize: `${FONST_SIZE}px`,
                      position: 'absolute',
                      top: 7,
                      left: 3,
                    }}
                  />
                </Tooltip>
              )}
            </div>
          )}

          {showDetails && (
            <div>
              {currentShift!.contactName && (
                <div className="shiftDivMiddleSimple textSmall">
                  <PersonIcon />
                  {currentShift!.contactName}
                </div>
              )}
              {currentShift!.phone && (
                <div className="shiftDivMiddleSimple textSmall">
                  <PhoneEnabledIcon />
                  {currentShift!.phone}
                </div>
              )}
              {currentShift!.address && currentShift!.address.length > 2 && (
                <div className="shiftDivMiddleSimple textSmall">
                  <LocationOnIcon />
                  {currentShift!.address}
                </div>
              )}
              <div className="shiftDivMiddleSimple textSmall">
                {currentShift!.remark}
              </div>
            </div>
          )}

          <div className="shiftDivBottom text">
            {`${currentShift!.finishHour}  -  ${currentShift!.startHour}`}
          </div>
        </Box>
      )}

      {currentShift.id === 0 && (
        <div
          style={{
            width: '100%',
            justifyContent: 'center',
            borderRadius: '10px',
            border: '1px dotted black',
            borderStyle: 'dotted',
          }}
        >
          <IconButton onClick={showEmptyShift}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </div>
      )}

      <ShiftEdit
        open={showEditShift}
        shift={currentShift}
        handleClose={handleCloseEdit}
        shiftGroupId={shiftGroupId}
      />
    </div>
  );
}
