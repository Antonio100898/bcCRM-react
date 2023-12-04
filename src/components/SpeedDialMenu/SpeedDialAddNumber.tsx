import * as React from "react";
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
  Fab,
} from "@mui/material";

import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import { IProblem } from "../../Model";
import { TOKEN_KEY } from "../../Consts/Consts";
import { useUser } from "../../Context/useUser";
import { placeService } from "../../API/services/placeService";
import { problemService } from "../../API/services";
import { IPhonePlace } from "../../Model/IPhonePlace";

export default function SpeedDialAddNumber() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateShowProblemDialog, updateCurrentProblem } = useUser();
  const [placesOptions, setPlacesOptions] = React.useState<IPhonePlace[]>();
  const [showSelectPlace, setShowSelectPlace] = React.useState(false);
  const [showAddNewPlace, setShowAddNewPlace] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [newPlaceId, setNewPlaceId] = React.useState(0);
  const [newPlaceName, setNewPlaceName] = React.useState("");
  const [newCusName, setNewCusName] = React.useState("");
  const [newRemark, setNewRemark] = React.useState("");
  const [newVip, setNewVip] = React.useState(false);
  const history = useNavigate();

  const workerKey: string = localStorage.getItem(TOKEN_KEY) || "";

  const getPlaces = async () => {
    try {
      const data = await placeService.getPlacesForPhone(phone);
      if (data?.d.success) setPlacesOptions(data.d.places);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (phone && phone.length > 6) {
      getPlaces();
    } else {
      setPlacesOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  const NewPhoneClicked = () => {
    setPhone("");
    setShowSelectPlace(true);
  };

  const selectPlace = async (place: IPhonePlace) => {
    const problem: Partial<IProblem> = {
      workerKey,
      workerCreateName: user?.workerName || "",
      customerName: place.customerName,
      phoneId: place.phoneId,
      phone: place.phone,
      departmentId: user?.department,
      emergencyId: 0,
      placeId: place.placeId,
      placeName: place.placeName,
      toWorkers: [],
      newFiles: [],
      startTime: `${new Date().toLocaleString()}`,
      startTimeEN: new Date().toString(),
      problemTypes: [],
    };
    try {
      const data = await problemService.updateProblem(problem);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל להוסיף תקלה חדשה. ${data?.d.msg}`,
          variant: "error",
        });
        return;
      }

      problem.id = data.d.problemId!;
      problem.toWorker = data.d.workerId;

      updateCurrentProblem(problem);
      updateShowProblemDialog(true);

      if (!window.location.href.endsWith("/Problems")) {
        history("/Problems");
      }
    } catch (error) {
      console.error(error);
    }

    setShowSelectPlace(false);
  };

  const InputNewPlace = async () => {
    if (newPlaceName && newPlaceName?.length === 0) {
      enqueueSnackbar({
        message: "אנא הזן שם מקום חדש",
        variant: "error",
      });
      return;
    }

    if (newPlaceName === null || newPlaceName === "") {
      enqueueSnackbar({
        message: "אנא הזן שם מקום חדש",
        variant: "error",
      });
      return;
    }

    if (newCusName && newCusName?.length === 0) {
      enqueueSnackbar({
        message: "אנא הזן שם הלקוח",
        variant: "error",
      });
      return;
    }

    if (newCusName === null || newCusName === "" || newCusName === undefined) {
      enqueueSnackbar({
        message: "אנא הזן שם הלקוח",
        variant: "error",
      });
      return;
    }

    if (phone && phone?.length < 8) {
      enqueueSnackbar({
        message: "אנא הזן טלפון",
        variant: "error",
      });
      return;
    }

    const p: IPhonePlace = {
      id: 0,
      phoneId: 0,
      phone,
      placeId: 0,
      placeName: newPlaceName!,
      customerName: newCusName!,
      vip: false,
      placeRemark: "",
      bizNumber: "",
      warrantyType: 0,
    };

    try {
      const data = await placeService.updatePhonePlace({
        placeId: newPlaceId,
        phone,
        phoneId: 0,
        placeName: newPlaceName,
        cusName: newCusName || "",
        remark: newRemark || "",
        vip: newVip,
      });
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל להוסיף תקלה חדשה. ${data?.d.msg}`,
          variant: "error",
        });
        return;
      }

      setNewPlaceName("");
      setNewCusName("");
      setNewRemark("");
      setShowAddNewPlace(false);

      if (newPlaceId === 0) {
        selectPlace(p);
      } else {
        getPlaces();
      }
    } catch (error) {
      console.error(error);
    }
  };

  function EditPlace(placeId: number) {
    const place: IPhonePlace[] =
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
    <div>
      <Tooltip title="הזן טלפון">
        <Fab onClick={NewPhoneClicked} color="primary">
          <SpeedDialIcon />
        </Fab>
      </Tooltip>

      <Dialog
        dir="rtl"
        sx={{ textAlign: "right" }}
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
                onChange={(e) => setPhone(e.target.value)}
                inputProps={{ style: { fontSize: 48, textAlign: "center" } }}
                style={{
                  fontFamily: "Heebo",
                  fontStyle: "normal",
                  fontWeight: "300",
                  lineHeight: "70px",
                  color: "rgba(0, 0, 0, 0.65)",
                  textAlign: "center",
                  boxShadow:
                    "0px 2px 4px rgba(0, 0, 0, 0.25) inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div
              className="col-4 left"
              style={{
                fontFamily: "Heebo",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "26px",
                lineHeight: "38px",
                padding: "10px",
                color: "rgba(0, 0, 0, 0.75)",
              }}
            >
              {`${new Date().getHours()}:${new Date().getMinutes()} ${new Date().toLocaleDateString()}`}
              <br />
              <p
                style={{
                  fontFamily: "Rubik",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "26px",
                  lineHeight: "35px",
                }}
              >
                {user && user.workerName}
              </p>
            </div>
          </div>

          <TableContainer style={{ height: "750px" }}>
            <Table aria-label="תקלות">
              <TableHead>
                <TableRow
                  style={{
                    background: "#FFE1BE",
                    border: "1px black solid",
                  }}
                >
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: "Heebo",
                      fontStyle: "ExtraBold",
                      fontWeight: 800,
                      fontSize: "32px",
                      lineHeight: "47px",
                      padding: 0,
                    }}
                  >
                    שם עסק
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: "Heebo",
                      fontStyle: "ExtraBold",
                      fontWeight: 800,
                      fontSize: "32px",
                      padding: 0,
                    }}
                  >
                    לקוח
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: "Heebo",
                      fontStyle: "ExtraBold",
                      fontWeight: 800,
                      fontSize: "32px",
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
                        setNewPlaceName("");
                        setNewCusName("");
                        setNewRemark("");
                        setShowAddNewPlace(true);
                      }}
                      style={{
                        background: "#F3BE80",
                        border: "1px solid rgba(0, 0, 0, 0.25)",
                        boxShadow: "inset 0px 5px 10px rgba(0, 0, 0, 0.05)",
                        borderRadius: "12px",
                      }}
                    >
                      <Tooltip title="הוסף עסק חדש">
                        <AddIcon
                          style={{
                            fontSize: 35,
                            color: "rgba(255, 255, 255, 0.9)",
                            background: "#F3BE80",
                            borderRadius: "12px",
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
                        key={place.placeId}
                        onClick={() => {
                          return selectPlace(place);
                        }}
                      >
                        <TableCell
                          align="center"
                          style={{
                            fontFamily: "Heebo",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "32px",
                            padding: 0,
                          }}
                        >
                          {place.placeName}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontFamily: "Heebo",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "32px",
                            padding: 0,
                          }}
                        >
                          {place.customerName}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontFamily: "Heebo",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "32px",
                            padding: 0,
                          }}
                        >
                          {place.placeRemark}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontFamily: "Heebo",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "32px",
                            padding: 0,
                          }}
                        >
                          {place.vip && (
                            <Tooltip title="vip">
                              <StarIcon
                                style={{ color: "goldenrod", fontSize: "30px" }}
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
                                style={{ color: "blue", marginRight: 5 }}
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
        sx={{ textAlign: "right" }}
        fullWidth
        onClose={() => setShowAddNewPlace(false)}
        maxWidth="xs"
        open={showAddNewPlace}
      >
        <DialogContent>
          <div>
            <TextField
              value={newPlaceName}
              onChange={(e) => setNewPlaceName(e.target.value)}
              placeholder="שם עסק"
              fullWidth
              style={{
                background: "#FFFFFF",
                boxShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                borderRadius: "8px",
              }}
            />
            <br />
            <TextField
              value={newCusName}
              onChange={(e) => setNewCusName(e.target.value)}
              placeholder="שם לקוח"
              fullWidth
              style={{
                background: "#FFFFFF",
                boxShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                borderRadius: "8px",
              }}
            />
            <TextField
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="טלפון"
              fullWidth
              style={{
                background: "#FFFFFF",
                boxShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                borderRadius: "8px",
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
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 2px 4px rgba(0, 0, 0, 0.25), inset 0px -4px 2px rgba(91, 91, 91, 0.1)",
                  borderRadius: "8px",
                }}
              />
            )}

            {user && user.userType === 1 && (
              <FormControlLabel
                style={{ marginRight: "10px" }}
                value="newVip"
                checked={newVip}
                control={
                  <Checkbox onChange={(e) => setNewVip(e.target.checked)} />
                }
                label="VIP"
                labelPlacement="start"
              />
            )}

            <Button variant="contained" fullWidth onClick={InputNewPlace}>
              {newPlaceId > 0 ? "עדכן" : "הוסף חדש"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
