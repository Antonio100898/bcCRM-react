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
import { sickdaysImagePath } from "../../Consts/Consts";
import { IWorkerSickday } from "../../Model";
import { useConfirm } from "../../Context/useConfirm";
import { useUser } from "../../Context/useUser";
import { workerService } from "../../API/services";
import { enqueueSnackbar } from "notistack";

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

  const getWorkersSickdays = async () => {
    updateShowLoader(true);
    try {
      const data = await workerService.getWorkersSickdays(
        filterYear,
        filterMonth,
        !showAllWorkers
      );
      if (data?.d.success) setWorkerSickday(data.d.workerSickDay);
    } catch (error) {
      console.error(error);
    }

    updateShowLoader(false);
  };

  useEffect(() => {
    getWorkersSickdays();
  }, [filterYear, filterMonth, showAllWorkers]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(`${reader.result}`);
      reader.onerror = (error) => reject(error);
    });

  const hideDialog = () => {
    setShowDialog(false);
  };

  const showDialogNow = () => {
    setCurrentWorkerSickday({
      id: 0,
      workerId: 0,
      workerName: "",
      startDate: new Date(),
      finishDate: new Date(),
      daysLen: 0,
      fileName: "",
      startDateEN: new Date().toDateString(),
      finishDateEN: new Date().toDateString(),
      cancel: false,
      imgContent: "",
    });
    setShowDialog(true);
  };

  function GetDateTimeFormatEN(d: string) {
    return `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}/${new Date(
      d
    ).getFullYear()} ${new Date(d).getHours()}:${new Date(d).getMinutes()}`;
  }

  const updateSickDay = async (w: IWorkerSickday) => {
    updateShowLoader(true);

    const sickDay: IWorkerSickday = {
      ...w,
      startDate: new Date(GetDateTimeFormatEN(w.startDateEN)),
      finishDate: new Date(GetDateTimeFormatEN(w.finishDateEN)),
    };
    try {
      const data = await workerService.updateWorkerSickday(sickDay);
      if (data?.d.success) {
        enqueueSnackbar({
          variant: "success",
          message: "בוצע שינוי בימי מחלה",
        });
        getWorkersSickdays();
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

  const cancelSickDay = async (w: IWorkerSickday) => {
    if (await confirm("האם ברצונך למחוק את היום מחלה הזה?")) {
      updateSickDay({ ...w, cancel: true });
    }
  };

  const onChange = <K extends keyof IWorkerSickday>(
    key: K,
    val: IWorkerSickday[K]
  ) => {
    setCurrentWorkerSickday({ ...currentWorkerSickday!, [key]: val });
  };

  return (
    <div style={{ marginRight: 10, marginLeft: 10 }}>
      <h2>ימי מחלה</h2>

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
                <TableCell align="right">ימי מחלה</TableCell>
                <TableCell align="right">אישור מחלה</TableCell>
                <TableCell align="right">
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
              {workerSickday &&
                workerSickday.map((worker: IWorkerSickday) => {
                  return (
                    <TableRow key={worker.id} hover>
                      <TableCell align="right">{worker.workerName}</TableCell>
                      <TableCell align="right">
                        {dayjs(worker.startDateEN).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="right">
                        {dayjs(worker.finishDateEN).format("DD/MM/YYYY")}
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
                              background: "red",
                              borderRadius: "12px",
                            }}
                            onClick={() => {
                              cancelSickDay(worker);
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
                        value={dayjs(currentWorkerSickday?.startDateEN)}
                        onChange={(val) => {
                          onChange(
                            "startDateEN",
                            val?.format() || "01/01/2000"
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
                            "finishDateEN",
                            val?.format() || "01/01/2000"
                          );
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-xs-6">
                    <input
                      type="file"
                      name="myImage"
                      style={{ marginTop: "15px" }}
                      onChange={async (event) => {
                        if (event) {
                          if (event.target) {
                            if (event.target.files) {
                              const b = await toBase64(event.target.files[0]);
                              onChange("imgContent", b);
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
