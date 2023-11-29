import "./WorkerInfo.styles.css";
import { TextField, Tooltip, IconButton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { api } from "../../API/Api";
import { IMAGES_PATH_WORKERS, TOKEN_KEY } from "../../Consts/Consts";
import { IWorker } from "../../Model";
import WorkersHeader from "../../components/Workers/WorkersHeader";
import { NivTextField } from "../../components/BaseCompnents/NivTextField/NivTextField";
import { useUser } from "../../Context/useUser";

export default function WorkerInfo() {
  const { enqueueSnackbar } = useSnackbar();
  const { updateShowLoader, user, updateUser } = useUser();
  const [currentWorker, setCurrentWorker] = useState<Partial<IWorker>>();
  const history = useNavigate();
  useEffect(() => {
    api
      .post("/GetWorker", {
        workerKey: localStorage.getItem(TOKEN_KEY),
      })
      .then(({ data }) => {
        // console.log(data.d.worker);
        setCurrentWorker(data.d.worker);
      });
  }, []);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(`${reader.result}`);
      reader.onerror = (error) => reject(error);
    });

  const validaWorker = useCallback(() => {
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
  }, [currentWorker, enqueueSnackbar]);

  const onChange = useCallback(
    <K extends keyof IWorker>(key: K, val: IWorker[K]) => {
      setCurrentWorker({ ...currentWorker, [key]: val });
    },
    [currentWorker]
  );

  const saveWorker = useCallback(async () => {
    if (!validaWorker()) {
      return;
    }

    // console.log(currentWorker);

    updateShowLoader(true);
    api
      .post("/UpdateWorker", {
        worker: { ...currentWorker },
        departments: null,
        workerExpensesValue: null,
        workerKey: localStorage.getItem(TOKEN_KEY),
      })
      .then(({ data }) => {
        // console.log(data.d);
        if (data.d.success) {
          if (data.d.msg && data.d.msg.length > 0) {
            setCurrentWorker({
              ...currentWorker,
              imgContentName: data.d.msg,
            });

            if (user) {
              updateUser({
                ...user,
                imgPath: IMAGES_PATH_WORKERS + data.d.msg,
              });
            }
            onChange("imgPath", data.d.msg);
          }

          // console.log("new Image Name: " + data.d);

          updateShowLoader(false);

          history("/WorkerPeronalSpace");
        } else {
          enqueueSnackbar({
            message: "נכשל לעדכן את העובד",
            variant: "error",
          });
          updateShowLoader(false);
        }
      });

    // updateShowWorkerDialog(false);
  }, [
    validaWorker,
    updateShowLoader,
    currentWorker,
    history,
    user,
    onChange,
    updateUser,
    enqueueSnackbar,
  ]);

  return (
    <div style={{ marginRight: 10, marginLeft: 10 }}>
      <WorkersHeader />
      {currentWorker && (
        <div>
          <div className="row right">
            <p className="sectionHeader center">פרטים אישיים</p>
          </div>
          <div className="row rowInfo">
            <div className="col-xs-12 col-md-6 col-lg-3">
              <NivTextField
                className="inputBox"
                fullWidth
                label="שם פרטי"
                value={currentWorker.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-3">
              <NivTextField
                className="inputBox"
                fullWidth
                label="שם משפחה"
                value={currentWorker.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
              />
            </div>
            <div className="col-xs-6 col-md-6 col-lg-2">
              <NivTextField
                className="inputBox"
                fullWidth
                label="תעודת זהות"
                value={currentWorker.teudatZehut}
                onChange={(e) => onChange("teudatZehut", e.target.value)}
              />
            </div>
            <div
              className="col-xs-6 col-md-6 col-lg-4"
              style={{ display: "flex" }}
            >
              <img
                src={
                  currentWorker && IMAGES_PATH_WORKERS + currentWorker.imgPath
                }
                alt="iamge"
                style={{
                  width: 50,
                  height: 50,
                  margin: 5,
                  borderRadius: 50,
                }}
              />
              <div>
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
          </div>

          <div className="row right">
            <p className="sectionHeader">פרטי התחברות</p>
          </div>
          <div className="row rowInfo">
            <div className="col-xs-12 col-md-6 col-lg-3">
              <TextField
                className="inputBox"
                fullWidth
                label="שם משתמש"
                value={currentWorker.userName}
                onChange={(e) => onChange("userName", e.target.value)}
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-3">
              <TextField
                className="inputBox"
                fullWidth
                label="סיסמה"
                value={currentWorker.password}
                onChange={(e) => onChange("password", e.target.value)}
              />
            </div>
          </div>

          <div className="row right">
            <p className="sectionHeader">טלפון/שלוחה</p>
          </div>
          <div className="row rowInfo">
            <div className="col-xs-12 col-md-6 col-lg-3">
              <NivTextField
                className="inputBox"
                fullWidth
                label="טלפון"
                value={currentWorker.phone}
                onChange={(e) => onChange("phone", e.target.value)}
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-3">
              <NivTextField
                className="inputBox"
                fullWidth
                label="שלוחה"
                value={currentWorker.shluha}
                onChange={(e) => onChange("shluha", e.target.value)}
              />
            </div>
          </div>

          <div className="row right">
            <p className="sectionHeader">רכב</p>
          </div>
          <div className="row rowInfo">
            <div className="col-xs-12 col-md-6 col-lg-3">
              <NivTextField
                className="inputBox"
                fullWidth
                label="סוג רכב"
                value={currentWorker.carType}
                onChange={(e) => onChange("carType", e.target.value)}
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-3">
              <NivTextField
                className="inputBox"
                fullWidth
                label="מספר רכב"
                value={currentWorker.carNumber}
                onChange={(e) => onChange("carNumber", e.target.value)}
              />
            </div>
          </div>
          <div className="left">
            <Tooltip title="שמור">
              <IconButton
                onClick={saveWorker}
                style={{
                  background: "#F3BE80",
                  borderRadius: "12px",
                  margin: 5,
                }}
              >
                <SaveIcon
                  style={{ fontSize: 40, color: "rgba(255, 255, 255, 0.9)" }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
}
