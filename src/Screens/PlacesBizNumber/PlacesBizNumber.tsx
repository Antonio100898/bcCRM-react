import {
  Box,
  Button,
  Dialog,
  DialogContent,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../../API/axoisConfig";
import { NivTextField } from "../../components/BaseCompnents/NivTextField/NivTextField";
import { IPlace } from "../../Model";
import { useConfirm } from "../../Context/useConfirm";
import { useUser } from "../../Context/useUser";

export default function PlacesBizNumber() {
  const { confirm } = useConfirm();
  const { updateShowLoader } = useUser();
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [currentPlace, setCurrentPlace] = useState<Partial<IPlace>>();
  const [filterWorkerName, setFilterWorkerName] = useState("");
  const [filterBiznumber, setFilterBiznumber] = useState("");
  const [showPlaceDialog, updateShowPlaceDialog] = useState<boolean>(false);

  const getPlaces = () => {
    updateShowLoader(true);
    // workerKey: localStorage.getItem(TOKEN_KEY),
    api
      .post("/GetPlacesBizNumber", {
        workerKey: "123",
      })
      .then(({ data }) => {
        setPlaces(data.d.places);
        updateShowLoader(false);
      });
  };

  useEffect(() => {
    getPlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterWorkerName]);

  const addNewPlace = () => {
    setCurrentPlace({ id: 0, placeName: "", bizNumber: "", warrantyType: 0 });
    updateShowPlaceDialog(true);
  };

  const hideDialog = () => {
    updateShowPlaceDialog(false);
  };

  const savePlace = async () => {
    const sameName: IPlace[] = places.filter((a: IPlace) =>
      a.placeName.includes(currentPlace?.placeName || "")
    );

    const sameBizNumber: IPlace[] = places.filter((a: IPlace) =>
      a.bizNumber.includes(currentPlace?.bizNumber || "")
    );

    if (sameName.length > 0) {
      if (!(await confirm("קיים מקום עם אותו השם, האם ברצונך להמשיך?"))) {
        return;
      }
    }

    if (sameBizNumber.length > 0) {
      if (!(await confirm("קיים מקום עם אותו החפ, האם ברצונך להמשיך?"))) {
        return;
      }
    }

    api
      .post("/UpdatePlaceBizNumber", {
        workerKey: "123",
        id: currentPlace?.id,
        placeName: currentPlace?.placeName,
        bizNumber: currentPlace?.bizNumber,
        warrantyType: currentPlace?.warrantyType,
      })
      .then(() => {
        getPlaces();
        updateShowPlaceDialog(false);
      });
  };

  const onChange = <K extends keyof IPlace>(key: K, val: IPlace[K]) => {
    setCurrentPlace({ ...currentPlace, [key]: val });
  };

  function showWorkerInfo(place: IPlace) {
    setCurrentPlace(place);
    updateShowPlaceDialog(true);
  }

  return (
    <div>
      <h2>מסופונים נייחים דג&apos;וו</h2>

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
                <TableCell align="right">
                  <NivTextField
                    style={{}}
                    variant="standard"
                    dir="rtl"
                    label="מקום"
                    value={filterWorkerName}
                    onChange={(e) => setFilterWorkerName(e.target.value)}
                  />
                </TableCell>
                <TableCell align="right">
                  {" "}
                  <NivTextField
                    style={{}}
                    variant="standard"
                    dir="rtl"
                    label="חפ"
                    value={filterBiznumber}
                    onChange={(e) => setFilterBiznumber(e.target.value)}
                  />
                </TableCell>
                <TableCell align="right">סוג אחריות</TableCell>
                <TableCell align="right">
                  <Button variant="contained" onClick={addNewPlace}>
                    חדש
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {places &&
                places
                  .filter((a: IPlace) => a.placeName.includes(filterWorkerName))
                  .filter((a: IPlace) => a.bizNumber.includes(filterBiznumber))
                  .map((place: IPlace) => {
                    return (
                      <TableRow key={place.id} hover>
                        <TableCell align="right">{place.placeName}</TableCell>

                        <TableCell align="right">{place.bizNumber}</TableCell>

                        <TableCell
                          align="right"
                          style={{
                            color: place.warrantyType === 0 ? "red" : "green",
                            fontSize: "32px",
                            border: "1px solid",
                            textAlign: "center",
                          }}
                        >
                          {place.warrantyType === 0
                            ? "שכירות טכנאי שלנו"
                            : "רכישה תיקון שמעון"}
                        </TableCell>

                        <TableCell align="right">
                          <Button
                            variant="contained"
                            onClick={() => {
                              showWorkerInfo(place);
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
          maxWidth="xs"
          open={showPlaceDialog}
          onClose={hideDialog}
        >
          <DialogContent>
            <div dir="rtl">
              <Box
                noValidate
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  m: "auto",
                  width: "fit-content",
                }}
              >
                <div className="row">
                  <div className="col-12">
                    <div
                      style={{
                        paddingTop: 10,
                        justifyContent: "space-between",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div>
                        <NivTextField
                          className="col-12"
                          label="שם המקום"
                          value={currentPlace?.placeName}
                          onChange={(e) =>
                            onChange("placeName", e.target.value)
                          }
                        />

                        <NivTextField
                          label="ח.פ."
                          className="col-12"
                          type="number"
                          value={currentPlace?.bizNumber}
                          onChange={(e) =>
                            onChange("bizNumber", e.target.value)
                          }
                        />

                        <Select
                          label="אחריות"
                          className="col-12"
                          variant="outlined"
                          value={currentPlace && currentPlace.warrantyType}
                          onChange={(e) =>
                            onChange(
                              "warrantyType",
                              parseInt(`${e.target.value}`, 10)
                            )
                          }
                        >
                          <MenuItem value="0">שכירות טכנאי שלנו</MenuItem>
                          <MenuItem value="1">רכישה תיקון שמעון</MenuItem>
                        </Select>
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
