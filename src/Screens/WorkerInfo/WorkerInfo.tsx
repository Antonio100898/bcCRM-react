import {
  TextField,
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { IMAGES_PATH_WORKERS } from "../../Consts/Consts";
import { IWorker } from "../../Model";
import WorkersHeader from "../../components/Workers/WorkersHeader";
import { useUser } from "../../Context/useUser";
import { workerService } from "../../API/services";
import { TextFieldsTwoTone } from "@mui/icons-material";

export default function WorkerInfo() {
  const { enqueueSnackbar } = useSnackbar();
  const { updateShowLoader, user, updateUser } = useUser();
  const [currentWorker, setCurrentWorker] = useState<Partial<IWorker>>();
  const history = useNavigate();

  const fetchWorker = async () => {
    try {
      const data = await workerService.getWorker();
      if (data?.d.success) setCurrentWorker(data.d.worker);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorker();
  }, []);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(`${reader.result}`);
      reader.onerror = (error) => reject(error);
    });

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

  const onChange = <K extends keyof IWorker>(key: K, val: IWorker[K]) => {
    setCurrentWorker({ ...currentWorker, [key]: val });
  };

  const saveWorker = async () => {
    if (!currentWorker || !validaWorker()) {
      return;
    }
    updateShowLoader(true);
    try {
      const data = await workerService.updateWorker(currentWorker);
      if (data?.d.success) {
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

        updateShowLoader(false);

        history("/WorkerPeronalSpace");
      } else {
        enqueueSnackbar({
          message: "נכשל לעדכן את העובד",
          variant: "error",
        });
        updateShowLoader(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", px: 2, mb: 10 }}>
      <WorkersHeader />
      {currentWorker && (
        <Stack gap={2}>
          <Box>
            <Typography sx={{ mb: 3 }} variant="h4">
              פרטים אישיים
            </Typography>
            <Box>
              <Stack direction={isMobile ? "column" : "row"} gap={3}>
                <TextField
                  variant="filled"
                  fullWidth={isMobile}
                  label="שם פרטי"
                  value={currentWorker.firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                />
                <TextField
                  variant="filled"
                  label="שם משפחה"
                  value={currentWorker.lastName}
                  onChange={(e) => onChange("lastName", e.target.value)}
                />
                <TextField
                  variant="filled"
                  label="תעודת זהות"
                  value={currentWorker.teudatZehut}
                  onChange={(e) => onChange("teudatZehut", e.target.value)}
                />
              </Stack>
              <div style={{ display: "flex" }}>
                <div>
                  <Button sx={{ mt: 2 }} variant="contained" component="label">
                    העלת התמונה
                    <input
                      type="file"
                      name="myImage"
                      hidden
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
                  </Button>
                </div>
              </div>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ mb: 3 }} variant="h4">
              פרטי התחברות
            </Typography>
            <Stack direction={isMobile ? "column" : "row"} gap={3}>
              <TextField
                variant="filled"
                label="שם משתמש"
                value={currentWorker.userName}
                onChange={(e) => onChange("userName", e.target.value)}
              />
              <TextField
                variant="filled"
                label="סיסמה"
                value={currentWorker.password}
                onChange={(e) => onChange("password", e.target.value)}
              />
            </Stack>
          </Box>
          <Box>
            <Typography sx={{ mb: 3 }} variant="h4">
              טלפון\שלוחה
            </Typography>
            <Stack direction={isMobile ? "column" : "row"} gap={3}>
              <TextField
                variant="filled"
                label="טלפון"
                value={currentWorker.phone}
                onChange={(e) => onChange("phone", e.target.value)}
              />

              <TextField
                variant="filled"
                label="שלוחה"
                value={currentWorker.shluha}
                onChange={(e) => onChange("shluha", e.target.value)}
              />
            </Stack>
          </Box>
          <Box>
            <Typography sx={{ mb: 3 }} variant="h4">
              רכב
            </Typography>
            <Stack direction={isMobile ? "column" : "row"} gap={3}>
              <TextField
                variant="filled"
                label="סוג רכב"
                value={currentWorker.carType}
                onChange={(e) => onChange("carType", e.target.value)}
              />

              <TextField
                variant="filled"
                label="מספר רכב"
                value={currentWorker.carNumber}
                onChange={(e) => onChange("carNumber", e.target.value)}
              />
            </Stack>
          </Box>

          <Button
            sx={{ my: 2, py: 2 }}
            variant="contained"
            onClick={saveWorker}
          >
            שמור
          </Button>
        </Stack>
      )}
    </Box>
  );
}
