import './V3Settings.styles.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  IconButton,
  useMediaQuery,
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../../API/Api';
import { TOKEN_KEY } from '../../Consts/Consts';
import { NivTextField } from '../../components/BaseCompnents/NivTextField/NivTextField';
import { Iv3Branch, Iv3City, Iv3Group } from '../../Model/Iv3Group';
import { useUser } from '../../Context/useUser';

export type Option = { label: string; id: number };

export default function V3Settings() {
  const { updateShowLoader } = useUser();
  const [groupsList, setGroupsList] = useState<Option[]>([]);
  const [currentGroup] = useState<Iv3Group>();
  const [branches] = useState<Iv3Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Partial<Iv3Branch>>();
  const [cities, setCities] = useState<Option[]>([]);

  const [filterWorkerName, setFilterWorkerName] = useState('');
  const media = useMediaQuery('(max-width: 600px)');

  const [showBranchEdit, setShowBranchEdit] = useState<boolean>(false);

  const getGroups = useCallback(() => {
    updateShowLoader(true);
    api
      .post('/GetV3Groups', {
        workerKey: localStorage.getItem(TOKEN_KEY),
      })
      .then(({ data }) => {
        const grp: Iv3Group[] = data.d.v3Groups;
        const options: Option[] = [];

        grp.forEach((obj) => {
          options.push({ label: `${obj.name} (${obj.id})`, id: obj.id });
        });

        setGroupsList(options);

        const grpCity: Iv3City[] = data.d.v3Cities;
        const optionsCity: Option[] = [];

        grpCity.forEach((obj) => {
          optionsCity.push({
            label: `${obj.cityName} (${obj.id})`,
            id: obj.id,
          });
        });

        setCities(optionsCity);

        updateShowLoader(false);
      });
  }, [updateShowLoader]);

  useEffect(() => {
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterWorkerName]);

  const copyDBName = useCallback(() => {
    if (currentGroup) navigator.clipboard.writeText(currentGroup.database);
  }, [currentGroup]);

  const onChange = useCallback(
    <K extends keyof Iv3Branch>(key: K, val: Iv3Branch[K]) => {
      setCurrentBranch({ ...currentBranch, [key]: val });
    },
    [currentBranch]
  );

  const savePlace = useCallback(() => {
    // api
    //   .post("/UpdatePlaceBizNumber", {
    //     workerKey: "123",
    //     id: currentPlace?.id,
    //     placeName: currentPlace?.placeName,
    //     bizNumber: currentPlace?.bizNumber,
    //     warrantyType: currentPlace?.warrantyType,
    //   })
    //   .then(({ data }) => {
    //     GetPlaces();
    //     updateShowPlaceDialog(false);
    //   });
  }, []);

  return (
    <div style={{ marginRight: '10px' }}>
      <h2>V3</h2>

      <div>
        <div className="row">
          <div className="col-4">
            <Autocomplete
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.25)',
                boxShadow: 'inset 0px 5px 10px rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
              }}
              fullWidth
              disablePortal
              options={groupsList}
              renderInput={(params) => (
                <TextField {...params} label="עסקים" value={currentGroup} />
              )}
            />
          </div>
          <div className="col-8 left">
            {currentGroup && (
              <TextField
                value={currentGroup?.database}
                className="database"
                style={{ width: '450px' }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={copyDBName}>
                      <Tooltip title="העתק">
                        <ContentCopyIcon
                          style={{ fontSize: 30, marginLeft: '3px' }}
                        />
                      </Tooltip>
                    </IconButton>
                  ),
                }}
              />
            )}
          </div>
        </div>

        <TableContainer sx={{ maxHeight: 800, marginTop: '20px' }}>
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
                <TableCell
                  align="right"
                  className="tableHeaderCell"
                  style={{ borderRadius: '0px 8px 0px 0px' }}
                >
                  ID
                </TableCell>
                <TableCell align="right" className="tableHeaderCell">
                  <NivTextField
                    style={{}}
                    variant="standard"
                    dir="rtl"
                    label="סניף"
                    value={filterWorkerName}
                    onChange={(e) => setFilterWorkerName(e.target.value)}
                  />
                </TableCell>
                <TableCell align="right" className="tableHeaderCell">
                  IP
                </TableCell>
                <TableCell align="right" className="tableHeaderCell">
                  כשר
                </TableCell>
                <TableCell align="right" className="tableHeaderCell">
                  עיר
                </TableCell>
                <TableCell
                  align="right"
                  className="tableHeaderCell"
                  style={{ display: media ? 'none' : 'table-cell' }}
                >
                  כתובת
                </TableCell>
                <TableCell align="right" className="tableHeaderCell">
                  EMAIL
                </TableCell>

                <TableCell
                  align="right"
                  className="tableHeaderCell"
                  style={{ borderRadius: '8px 0px 0px 0px' }}
                >
                  <IconButton
                    onClick={() => {}}
                    style={{
                      background: '#FFF0DE',
                      border: '1px solid #000000',
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    <AddCircleIcon style={{ color: 'blue' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* .filter((a: Iv3Branch) => a.branchName.includes(filterWorkerName)) */}
              {branches &&
                branches.map((branch: Iv3Branch) => {
                  return (
                    <TableRow
                      key={branch.id}
                      hover
                      style={{
                        background: '#FFE5C6',
                        borderBottom: '2px solid #000000',
                        borderRadius: '0px',
                      }}
                    >
                      <TableCell align="right" className="tableCell">
                        {branch.id}
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        {branch.branchName}
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        {branch.ip}
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        {branch.kosher}
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        {branch.cityName}
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        {branch.address}
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        {branch.biCommEmail}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => {
                            setCurrentBranch(branch);
                            setShowBranchEdit(true);
                            // console.log(showBranchEdit);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="center">
        <Dialog
          sx={{ textAlign: 'right' }}
          fullWidth
          maxWidth="xs"
          open={showBranchEdit}
          onClose={() => setShowBranchEdit(false)}
        >
          <DialogContent>
            <div dir="rtl">
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  m: 'auto',
                  width: 'fit-content',
                }}
              >
                <div className="row">
                  <div className="col-12">
                    <div
                      style={{
                        paddingTop: 10,
                        justifyContent: 'space-between',
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <div>
                        <NivTextField
                          className="col-12"
                          label="ID"
                          value={currentBranch?.id}
                        />

                        <NivTextField
                          label="סניף"
                          className="col-12"
                          type="text"
                          value={currentBranch?.branchName}
                          onChange={(e) =>
                            onChange('branchName', e.target.value)
                          }
                        />

                        <NivTextField
                          label="IP"
                          className="col-12"
                          type="text"
                          value={currentBranch?.ip}
                          onChange={(e) => onChange('ip', e.target.value)}
                        />

                        <Tooltip title="כשר">
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={(e) =>
                                  onChange('kosher', Boolean(e.target.value))
                                }
                              />
                            }
                            label="כשר"
                          />
                        </Tooltip>

                        <Tooltip title="עיר">
                          <Autocomplete
                            className="col-12"
                            options={cities}
                            value={{
                              label: currentBranch?.cityName,
                              id: currentBranch?.id,
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="עיר"
                                value={currentGroup}
                              />
                            )}
                          />
                        </Tooltip>

                        <NivTextField
                          label="כתובת"
                          className="col-12"
                          type="text"
                          value={currentBranch?.address}
                          onChange={(e) => onChange('address', e.target.value)}
                        />

                        <NivTextField
                          label="Email"
                          className="col-12"
                          type="text"
                          value={currentBranch?.biCommEmail}
                          onChange={(e) =>
                            onChange('biCommEmail', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Box>
              <div>
                <Button variant="outlined" onClick={savePlace}>
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
