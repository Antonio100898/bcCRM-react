import React, { useCallback } from 'react';

import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import {
  TextField,
  Tooltip,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  DialogTitle,
  Typography,
  Fab,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { IPlace } from '../../Model/IPlace';
import { api } from '../../API/Api';
import { IProblem, IProblemsResponse } from '../../Model/IProblem';
import { TOKEN_KEY } from '../../Consts/Consts';
import { useConfirm } from '../../Context/useConfirm';
import { useUser } from '../../Context/useUser';

export default function SpeedDialAnswerPhone() {
  const { prompt } = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateShowProblemDialog, updateCurrentProblem } = useUser();
  const [placesOptions, setPlacesOptions] = React.useState<IPlace[]>();
  const [showSelectPlace, setShowSelectPlace] = React.useState(false);
  const [showAddNewPlace, setShowAddNewPlace] = React.useState(false);
  const [phone, setPhone] = React.useState('');
  const [newPlaceId, setNewPlaceId] = React.useState(0);
  const [newPlaceName, setNewPlaceName] = React.useState('');
  const [newCusName, setNewCusName] = React.useState('');
  const [newRemark, setNewRemark] = React.useState('');
  const [newVip, setNewVip] = React.useState(false);
  const history = useNavigate();

  const workerKey: string = localStorage.getItem(TOKEN_KEY) || '';

  const answerThePhone = useCallback(async () => {
    const { data } = await api.post<IProblemsResponse>('/AnsweredCall', {
      workerKey: localStorage.getItem(TOKEN_KEY),
      department: user?.department,
    });
    if (!data.d.success) {
      enqueueSnackbar({
        message: data.d.msg,
        variant: 'error',
      });
      return;
    }

    setPhone(data.d.phone);

    if (data.d.phone.length > 6) {
      const { data: data1 } = await api.post<IProblemsResponse>(
        '/GetPlacesForPhone',
        {
          phone: data.d.phone,
        }
      );

      if (data1.d.success) {
        setPlacesOptions(data1.d.places);
        setShowSelectPlace(data1.d.success);

        if (data1.d.places.length === 0) {
          setNewPlaceId(0);
          setNewPlaceName('');
          setNewCusName('');
          setNewRemark('');
          setShowAddNewPlace(true);
        }
      }
    }
  }, [enqueueSnackbar, user?.department]);

  const selectPlace = useCallback(
    (place: IPlace) => {
      const problem: Partial<IProblem> = {
        workerKey,
        workerCreateName: user?.workerName || '',
        customerName: place.customerName,
        phoneId: place.phoneId,
        phone: place.phone,
        placeId: place.placeId,
        placeName: place.placeName,
        departmentId: user?.department,
        emergencyId: 0,
        toWorkers: [],
        newFiles: [],
        startTime: `${new Date().toLocaleString()}`,
        startTimeEN: new Date().toString(),
      };

      api
        .post<IProblemsResponse>('/UpdateProblem', {
          problem,
        })
        .then(({ data }) => {
          if (!data.d.success) {
            enqueueSnackbar({
              message: `נכשל להוסיף תקלה חדשה. ${data.d.msg}`,
              variant: 'error',
            });
            return;
          }

          problem.id = data.d.problemId!;
          problem.toWorker = data.d.workerId;

          updateCurrentProblem(problem);
          updateShowProblemDialog(true);

          if (!window.location.href.endsWith('/Problems')) {
            history('/Problems');
          }
        });

      setShowSelectPlace(false);
    },
    [
      enqueueSnackbar,
      history,
      updateCurrentProblem,
      updateShowProblemDialog,
      user?.department,
      user?.workerName,
      workerKey,
    ]
  );

  const inputNewPlace = useCallback(async () => {
    const pName = await prompt('הזן את שם המקום');
    if (pName && pName?.length === 0) {
      enqueueSnackbar({
        message: 'אנא הזן שם מקום חדש',
        variant: 'error',
      });
      return;
    }

    if (pName === null || pName === '') {
      enqueueSnackbar({
        message: 'אנא הזן שם מקום חדש',
        variant: 'error',
      });
      return;
    }

    // console.log("Name: " + pName);

    const cusName = await prompt('הזן את שם הלקוח');

    if (cusName && cusName?.length === 0) {
      enqueueSnackbar({
        message: 'אנא הזן שם הלקוח',
        variant: 'error',
      });
      return;
    }

    if (cusName === null || cusName === '') {
      enqueueSnackbar({
        message: 'אנא הזן שם הלקוח',
        variant: 'error',
      });
      return;
    }

    const p: IPlace = {
      id: 0,
      phoneId: 0,
      phone,
      placeId: 0,
      placeName: pName!,
      customerName: cusName!,
      vip: false,
      placeRemark: '',
      bizNumber: '',
      warrantyType: 0,
    };

    api
      .post<IProblemsResponse>('/UpdatePhonePlace', {
        workerKey: user?.key,
        phone,
        placeName: pName,
        cusName,
        vip: newVip,
        remark: newRemark,
      })
      .then(({ data }) => {
        if (!data.d.success) {
          enqueueSnackbar({
            message: `נכשל להוסיף תקלה חדשה. ${data.d.msg}`,
            variant: 'error',
          });
        }
      });

    selectPlace(p);
  }, [
    prompt,
    phone,
    user?.key,
    newVip,
    newRemark,
    selectPlace,
    enqueueSnackbar,
  ]);

  function EditPlace(placeId: number) {
    const place: IPlace[] =
      placesOptions?.filter((p) => p.placeId === placeId) || [];

    if (place.length > 0) {
      setNewPlaceId(placeId);
      setPhone(place[0].phone);
      setNewPlaceName(place[0].placeName);
      setNewCusName(place[0].customerName);
      setNewRemark(place[0].placeRemark);
      setNewVip(place[0].vip);
      setShowAddNewPlace(true);
    }
  }

  return (
    <div style={{ marginRight: '20px' }}>
      <Tooltip title="לענות לטלפון">
        <Fab onClick={answerThePhone} color="primary">
          <LocalPhoneIcon />
        </Fab>
      </Tooltip>

      <Dialog
        dir="rtl"
        sx={{ textAlign: 'right' }}
        fullWidth
        onClose={() => setShowSelectPlace(false)}
        maxWidth="lg"
        open={showSelectPlace}
      >
        <DialogContent style={{ padding: 0 }}>
          <div className="row" style={{ margin: 5 }}>
            <div className="col-4" />
            <div className="col-4">
              <TextField
                placeholder="מספר טלפון"
                focused
                autoFocus
                type="text"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputProps={{ style: { fontSize: 48, textAlign: 'center' } }}
                style={{
                  fontFamily: 'Heebo',
                  fontStyle: 'normal',
                  fontWeight: '300',
                  lineHeight: '70px',
                  color: 'rgba(0, 0, 0, 0.65)',
                  textAlign: 'center',
                  boxShadow:
                    '0px 2px 4px rgba(0, 0, 0, 0.25) inset 0px -4px 2px rgba(91, 91, 91, 0.1)',
                  borderRadius: '8px',
                }}
              />
            </div>
            <div
              className="col-4 left"
              style={{
                fontFamily: 'Heebo',
                fontStyle: 'normal',
                fontWeight: '400',
                fontSize: '26px',
                lineHeight: '38px',
                padding: '10px',
                color: 'rgba(0, 0, 0, 0.75)',
              }}
            >
              {`${new Date().getHours()}:${new Date().getMinutes()} ${new Date().toLocaleDateString()}`}
              <br />
              <p
                style={{
                  fontFamily: 'Rubik',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: '26px',
                  lineHeight: '35px',
                }}
              >
                {user && user.workerName}
              </p>
            </div>
          </div>

          <TableContainer style={{ height: '750px' }}>
            <Table aria-label="תקלות">
              <TableHead>
                <TableRow
                  style={{
                    background: '#FFE1BE',
                    border: '1px black solid',
                  }}
                >
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: 'Heebo',
                      fontStyle: 'ExtraBold',
                      fontWeight: 800,
                      fontSize: '32px',
                      lineHeight: '47px',
                      padding: 0,
                    }}
                  >
                    שם עסק
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: 'Heebo',
                      fontStyle: 'ExtraBold',
                      fontWeight: 800,
                      fontSize: '32px',
                      padding: 0,
                    }}
                  >
                    לקוח
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: 'Heebo',
                      fontStyle: 'ExtraBold',
                      fontWeight: 800,
                      fontSize: '32px',
                      padding: 0,
                    }}
                  >
                    הערות
                  </TableCell>
                  <TableCell align="center" />

                  <TableCell align="left">
                    <IconButton
                      onClick={() => {
                        setNewPlaceId(0);
                        setNewPlaceName('');
                        setNewCusName('');
                        setNewRemark('');
                        setShowAddNewPlace(true);
                      }}
                      style={{
                        background: '#F3BE80',
                        border: '1px solid rgba(0, 0, 0, 0.25)',
                        boxShadow: 'inset 0px 5px 10px rgba(0, 0, 0, 0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      <Tooltip title="הוסף עסק חדש">
                        <SaveIcon
                          style={{
                            fontSize: 35,
                            color: 'rgba(255, 255, 255, 0.9)',
                            background: '#F3BE80',
                            borderRadius: '12px',
                          }}
                        />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {placesOptions &&
                  placesOptions.map((place) => {
                    return (
                      <TableRow
                        key={place.id}
                        onClick={() => {
                          return selectPlace(place);
                        }}
                      >
                        <TableCell
                          align="center"
                          style={{
                            fontFamily: 'Heebo',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '32px',
                            padding: 0,
                          }}
                        >
                          {place.placeName}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontFamily: 'Heebo',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '32px',
                            padding: 0,
                          }}
                        >
                          {place.customerName}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontFamily: 'Heebo',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '32px',
                            padding: 0,
                          }}
                        >
                          {place.placeRemark}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontFamily: 'Heebo',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '32px',
                            padding: 0,
                          }}
                        >
                          {place.vip && (
                            <Tooltip title="vip">
                              <StarIcon
                                style={{ color: 'goldenrod', fontSize: '30px' }}
                              />
                            </Tooltip>
                          )}
                        </TableCell>

                        <TableCell align="left">
                          <Tooltip title="ערוך עסק">
                            <IconButton
                              onClick={(a) => {
                                a.stopPropagation();
                                return EditPlace(place.placeId);
                              }}
                            >
                              <EditIcon
                                style={{ color: 'blue', marginRight: 5 }}
                              />
                            </IconButton>
                          </Tooltip>
                          {/* {user && user.userType === 1 && (
                            <Tooltip title="מחק עסק">
                              <IconButton
                                onClick={(a) => {
                                  a.stopPropagation();
                                  return DeletePlace(place.placeId);
                                }}
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </Tooltip>
                          )} */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Dialog
        dir="rtl"
        sx={{ textAlign: 'right' }}
        fullWidth
        onClose={() => setShowAddNewPlace(false)}
        maxWidth="xs"
        open={showAddNewPlace}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5">הוספת מקום חדש</Typography>
          {user && user.userType === 1 && (
            <FormControlLabel
              dir="ltr"
              value="newVip"
              checked={newVip}
              control={
                <Checkbox onChange={(e) => setNewVip(e.target.checked)} />
              }
              label="VIP"
              labelPlacement="start"
            />
          )}
        </DialogTitle>
        <DialogContent>
          <div>
            <TextField
              value={newPlaceName}
              onChange={(e) => setNewPlaceName(e.target.value)}
              placeholder="שם עסק"
              fullWidth
              sx={{ mb: 1 }}
              style={{
                background: '#FFFFFF',
                boxShadow:
                  '0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)',
                borderRadius: '8px',
              }}
            />
            <br />
            <TextField
              value={newCusName}
              onChange={(e) => setNewCusName(e.target.value)}
              placeholder="שם לקוח"
              fullWidth
              sx={{ mb: 1 }}
              style={{
                background: '#FFFFFF',
                boxShadow:
                  '0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)',
                borderRadius: '8px',
              }}
            />
            <TextField
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="טלפון"
              fullWidth
              sx={{ mb: 1 }}
              style={{
                background: '#FFFFFF',
                boxShadow:
                  '0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)',
                borderRadius: '8px',
              }}
            />
            {user && user.userType === 1 && (
              <TextField
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                placeholder="הערות"
                rows="2"
                multiline
                fullWidth
                sx={{ mb: 1 }}
                style={{
                  background: '#FFFFFF',
                  boxShadow:
                    '0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)',
                  borderRadius: '8px',
                }}
              />
            )}

            <Button variant="contained" fullWidth onClick={inputNewPlace}>
              {newPlaceId > 0 ? 'עדכן' : 'הוסף חדש'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
