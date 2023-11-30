import "./Workers.styles.css";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControlLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  Tooltip,
  IconButton,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { useSnackbar } from "notistack";
import { IMAGES_PATH_WORKERS } from "../../Consts/Consts";
import { IDepartment, IWorker, IWorkExpensesType } from "../../Model";
import WorkersHeader from "../../components/Workers/WorkersHeader";
import { NivTextField } from "../../components/BaseCompnents/NivTextField/NivTextField";
import { useUser } from "../../Context/useUser";
import { workerService } from "../../API/services";

export default function Workers() {
  const { enqueueSnackbar } = useSnackbar();
  const { updateShowLoader, updateRefreshProblemCount } = useUser();
  const [workers, setWorkers] = useState<IWorker[]>([]);
  const [currentWorker, setCurrentWorker] = useState<Partial<IWorker>>();
  const [currentDepartments, setCurrentDepartments] = useState<IDepartment[]>(
    []
  );
  const [filterWorkerName, setFilterWorkerName] = useState("");
  const media = useMediaQuery("(max-width: 600px)");

  const [addNewWorkerExpenseSum, setAddNewWorkerExpenseSum] = useState("0");
  const [addNewWorkerExpenseType, setAddNewWorkerExpenseType] = useState("0");

  const [workExpensesTypes, setWorkExpensesTypes] = useState<
    IWorkExpensesType[]
  >([]);
  const [
    workExpensesTypesPosibleForWorker,
    setWorkExpensesTypesPosibleForWorker,
  ] = useState<IWorkExpensesType[]>([]);
  const [showWorkerDialog, updateShowWorkerDialog] = useState<boolean>(false);

  const fetchWorkers = async () => {
    updateShowLoader(true);

    try {
      const data = await workerService.getWorkers();
      if (data?.d.success) setWorkers(data.d.workers);
    } catch (error) {
      console.error(error);
    }

    updateShowLoader(false);
    updateRefreshProblemCount(true);
  };

  useEffect(() => {
    fetchWorkers();
  }, [filterWorkerName]);

  const validaWorker = () => {
    if (currentWorker!.firstName === "") {
      enqueueSnackbar({
        message: "הזן שם פרטי",
        variant: "error",
      });
      return false;
    }

    if (currentWorker!.lastName === "") {
      enqueueSnackbar({
        message: "הזן שם משפחה",
        variant: "error",
      });
      return false;
    }

    return true;
  };

  const saveWorker = async () => {
    if (!validaWorker() || !currentWorker) {
      return;
    }
    try {
      const data = await workerService.updateWorker(currentWorker);
      if (data?.d.success) fetchWorkers();
    } catch (error) {
      console.error(error);
    }

    updateShowWorkerDialog(false);
  };

  const fetchWorkerDepartments = async (worker: IWorker) => {
    try {
      const data = await workerService.getWorkerDepartments(worker.Id);
      if (data?.d.success) {
        setCurrentWorker(worker);
        setCurrentDepartments(data.d.workerDepartments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWorkerExpensesValue = async (workerId: number) => {
    try {
      const data = await workerService.getWorkerExpensesValue(workerId);
      if (data?.d.success) {
        setWorkExpensesTypes(data.d.workExpensesTypes);
        setWorkExpensesTypesPosibleForWorker(data.d.workerExpenses);
        updateShowWorkerDialog(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function showWorkerInfo(worker: IWorker) {
    fetchWorkerDepartments(worker);
    fetchWorkerExpensesValue(worker.Id);
  }

  function addNewWorker() {
    setCurrentWorker({ Id: 0, userTypeId: 2, active: true });
    updateShowWorkerDialog(true);
  }

  const hideDialog = () => {
    updateShowWorkerDialog(false);
  };

  const onChange = <K extends keyof IWorker>(key: K, val: IWorker[K]) => {
    setCurrentWorker({ ...currentWorker, [key]: val });
  };

  const onChangeDep = (id: number, val: boolean) => {
    setCurrentDepartments(
      currentDepartments.map((dep) =>
        dep.id === id ? { ...dep, canSee: val } : dep
      )
    );
  };

  const onChangeAddExpenseType = (id: number, val: string) => {
    setAddNewWorkerExpenseType(val);
  };

  const updateExpenceTypePrice = (id: string, newValue: string) => {
    const newState = workExpensesTypes.map((obj) => {
      if (obj.id === id) {
        return { ...obj, defValue: newValue };
      }

      return obj;
    });

    setWorkExpensesTypes(newState);
  };

  const updateWorkerExpensesValueForWorker = async () => {
    // AppendWorkerExpensesValue(string workerKey, int workerId, int workExpensesType, double sum)
    if (currentWorker?.Id)
      try {
        const data = await workerService.appendWorkerExpensesValue(
          currentWorker!.Id,
          addNewWorkerExpenseType,
          addNewWorkerExpenseSum
        );
        if (data?.d.success) {
          setAddNewWorkerExpenseSum("0");
          fetchWorkerExpensesValue(currentWorker!.Id || 0);
        }
      } catch (error) {
        console.error(error);
      }
  };

  return (
    <div>
      <WorkersHeader />
      <h2>הגדרות עובדים</h2>

      <div>
        <div className="row" />

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
                <TableCell align="right">
                  <NivTextField
                    style={{}}
                    variant="standard"
                    dir="rtl"
                    label="שם עובד"
                    value={filterWorkerName}
                    onChange={(e) => setFilterWorkerName(e.target.value)}
                  />
                </TableCell>
                <TableCell align="right">טלפון</TableCell>
                <TableCell
                  align="right"
                  style={{ display: media ? "none" : "table-cell" }}
                >
                  משתמש
                </TableCell>
                <TableCell
                  align="right"
                  style={{ display: media ? "none" : "table-cell" }}
                >
                  סוג משתמש
                </TableCell>
                <TableCell
                  align="right"
                  style={{ display: media ? "none" : "table-cell" }}
                >
                  שלוחה
                </TableCell>
                <TableCell
                  align="right"
                  style={{ display: media ? "none" : "table-cell" }}
                >
                  מחלקה
                </TableCell>
                <TableCell
                  align="right"
                  style={{ display: media ? "none" : "table-cell" }}
                >
                  תמונה
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    onClick={() => {
                      addNewWorker();
                      updateShowWorkerDialog(true);
                    }}
                  >
                    חדש
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workers &&
                workers
                  .filter((a: IWorker) =>
                    `${a.firstName} ${a.lastName}`.includes(filterWorkerName)
                  )
                  .map((worker: IWorker) => {
                    return (
                      <TableRow key={worker.Id} hover>
                        <TableCell align="right">
                          <div
                            style={{
                              display: "flex",
                              flex: "row",
                            }}
                          >
                            {worker &&
                              worker.imgPath &&
                              worker.imgPath.length > 0 && (
                                <Avatar
                                  src={IMAGES_PATH_WORKERS + worker.imgPath}
                                  sx={{
                                    width: 35,
                                    height: 35,
                                    marginLeft: "10px",
                                  }}
                                />
                              )}
                            {worker.workerName}
                          </div>
                        </TableCell>

                        <TableCell align="right">{worker.phone}</TableCell>

                        <TableCell
                          align="right"
                          style={{ display: media ? "none" : "table-cell" }}
                        >
                          {worker.userName}
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{ display: media ? "none" : "table-cell" }}
                        >
                          {worker.userTypeId === 1 ? "אדמין" : "רגיל"}
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{ display: media ? "none" : "table-cell" }}
                        >
                          {worker.shluha}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ display: media ? "none" : "table-cell" }}
                        >
                          {worker.departmentName}
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{ display: media ? "none" : "table-cell" }}
                        >
                          {worker &&
                            worker.imgPath &&
                            worker.imgPath.length > 0 && (
                              <Avatar
                                src={IMAGES_PATH_WORKERS + worker.imgPath}
                                sx={{ width: 50, height: 50 }}
                              />
                            )}
                        </TableCell>

                        <TableCell align="right">
                          <Button
                            variant="contained"
                            onClick={() => {
                              showWorkerInfo(worker);
                            }}
                          >
                            ערוך
                          </Button>
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
          sx={{ textAlign: "right" }}
          fullWidth
          maxWidth="md"
          open={showWorkerDialog}
          onClose={hideDialog}
        >
          <DialogContent>
            <div dir="rtl">
              <Box
                noValidate
                component="form"
                style={{ maxHeight: 600, overflowY: "auto" }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  m: "auto",
                  width: "fit-content",
                }}
              >
                <div className="row">
                  <div className="col-6">
                    <h2>פרטי עובד</h2>
                    <div
                      style={{
                        paddingTop: 10,
                        justifyContent: "space-between",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div>
                        {currentWorker && (
                          <TextField
                            className="col-6"
                            label="שם פרטי"
                            value={currentWorker.firstName}
                            onChange={(e) =>
                              onChange("firstName", e.target.value)
                            }
                          />
                        )}

                        {currentWorker && (
                          <TextField
                            className="col-6"
                            label="שם משפחה"
                            value={currentWorker.lastName}
                            onChange={(e) =>
                              onChange("lastName", e.target.value)
                            }
                          />
                        )}

                        {currentWorker && (
                          <TextField
                            label="טלפון"
                            className="col-6"
                            value={currentWorker.phone}
                            onChange={(e) => onChange("phone", e.target.value)}
                          />
                        )}

                        {currentWorker && (
                          <TextField
                            label="שלוחה"
                            className="col-6"
                            value={currentWorker.shluha}
                            onChange={(e) => onChange("shluha", e.target.value)}
                          />
                        )}

                        {currentWorker && (
                          <TextField
                            label="משתמש"
                            className="col-6"
                            value={currentWorker.userName}
                            onChange={(e) =>
                              onChange("userName", e.target.value)
                            }
                          />
                        )}

                        {currentWorker && (
                          <TextField
                            label="סיסמה"
                            className="col-6"
                            value={currentWorker.password}
                            onChange={(e) =>
                              onChange("password", e.target.value)
                            }
                          />
                        )}

                        <Select
                          label="סוג משתמש"
                          className="col-6"
                          variant="outlined"
                          value={currentWorker && currentWorker.userTypeId}
                          onChange={(e) =>
                            onChange(
                              "userTypeId",
                              parseInt(`${e.target.value}`, 10)
                            )
                          }
                        >
                          <MenuItem value="1">אדמין</MenuItem>
                          <MenuItem value="2">רגיל</MenuItem>
                        </Select>

                        {currentWorker && (
                          <Select
                            label="מחלקה"
                            className="col-6"
                            value={currentWorker.departmentId}
                            onChange={(e) =>
                              onChange(
                                "departmentId",
                                parseInt(`${e.target.value}`, 10)
                              )
                            }
                          >
                            <MenuItem value="0" />
                            <MenuItem value="5">איפוסים</MenuItem>
                            <MenuItem value="7">הנהלת חשבונות</MenuItem>
                            <MenuItem value="2">טכני</MenuItem>
                            <MenuItem value="11">יוזרים</MenuItem>
                            <MenuItem value="1">כללי</MenuItem>
                            <MenuItem value="16">ענן</MenuItem>
                            <MenuItem value="10">ציוד</MenuItem>
                            <MenuItem value="12">קיוסק</MenuItem>
                            <MenuItem value="6">שדרוגים</MenuItem>
                            <MenuItem value="8">שיווק</MenuItem>
                            <MenuItem value="3">תוכנה</MenuItem>
                            <MenuItem value="9">תמיכה</MenuItem>
                            <MenuItem value="4">תפריטים</MenuItem>
                          </Select>
                        )}

                        {currentWorker && (
                          <Select
                            label="פעיל"
                            variant="outlined"
                            value={currentWorker && currentWorker.active}
                            className="col-6"
                            onChange={(e) =>
                              onChange("active", Boolean(`${e.target.value}`))
                            }
                          >
                            <MenuItem value="false">לא פעיל</MenuItem>
                            <MenuItem value="true">פעיל</MenuItem>
                          </Select>
                        )}
                        {currentWorker && (
                          <TextField
                            label="תיאור תפקיד"
                            className="col-6"
                            value={currentWorker.jobTitle}
                            onChange={(e) =>
                              onChange("jobTitle", e.target.value)
                            }
                          />
                        )}

                        {currentWorker && (
                          <TextField
                            label="רכב"
                            className="col-6"
                            value={currentWorker.carType}
                            onChange={(e) =>
                              onChange("carType", e.target.value)
                            }
                          />
                        )}

                        {currentWorker && (
                          <TextField
                            label="מספר רכב"
                            className="col-6"
                            value={currentWorker.carNumber}
                            onChange={(e) =>
                              onChange("carNumber", e.target.value)
                            }
                          />
                        )}

                        {currentWorker && (
                          <TextField
                            label="תעודת זהות"
                            className="col-6"
                            value={currentWorker.teudatZehut}
                            onChange={(e) =>
                              onChange("teudatZehut", e.target.value)
                            }
                          />
                        )}

                        {currentWorker && (
                          <TextField
                            label="קוד מרסל"
                            className="col-6"
                            value={currentWorker.marselWorkerCode}
                            onChange={(e) =>
                              onChange(
                                "marselWorkerCode",
                                parseInt(`${e.target.value}`, 10)
                              )
                            }
                          />
                        )}

                        {currentWorker && (
                          <img
                            src={
                              currentWorker &&
                              IMAGES_PATH_WORKERS + currentWorker.imgPath
                            }
                            alt="iamge"
                            style={{
                              maxHeight: 50,
                              maxWidth: 75,
                              margin: "5px",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div id="divDepartments" className="row">
                      <h2 style={{ marginRight: "20px" }}>מחלקות - תצוגה</h2>
                      <div
                        className="row"
                        style={{
                          alignContent: "space-around",
                        }}
                      >
                        {currentDepartments &&
                          currentDepartments.map((department: IDepartment) => {
                            return (
                              <div className="col-6" key={department.id}>
                                <FormControlLabel
                                  value="start"
                                  checked={department.canSee}
                                  control={
                                    <Checkbox
                                      onChange={(e) =>
                                        onChangeDep(
                                          department.id,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label={department.departmentName}
                                  labelPlacement="end"
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id="divWorkerExpencesValues"
                  className="row"
                  style={{ marginTop: 100 }}
                >
                  <h2>הוצאות עבודה</h2>
                  <div
                    className="row"
                    style={{
                      alignContent: "space-around",
                    }}
                  >
                    <div className="row">
                      <div className="col-7">
                        {" "}
                        <Select
                          label="להוסיף"
                          variant="outlined"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            onChangeAddExpenseType(1, `${e.target.value}`)
                          }
                        >
                          {workExpensesTypesPosibleForWorker &&
                            workExpensesTypesPosibleForWorker.map(
                              (worker: IWorkExpensesType) => {
                                return (
                                  <MenuItem key={worker.id} value={worker.id}>
                                    {worker.workExpensName}
                                  </MenuItem>
                                );
                              }
                            )}
                        </Select>{" "}
                      </div>
                      <div className="col-4">
                        <NivTextField
                          label="סכום"
                          value={addNewWorkerExpenseSum}
                          onChange={(e) =>
                            setAddNewWorkerExpenseSum(e.target.value)
                          }
                        />
                      </div>
                      <div className="col-1">
                        <IconButton
                          onClick={updateWorkerExpensesValueForWorker}
                          style={{
                            background: "#F3BE80",
                            border: "1px solid rgba(0, 0, 0, 0.25)",
                            boxShadow: "inset 0px 5px 10px rgba(0, 0, 0, 0.05)",
                            borderRadius: "12px",
                          }}
                        >
                          <Tooltip title="הוסף הגדרה חדשה לעובד">
                            <SaveIcon
                              style={{
                                fontSize: 35,
                                color: "rgba(255, 255, 255, 0.9)",
                              }}
                            />
                          </Tooltip>
                        </IconButton>
                      </div>
                    </div>

                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table
                        stickyHeader
                        aria-label="הוצאות עבודה"
                        sx={{
                          "& .MuiTableRow-root:hover": {
                            backgroundColor: "primary.light",
                          },
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell align="right">הוצאות עבודה</TableCell>
                            <TableCell align="right">סכום</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {workExpensesTypes &&
                            workExpensesTypes.map(
                              (eType: IWorkExpensesType) => {
                                return (
                                  <TableRow key={eType.id} hover>
                                    <TableCell align="right">
                                      {eType.workExpensName}
                                    </TableCell>
                                    <TableCell align="right">
                                      <TextField
                                        value={eType.defValue}
                                        className="sumExpens"
                                        onChange={(e) =>
                                          updateExpenceTypePrice(
                                            eType.id,
                                            e.target.value
                                          )
                                        }
                                      />{" "}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </Box>
              <div>
                <Button
                  variant="outlined"
                  onClick={saveWorker}
                  style={{ marginTop: 40, fontSize: 20 }}
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
