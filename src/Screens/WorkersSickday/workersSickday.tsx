import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import SaveIcon from '@mui/icons-material/Save';
import { useCallback, useEffect, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { api } from '../../API/Api';
import { sickdaysImagePath, TOKEN_KEY } from '../../Consts/Consts';
import { IWorkerSickday } from '../../Model/IWorkerSickday';
import { useConfirm } from '../../Context/useConfirm';
import { useUser } from '../../Context/useUser';

export default function WorkersSickday() {
  const { confirm } = useConfirm();
  const { updateShowLoader, user } = useUser();

  const [currentWorkerSickday, setCurrentWorkerSickday] =
    useState<IWorkerSickday>();

  const [workerSickday, setWorkerSickday] = useState<IWorkerSickday[]>([]);
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [showAllWorkers, setShowAllWorkers] = useState<boolean>(
    user?.userType === 1
  );
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const getWorkersSickdays = useCallback(() => {
    updateShowLoader(true);
    // console.clear();
    const workerKey = localStorage.getItem(TOKEN_KEY);
    api
      .post('/GetWorkersSickdays', {
        workerKey,
        year: filterYear,
        month: filterMonth,
        justMe: !showAllWorkers,
      })
      .then(({ data }) => {
        setWorkerSickday(data.d.workerSickDay);
        updateShowLoader(false);
      });
  }, [filterMonth, filterYear, showAllWorkers, updateShowLoader]);

  useEffect(() => {
    getWorkersSickdays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterYear, filterMonth, showAllWorkers]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(`${reader.result}`);
      reader.onerror = (error) => reject(error);
    });

  const hideDialog = useCallback(() => {
    setShowDialog(false);
  }, []);

  const showDialogNow = useCallback(() => {
    setCurrentWorkerSickday({
      id: 0,
      workerId: 0,
      workerName: '',
      startDate: new Date(),
      finishDate: new Date(),
      daysLen: 0,
      fileName: '',
      startDateEN: new Date().toDateString(),
      finishDateEN: new Date().toDateString(),
      cancel: false,
      imgContent: '',
    });
    setShowDialog(true);
  }, []);

  function GetDateTimeFormatEN(d: string) {
    return `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}/${new Date(
      d
    ).getFullYear()} ${new Date(d).getHours()}:${new Date(d).getMinutes()}`;
  }

  const updateSickDay = useCallback(
    (w: IWorkerSickday) => {
      updateShowLoader(true);
      const workerKey = localStorage.getItem(TOKEN_KEY);

      const sickDays = {
        ...w,
        startDate: new Date(GetDateTimeFormatEN(w.startDateEN)),
        finishDate: new Date(GetDateTimeFormatEN(w.finishDateEN)),
      };

      api
        .post('/UpdateWorkerSickday', {
          workerKey,
          sickday: sickDays,
        })
        .then(() => {
          getWorkersSickdays();
          setShowDialog(false);
        });
    },
    [getWorkersSickdays, updateShowLoader]
  );

  const cancelSickDay = useCallback(
    async (w: IWorkerSickday) => {
      if (await confirm('האם ברצונך למחוק את היום מחלה הזה?')) {
        updateSickDay({ ...w, cancel: true });
      }
    },
    [updateSickDay, confirm]
  );

  const onChange = useCallback(
    <K extends keyof IWorkerSickday>(key: K, val: IWorkerSickday[K]) => {
      setCurrentWorkerSickday({ ...currentWorkerSickday!, [key]: val });
    },
    [currentWorkerSickday]
  );

  return (
    <div style={{ marginRight: 10, marginLeft: 10 }}>
      <h2>ימי מחלה</h2>

      <div className="row" style={{ marginTop: '15px' }}>
        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          <Select
            fullWidth
            variant="outlined"
            value={filterMonth}
            className="cboDateMonth"
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{ height: '56px' }}
          >
            <MenuItem value="1">01</MenuItem>
            <MenuItem value="2">02</MenuItem>
            <MenuItem value="3">03</MenuItem>
            <MenuItem value="4">04</MenuItem>
            <MenuItem value="5">05</MenuItem>
            <MenuItem value="6">06</MenuItem>
            <MenuItem value="7">07</MenuItem>
            <MenuItem value="8">08</MenuItem>
            <MenuItem value="9">09</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="11">11</MenuItem>
            <MenuItem value="12">12</MenuItem>
          </Select>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          <Select
            fullWidth
            variant="outlined"
            value={filterYear}
            className="cboDateMonth"
            onChange={(e) => setFilterYear(e.target.value)}
            style={{ height: '56px' }}
          >
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2026">2026</MenuItem>
          </Select>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          {user?.userType === 1 && (
            <Tooltip title={showAllWorkers ? 'הצג את כולם' : 'הצג פירוט'}>
              <Switch
                onChange={() => setShowAllWorkers(!showAllWorkers)}
                color="primary"
              />
            </Tooltip>
          )}
        </div>
      </div>

      <div>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table
            stickyHeader
            aria-label="תקלות"
            sx={{
              '& .MuiTableRow-root:hover': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="right">עובד</TableCell>
                <TableCell align="right">מתאריך</TableCell>
                <TableCell align="right">עד תאריך</TableCell>
                <TableCell align="right">ימי מחלה</TableCell>
                <TableCell align="right">אישור מחלה</TableCell>
                <TableCell align="right">
                  {' '}
                  <Tooltip title="הוסף יום מחלה">
                    <IconButton
                      onClick={showDialogNow}
                      style={{
                        background: 'green',
                        border: '1px solid rgba(0, 0, 0, 0.25)',
                        boxShadow: 'inset 0px 5px 10px rgba(0, 0, 0, 0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      <SaveIcon
                        style={{
                          fontSize: 35,
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workerSickday &&
                workerSickday.map((worker: IWorkerSickday) => {
                  return (
                    <TableRow key={worker.id} hover>
                      <TableCell align="right">{worker.workerName}</TableCell>
                      <TableCell align="right">
                        {dayjs(worker.startDateEN).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell align="right">
                        {dayjs(worker.finishDateEN).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell align="right">{worker.daysLen + 1}</TableCell>
                      <TableCell align="right">
                        <a
                          href={sickdaysImagePath + worker.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          הצג
                        </a>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="מחק אישור מחלה">
                          <IconButton
                            style={{
                              background: 'red',
                              borderRadius: '12px',
                            }}
                            onClick={() => {
                              cancelSickDay(worker);
                            }}
                          >
                            <DeleteForeverIcon
                              style={{
                                fontSize: 40,
                                color: 'rgba(255, 255, 255, 0.9)',
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div>
        <Dialog
          sx={{ textAlign: 'right' }}
          fullWidth
          maxWidth="xs"
          open={showDialog}
          onClose={hideDialog}
        >
          <DialogContent>
            <div dir="rtl">
              <Box
                noValidate
                component="form"
                style={{ maxHeight: 600, overflowY: 'auto', padding: '5px' }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  m: 'auto',
                  width: 'fit-content',
                }}
              >
                <div className="row">
                  {' '}
                  <div className="col-xs-12">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="מתאריך"
                        format="DD/MM/YYYY"
                        value={dayjs(currentWorkerSickday?.startDateEN)}
                        onChange={(val) => {
                          onChange(
                            'startDateEN',
                            val?.format() || '01/01/2000'
                          );
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-xs-12">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="עד תאריך"
                        format="DD/MM/YYYY"
                        value={dayjs(currentWorkerSickday?.finishDateEN)}
                        onChange={(val) => {
                          onChange(
                            'finishDateEN',
                            val?.format() || '01/01/2000'
                          );
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-xs-6">
                    <input
                      type="file"
                      name="myImage"
                      style={{ marginTop: '15px' }}
                      onChange={async (event) => {
                        if (event) {
                          if (event.target) {
                            if (event.target.files) {
                              const b = await toBase64(event.target.files[0]);
                              onChange('imgContent', b);
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </Box>
              <div>
                <Button
                  variant="outlined"
                  onClick={() => updateSickDay(currentWorkerSickday!)}
                  style={{ marginTop: 40, fontSize: 20, width: '100%' }}
                >
                  עדכן
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
