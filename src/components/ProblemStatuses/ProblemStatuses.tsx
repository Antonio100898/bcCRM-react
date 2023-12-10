import { Button, Tooltip, Box } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import "./ProblemStatuses.style.css";

type Props = {
  isLockEnable: boolean;
  setIsLocked: () => void;
  setEmergency: () => void;
  setTakeCare: () => void;
  emergencyId: number;
  takingCare: boolean;
  isLocked: boolean;
  callCustomerBack: boolean;
  setCallCustomerBack: () => void;
  bigScreen: boolean;
};

const ProblemStatuses = ({
  isLockEnable,
  setIsLocked,
  emergencyId,
  isLocked,
  setEmergency,
  setTakeCare,
  takingCare,
  setCallCustomerBack,
  callCustomerBack,
  bigScreen,
}: Props) => {
  return (
    <Box className={bigScreen? "statusButtonsWrapper" : "statusButtonsWrapper-small"}>
      <Button
        className={`${bigScreen? "statusButton ": "statusButton-small"} button-flex-column`}
        onClick={setCallCustomerBack}
        sx={{ opacity: callCustomerBack ? 1 : 0.2,  color: "rgba(0, 0, 0, 0.87)" }}
      >
        <ContactPhoneIcon
          style={{
            color: "blue",
          }}
        />
        חזור ללקוח
      </Button>
      <Button
        className={`${bigScreen? "statusButton ": "statusButton-small"} button-flex-column`}
        onClick={setEmergency}
        sx={{ opacity: emergencyId === 0 ? 0.2 : 1,  color: "rgba(0, 0, 0, 0.87)" }}
      >
        <NotificationsActiveIcon
          style={{
            color: "red",
          }}
        />
        דחוף
      </Button>

      <Button
        className={`${bigScreen? "statusButton ": "statusButton-small"} button-flex-column`}
        onClick={setTakeCare}
        sx={{ opacity: takingCare ? 1 : 0.2,  color: "rgba(0, 0, 0, 0.87)" }}
      >
        <AccessTimeIcon
          style={{
            color: "orange",
          }}
        />
        בטיפול
      </Button>
      {isLockEnable && (
        <Tooltip title="נעול, רק היוצר והעובד שמטפל יכולים לשנות">
          <Button
            className={`${bigScreen? "statusButton ": "statusButton-small"} button-flex-column`}
            onClick={setIsLocked}
            sx={{ opacity: isLocked ? 1 : 0.2,  color: "rgba(0, 0, 0, 0.87)" }}
          >
            {isLocked ? (
              <LockIcon
                style={{
                  color: "blue",
                }}
              />
            ) : (
              <LockOpenIcon
                style={{
                  color: "blue",
                }}
              />
            )}
            נעול
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

export default ProblemStatuses;
