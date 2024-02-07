import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
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
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import SnoozeIcon from "@mui/icons-material/Snooze";
import { IWorkerFreeday } from "../../Model";
import { NivTextField } from "../../components/BaseCompnents/NivTextField/NivTextField";
import { useUser } from "../../Context/useUser";
import { useConfirm } from "../../Context/useConfirm";
import { workerService } from "../../API/services";
import { enqueueSnackbar } from "notistack";

export default function WorkersFreeday() {
  const { confirm } = useConfirm();
  const { updateShowLoader, user } = useUser();

  const [currentWorkerFreeday, setCurrentWorkerFreeday] =
    useState<IWorkerFreeday>();

  const [workerFreeday, setWorkerFreeday] = useState<IWorkerFreeday[]>([]);
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );

  const [showAllWorkers, setShowAllWorkers] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const fetchWorkersFreedays = async () => {
    updateShowLoader(true);
    try {
      const data = await workerService.getWorkersFreedays(
        filterYear,
        filterMonth,
        !showAllWorkers
      );
      if (data?.d.success) {
        setWorkerFreeday(data.d.workerFreeDay);
      }
    } catch (error) {
      console.error(error);
    }
    updateShowLoader(false);
  };

  useEffect(() => {
    fetchWorkersFreedays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterYear, filterMonth, showAllWorkers]);

  const hideDialog = () => {
    setShowDialog(false);
  };

  const showDialogNow = () => {
    setCurrentWorkerFreeday({
      id: 0,
      workerId: 0,
      workerName: "",
      startDate: new Date(),
      finishDate: new Date(),
      daysLen: 0,
      startDateEN: new Date().toDateString(),
      finishDateEN: new Date().toDateString(),
      remark: "",
      statusId: 0,
      cancel: false,
    });
    setShowDialog(true);
  };

  function GetDateTimeFormatEN(d: string) {
    return `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}/${new Date(
      d
    ).getFullYear()} ${new Date(d).getHours()}:${new Date(d).getMinutes()}`;
  }

  const updateFreeDayFn = async (w: IWorkerFreeday) => {
    updateShowLoader(true);

    const freeDay: IWorkerFreeday = {
      ...w,
      startDate: new Date(GetDateTimeFormatEN(w.startDateEN)),
      finishDate: new Date(GetDateTimeFormatEN(w.finishDateEN)),
    };
    try {
      const data = await workerService.updateWorkerFreeday(freeDay);
      if (data?.d.success) {
        enqueueSnackbar({
          variant: "success",
          message: "בוצי שינוי בימי חופש",
        });
        fetchWorkersFreedays();
      }
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          variant: "error",
          message: error.message,
        });
      console.error(error);
    }
    updateShowLoader(false);
    setShowDialog(false);
  };

  const cancelFreeDay = async (w: IWorkerFreeday) => {
    if (await confirm("האם ברצונך למחוק את הבקשה ליום חופש?")) {
      updateFreeDayFn({ ...w, cancel: true });
    }
  };

  function updateFreeDay(w: IWorkerFreeday, status: number) {
    updateFreeDayFn({ ...w, statusId: status });
  }

  const onChange = <K extends keyof IWorkerFreeday>(
    key: K,
    val: IWorkerFreeday[K]
  ) => {
    setCurrentWorkerFreeday({ ...currentWorkerFreeday!, [key]: val });
  };

  return (
    <div style={{ marginRight: 10, marginLeft: 10 }}>
      <h2>ימי חופש</h2>

      <div className="row" style={{ marginTop: "15px" }}>
        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          <Select
            fullWidth
            variant="outlined"
            value={filterMonth}
            className="cboDateMonth"
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{ height: "56px" }}
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
            style={{ height: "56px" }}
          >
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2026">2026</MenuItem>
          </Select>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-2 col-lg-2 right">
          {user?.userType === 1 && (
            <Tooltip title={showAllWorkers ? "הצג את כולם" : "הצג פירוט"}>
              <Switch onChange={() => setShowAllWorkers(!showAllWorkers)} />
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
              "& .MuiTableRow-root:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="right">עובד</TableCell>
                <TableCell align="right">מתאריך</TableCell>
                <TableCell align="right">עד תאריך</TableCell>
                <TableCell align="right">הערות</TableCell>
                <TableCell align="right">ימים</TableCell>
                <TableCell align="center">אישור</TableCell>
                <TableCell align="center">
                  {" "}
                  <Tooltip title="הוסף יום מחלה">
                    <IconButton
                      onClick={showDialogNow}
                      style={{
                        background: "green",
                        border: "1px solid rgba(0, 0, 0, 0.25)",
                        boxShadow: "inset 0px 5px 10px rgba(0, 0, 0, 0.05)",
                        borderRadius: "12px",
                      }}
                    >
                      <SaveIcon
                        style={{
                          fontSize: 35,
                          color: "rgba(255, 255, 255, 0.9)",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workerFreeday &&
                workerFreeday.map((worker: IWorkerFreeday) => {
                  return (
                    <TableRow key={worker.id} hover>
                      <TableCell align="right">{worker.workerName}</TableCell>
                      <TableCell align="right">
                        {dayjs(worker.startDateEN).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="right">
                        {dayjs(worker.finishDateEN).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="right">{worker.remark}</TableCell>
                      <TableCell align="right">{worker.daysLen + 1}</TableCell>
                      <TableCell align="center">
                        {showAllWorkers ? (
                          <div
                            style={{
                              display: "flex",
                              flex: "row",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <Tooltip title="לאשר יום חופש">
                              <IconButton
                                onClick={() => {
                                  updateFreeDay(worker, 2);
                                }}
                              >
                                <TaskAltIcon
                                  style={{
                                    color: "green",
                                    fontSize:
                                      worker.statusId === 2 ? "35px" : "1.5rem",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="מחכה לאישור">
                              <IconButton
                                onClick={() => {
                                  updateFreeDay(worker, 0);
                                }}
                              >
                                <SnoozeIcon
                                  style={{
                                    color: "blue",
                                    fontSize:
                                      worker.statusId === 0 ? "35px" : "1.5rem",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="לסרב ליום חופש">
                              <IconButton
                                onClick={() => {
                                  updateFreeDay(worker, 1);
                                }}
                              >
                                <DoDisturbIcon
                                  style={{
                                    color: "red",
                                    fontSize:
                                      worker.statusId === 1 ? "35px" : "1.5rem",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ) : (
                          <div>
                            {worker.statusId === 0 ? "מחכה לאישור" : ""}
                            {worker.statusId === 1 ? "סירוב" : ""}
                            {worker.statusId === 2 ? "מאושר" : ""}
                          </div>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="מחק בקשה ליום חופש">
                          <IconButton
                            style={{
                              background: "red",
                              borderRadius: "12px",
                            }}
                            onClick={() => {
                              cancelFreeDay(worker);
                            }}
                          >
                            <DeleteForeverIcon
                              style={{
                                fontSize: 40,
                                color: "rgba(255, 255, 255, 0.9)",
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
          sx={{ textAlign: "right" }}
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
                style={{ maxHeight: 600, overflowY: "auto", padding: "5px" }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  m: "auto",
                  width: "fit-content",
                }}
              >
                <div className="row">
                  {" "}
                  <div className="col-xs-12">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="מתאריך"
                        format="DD/MM/YYYY"
                        value={dayjs(currentWorkerFreeday?.startDateEN)}
                        onChange={(val) => {
                          onChange(
                            "startDateEN",
                            val?.format() || "01/01/2000"
                          );
                        }}
                        slotProps={{
                          textField: {
                            sx: {
                              "& .MuiInputLabel-root": {
                                right: 35,
                                transformOrigin: "top right",
                              },
                              "& .MuiInputLabel-shrink": {
                                transform: "translate(19px, -9px) scale(0.75)",
                              },
                              " & .MuiOutlinedInput-root": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  textAlign: "right",
                                },
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <br />
                  <div className="col-xs-12">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="עד תאריך כולל"
                        format="DD/MM/YYYY"
                        value={dayjs(currentWorkerFreeday?.finishDateEN)}
                        onChange={(val) => {
                          onChange(
                            "finishDateEN",
                            val?.format() || "01/01/2000"
                          );
                        }}
                        slotProps={{
                          textField: {
                            sx: {
                              "& .MuiInputLabel-root": {
                                right: 35,
                                transformOrigin: "top right",
                              },
                              "& .MuiInputLabel-shrink": {
                                transform: "translate(19px, -9px) scale(0.75)",
                              },
                              " & .MuiOutlinedInput-root": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  textAlign: "right",
                                },
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-xs-12">
                    <NivTextField
                      rows={2}
                      multiline
                      fullWidth
                      variant="outlined"
                      dir="rtl"
                      label="הערה"
                      value={currentWorkerFreeday?.remark}
                      onChange={(e) => onChange("remark", e.target.value)}
                    />
                  </div>
                </div>
              </Box>
              <div>
                <Button
                  variant="outlined"
                  onClick={() => updateFreeDayFn(currentWorkerFreeday!)}
                  style={{ marginTop: 40, fontSize: 20, width: "100%" }}
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
