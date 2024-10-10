import { Button, Tooltip, Box } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

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
}: Props) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
      <Button
        onClick={setCallCustomerBack}
        sx={{
          opacity: callCustomerBack ? 1 : 0.2,
          color: "rgba(0, 0, 0, 0.87)",
          p: 0,
        }}
      >
        <ContactPhoneIcon
          sx={{
            color: "blue",
          }}
        />
        חזור ללקוח
      </Button>
      <Button
        onClick={setEmergency}
        sx={{
          opacity: emergencyId === 0 ? 0.2 : 1,
          color: "rgba(0, 0, 0, 0.87)",
          p: 0,
        }}
      >
        <NotificationsActiveIcon
          sx={{
            color: "red",
          }}
        />
        דחוף
      </Button>

      <Button
        onClick={setTakeCare}
        sx={{
          opacity: takingCare ? 1 : 0.2,
          color: "rgba(0, 0, 0, 0.87)",
          p: 0,
        }}
      >
        <AccessTimeIcon
          sx={{
            color: "orange",
          }}
        />
        בטיפול
      </Button>
      {isLockEnable && (
        <Tooltip title="נעול, רק היוצר והעובד שמטפל יכולים לשנות">
          <Button
            onClick={setIsLocked}
            sx={{
              opacity: isLocked ? 1 : 0.2,
              color: "rgba(0, 0, 0, 0.87)",
              p: 0,
            }}
          >
            {isLocked ? (
              <LockIcon
                sx={{
                  color: "blue",
                }}
              />
            ) : (
              <LockOpenIcon
                sx={{
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
