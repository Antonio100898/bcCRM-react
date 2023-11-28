import {
  Button,
  Dialog,
  DialogContent,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { api } from "../../API/Api";
import { IHardware } from "../../Model/IHardware";
import HardwareCountSummery from "./HardwareCountSummery";
import { useConfirm } from "../../Context/useConfirm";

function HardwareCenter() {
  const { prompt } = useConfirm();
  const [barcode, setBarcode] = useState("");
  const [currentHardware, setCurrentHardware] = useState<IHardware>();
  const [hardwaresCount, setHardwaresCount] = useState<IHardware[]>([]);
  const [tokef, setTokef] = useState<Dayjs | null>(
    dayjs(new Date().toString())
  );
  const [hardwareTypeId, setHardwareTypeId] = useState("1");
  const [remark, setRemark] = useState("");
  const [showAddHardware, setShowAddHardware] = useState(false);
  const [showHardwareInfo, setShowHardwareInfo] = useState(false);

  const getHardwaresCount = useCallback(async () => {
    try {
      const data = await api.getHardwareCounts(barcode);
      if (data?.d.success) {
        setHardwaresCount(data.d.hardwaresCount);
      }
    } catch (error) {
      console.error(error);
    }
  }, [barcode]);

  useEffect(() => {
    getHardwaresCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHardwares = useCallback(async () => {
    try {
      const data = await api.getHardwareCounts(barcode);
      if (data?.d.success) {
        if (data.d.hardwares.length === 0) {
          setShowAddHardware(true);
        } else {
          setCurrentHardware(data.d.hardwares[0]);
          setShowHardwareInfo(true);
        }
        setHardwaresCount(data.d.hardwaresCount);
      }
    } catch (error) {
      console.error(error);
    }
  }, [barcode]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      getHardwares();
    }
  };

  const handleChange = (newValue: Dayjs | null) => {
    setTokef(newValue);
  };

  function GetDateTimeFormatEN(d: string) {
    return `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}/${new Date(
      d
    ).getFullYear()} ${new Date(d).getHours()}:${new Date(d).getMinutes()}`;
  }

  const addNewHardware = useCallback(async () => {
    const a: Partial<IHardware> = {
      id: 0,
      barcode,
      tokefExpire: GetDateTimeFormatEN(tokef!.toString()),
      hardwareType: Number.parseInt(hardwareTypeId, 10),
      place: "במחסן",
      remark,
    };
    try {
      const data = await api.updateHardware(a);
      if (data?.d.success) {
        setRemark("");
        setShowAddHardware(false);
        getHardwares();
      }
    } catch (error) {
      console.error(error);
    }
  }, [getHardwares, barcode, hardwareTypeId, remark, tokef]);

  const handleCloseDialogAdd = useCallback(() => {
    setShowAddHardware(false);
  }, []);

  const handleCloseDialogShowInfo = useCallback(() => {
    setShowHardwareInfo(false);
  }, []);

  async function UpdateHardwareTracking(h: Partial<IHardware>) {
    try {
      const data = await api.updateHardwareTracking(h);

      if (data?.d.success) {
        setShowHardwareInfo(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const changeHardwareToWareHouse = useCallback(() => {
    const h: Partial<IHardware> = {
      id: currentHardware!.id,
      statusId: 0,
      cusName: "במחסן",
      remark: "",
    };
    UpdateHardwareTracking(h);
  }, [currentHardware]);

  const changeHardwareToCustomer = useCallback(async () => {
    const cusName = await prompt("הזן שם לקוח");
    if (cusName === null || cusName === "") {
      return;
    }

    const h: Partial<IHardware> = {
      id: currentHardware!.id,
      statusId: 1,
      cusName,
      remark: currentHardware!.remark,
    };
    UpdateHardwareTracking(h);
  }, [currentHardware, prompt]);

  const changeHardwareToRepairs = useCallback(async () => {
    const desc = await prompt("הזן תיאור תקלה");
    if (desc === null || desc === "") {
      return;
    }

    const h: Partial<IHardware> = {
      id: currentHardware!.id,
      statusId: 2,
      cusName: "דנגוט",
      remark: desc,
    };
    UpdateHardwareTracking(h);
  }, [currentHardware, prompt]);

  return (
    <div>
      <div
        style={{
          fontFamily: "Rubik",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: "36px",
          lineHeight: "47px",
        }}
      >
        ניהול מחסן
      </div>

      <br />
      <TextField
        placeholder="סרוק ברקוד"
        style={{
          fontFamily: "Rubik",
          fontStyle: "normal",
          fontWeight: 300,
          fontSize: "58px",
          lineHeight: "56px",
          textAlign: "right",
        }}
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <div style={{ display: "flex", flex: "row" }}>
              <img
                src={`${process.env.PUBLIC_URL}/qr.png`}
                alt="shlomi qr"
                style={{ margin: "3px" }}
              />
            </div>
          ),
        }}
      />
      <br />
      <br />
      <br />
      <div
        style={{
          width: "100%",
          display: "flex",
          flex: "row",
          justifyContent: "space-around",
        }}
      >
        <HardwareCountSummery
          title="במחסן"
          statusId={0}
          hardwares_count={hardwaresCount}
        />

        <HardwareCountSummery
          title="אצל לקוח"
          statusId={1}
          hardwares_count={hardwaresCount}
        />

        <HardwareCountSummery
          title="בתיקון"
          statusId={2}
          hardwares_count={hardwaresCount}
        />
      </div>

      <Dialog
        dir="rtl"
        sx={{ textAlign: "right" }}
        onClose={handleCloseDialogAdd}
        maxWidth="xs"
        open={showAddHardware}
      >
        <DialogContent>
          <div>
            <p>הוסף חומרה חדשה</p>
            <TextField
              label="ברקוד"
              value={barcode}
              placeholder="ברקוד"
              fullWidth
              style={{ marginBottom: "5px" }}
            />
            <br />
            <Select
              label="סוג חומרה"
              fullWidth
              variant="outlined"
              value={hardwareTypeId}
              onChange={(e: SelectChangeEvent) =>
                setHardwareTypeId(e.target.value)
              }
              style={{ marginBottom: "5px" }}
            >
              <MenuItem value="1">מדפסת</MenuItem>
              <MenuItem value="2">מסך</MenuItem>
              <MenuItem value="3">מחשב</MenuItem>
            </Select>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="תוקף אחריות"
                format="DD/MM/YYYY"
                value={tokef}
                onChange={handleChange}
                slotProps={{ textField: { sx: { marginBottom: "5px" } } }}
              />
            </LocalizationProvider>
            <br />
            <TextField
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              fullWidth
              placeholder="הערות לחומרה"
              style={{ marginBottom: "5px" }}
            />
            <br />
            <Button variant="contained" onClick={addNewHardware} fullWidth>
              הוסף חומרה למחסן
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        dir="rtl"
        sx={{ textAlign: "right" }}
        onClose={handleCloseDialogShowInfo}
        fullWidth
        maxWidth="md"
        open={showHardwareInfo}
      >
        <DialogContent>
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "#FFAD4A" }}>
              <h3>פרטי חומרה</h3>
            </div>
            <div style={{ display: "flex", flex: "row", textAlign: "center" }}>
              <div style={{ width: "50%" }}>
                <p>סטטוס: {currentHardware && currentHardware.statusName}</p>
                <TextField
                  label="ברקוד"
                  value={currentHardware && currentHardware.barcode}
                  placeholder="ברקוד"
                  fullWidth
                  style={{ marginBottom: "5px" }}
                />
                <br />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="תוקף אחריות"
                    format="DD/MM/YYYY"
                    value={
                      currentHardware
                        ? dayjs(currentHardware.tokefExpireEN)
                        : dayjs()
                    }
                    onChange={handleChange}
                  />
                </LocalizationProvider>
                <br />
                <TextField
                  value={currentHardware && currentHardware.remark}
                  onChange={(e) => setRemark(e.target.value)}
                  fullWidth
                  label="הערות לחומרה"
                  placeholder="הערות לחומרה"
                  style={{ marginBottom: "5px", marginTop: "5px" }}
                />
                <br />
                <TextField
                  value={currentHardware && currentHardware.place}
                  onChange={(e) => setRemark(e.target.value)}
                  fullWidth
                  label="מיקום נוכחי"
                  placeholder="מיקום נוכחי"
                  style={{ marginBottom: "5px", marginTop: "5px" }}
                />
                <div>
                  <Button
                    variant="contained"
                    onClick={changeHardwareToWareHouse}
                    style={{ width: "33%" }}
                  >
                    למחסן
                  </Button>
                  <Button
                    variant="contained"
                    onClick={changeHardwareToCustomer}
                    style={{ width: "33%" }}
                  >
                    ללקוח
                  </Button>
                  <Button
                    variant="contained"
                    onClick={changeHardwareToRepairs}
                    style={{ width: "33%" }}
                    fullWidth
                  >
                    לתיקון
                  </Button>
                </div>
              </div>

              <div style={{ width: "50%" }}>הסטורית חומרה</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HardwareCenter;
