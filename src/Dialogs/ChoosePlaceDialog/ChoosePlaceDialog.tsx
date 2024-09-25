import { FunctionComponent, useEffect, useState } from "react";
import CustomDialog, { CustomDialogProps } from "../CustomDialog";
import {
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import FormInputWrapper from "../../components/BaseCompnents/FormInputWrapper";
import CustomInput from "../../components/customInput/customInput";
import { placeService } from "../../API/services/placeService";
import { enqueueSnackbar } from "notistack";
import { IPhonePlace, IProblem } from "../../Model";
import DataField from "../../components/DataField/DataField";
import { useUser } from "../../Context/useUser";
import { TOKEN_KEY } from "../../Consts/Consts";
import { problemService } from "../../API/services";
import PlaceDetailsDialog from "../PlaceDetailsDialog/PlaceDetailsDialog";
import EditIcon from "@mui/icons-material/Edit";

interface ChoosePlaceDialogProps extends CustomDialogProps {}

const ChoosePlaceDialog: FunctionComponent<ChoosePlaceDialogProps> = ({
  onClose,
  open,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [phone, setPhone] = useState("");
  const [places, setPlaces] = useState<IPhonePlace[]>([]);
  const [currentPlace, setCurrentPlace] = useState<IPhonePlace>();
  const [placeDetailsDialogOpen, setPlaceDetailsDialogOpen] = useState(false);

  const { user, updateShowProblemDialog, updateCurrentProblem } = useUser();

  const onPhoneValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const phoneRegExp = new RegExp("^[0-9]*$");
    const val = e.currentTarget.value;
    if (!phoneRegExp.test(val)) return;
    setPhone(val);
  };

  const fetchPlaces = async () => {
    try {
      const data = await placeService.getPlacesForPhone(phone);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: "לא מצליח למשוך לקוחות קיימים",
          variant: "error",
        });
      } else {
        setPlaces(data?.d.places);
      }
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
    }
  };

  const selectPlace = async (place: IPhonePlace) => {
    if (!user) return;
    const workerKey: string = localStorage.getItem(TOKEN_KEY) || "";
    const problem: IProblem = {
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
      callCustomerBack: false,
      crmFiles: [],
      departmentName: "",
      desc: "",
      fileCount: 0,
      files: [],
      filesName: "",
      finishTime: "",
      finishTimeEN: "",
      historySummery: "",
      id: 0,
      ip: "",
      isLocked: false,
      lastSuppoter: "",
      msgLinesCount: 0,
      problemTypesList: [],
      solution: "",
      statusId: 0,
      statusName: "",
      takingCare: false,
      toWorker: 0,
      toWorkerJobTitle: "",
      toWorkerName: "",
      trackingId: 0,
      updaterWorkerDepartmentId: 0,
      updaterWorkerId: 0,
      updaterWorkerName: "",
      vip: false,
      workerCreateId: 0,
    };
    try {
      //because we dont provide problem id, server will append a new one to the database
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

      updateCurrentProblem(problem);
      updateShowProblemDialog(true);
    } catch (error) {
      console.error(error);
    }

    onClose();
  };

  const onCreateNewClick = () => {
    setCurrentPlace({
      id: 0,
      bizNumber: "",
      customerName: "",
      phone: "",
      phoneId: 0,
      placeId: 0,
      placeName: "",
      placeRemark: "",
      vip: false,
      warrantyType: 0,
    });
    setPlaceDetailsDialogOpen(true);
  };

  const onUpdatePlaceClick = (place: IPhonePlace) => {
    setCurrentPlace(place);
    setPlaceDetailsDialogOpen(true);
  };

  useEffect(() => {
    if (phone.length < 5) return;
    fetchPlaces();
  }, [phone]);

  return (
    <>
      <CustomDialog
        title="בחירת עסק"
        onClose={onClose}
        open={open}
        fullScreen={isMobile}
      >
        <Stack direction="row" justifyContent="space-between">
          <FormInputWrapper label="מספר טלפון">
            <CustomInput
              fullWidth={isMobile}
              sx={{ maxWidth: isMobile ? undefined : "200px" }}
              type="text"
              value={phone}
              onChange={onPhoneValueChange}
            />
          </FormInputWrapper>
          <Tooltip title="הוסף חדש">
            <IconButton
              onClick={onCreateNewClick}
              color="secondary"
              sx={{ height: "max-content", alignSelf: "flex-end" }}
            >
              <img src="plus.svg" alt="plus_icon" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack
          gap={1}
          sx={{
            mt: 2,
            borderTop: "solid grey 1px",
            py: 1,
            borderColor: "secondary.main",
          }}
        >
          {places.length > 0 && (
            <>
              <DataField sx={{ mb: 2, width: "calc(100% - 44px)" }}>
                <Stack direction="row">
                  <Typography fontWeight={600} sx={{ width: "40%" }}>
                    עסק
                  </Typography>
                  <Typography fontWeight={600} sx={{ width: "30%" }}>
                    שם לקוח
                  </Typography>
                  <Typography
                    textAlign="end"
                    fontWeight={600}
                    sx={{ width: "40%" }}
                  >
                    טלפון
                  </Typography>
                </Stack>
              </DataField>
            </>
          )}
          {places.map((p) => (
            <Stack direction="row" gap={0.5}>
              <DataField
                onClick={() => selectPlace(p)}
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  ":hover": {
                    backgroundColor: "secondary.light",
                  },
                }}
              >
                <Stack direction="row">
                  <Typography sx={{ width: "40%" }}>{p.placeName}</Typography>
                  <Typography sx={{ width: "30%" }}>
                    {p.cusName}
                  </Typography>
                  <Typography sx={{ width: "40%" }} textAlign="end">
                    {p.phone}
                  </Typography>
                </Stack>
              </DataField>

              <IconButton
                sx={{ height: "max-content" }}
                onClick={() => onUpdatePlaceClick(p)}
              >
                <EditIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </CustomDialog>
      {currentPlace && (
        <PlaceDetailsDialog
          onClose={() => setPlaceDetailsDialogOpen(false)}
          open={placeDetailsDialogOpen}
          phonePlace={currentPlace}
        />
      )}
    </>
  );
};

export default ChoosePlaceDialog;
