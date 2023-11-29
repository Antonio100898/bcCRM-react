import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";

import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import InsightsIcon from "@mui/icons-material/Insights";
import InventoryIcon from "@mui/icons-material/Inventory";
import WbCloudyIcon from "@mui/icons-material/WbCloudy";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import PersonIcon from "@mui/icons-material/Person";
import SickIcon from "@mui/icons-material/Sick";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import { TOKEN_KEY } from "../../Consts/Consts";
import { useUser } from "../../Context/useUser";

function ScreenMenu() {
  const { user, updateShowLoader, updateUser, updateShowScreensMenu } =
    useUser();
  const history = useNavigate();

  // console.log("user.department: " + user!.department);

  const exit = () => {
    updateShowLoader(false);
    localStorage.removeItem(TOKEN_KEY);
    updateUser(null);
    history("/login");
  };

  function GoToPage(pageName: string) {
    updateShowScreensMenu(false);
    history(pageName);
  }

  return (
    <Paper style={{ marginBottom: "10px" }}>
      <MenuItem
        style={{
          textAlign: "right",
          display: "flex !important",
          background: "rgb(255, 229, 198)",
        }}
      >
        <ListItemText>האזור האישי</ListItemText>
      </MenuItem>
      <MenuItem
        style={{ textAlign: "right", display: "flex !important" }}
        onClick={() => {
          GoToPage("/WorkerInfo/");
        }}
      >
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>פרטים כללים</ListItemText>
      </MenuItem>

      <div>
        <MenuItem
          style={{ textAlign: "right", display: "flex !important" }}
          onClick={() => {
            GoToPage("/WorkersSickday/");
          }}
        >
          <ListItemIcon>
            <SickIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>ימי מחלה</ListItemText>
        </MenuItem>
      </div>

      <MenuItem
        style={{ textAlign: "right", display: "flex !important" }}
        onClick={() => {
          GoToPage("/WorkersFreeday/");
        }}
      >
        <ListItemIcon>
          <FreeBreakfastIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>ימי חופש</ListItemText>
      </MenuItem>
      <MenuItem
        style={{ textAlign: "right", display: "flex !important" }}
        onClick={() => {
          GoToPage("/workerscars/");
        }}
      >
        <ListItemIcon>
          <TimeToLeaveIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>מכוניות לעובדים</ListItemText>
      </MenuItem>

      <MenuItem
        style={{
          textAlign: "right",
          display: "flex !important",
          background: "rgb(255, 229, 198)",
        }}
      >
        <ListItemText>הוצאות עבודה</ListItemText>
      </MenuItem>
      <MenuItem
        style={{ textAlign: "right", display: "flex !important" }}
        onClick={() => {
          GoToPage("/WorkerExpenses/");
        }}
      >
        <ListItemIcon>
          <AttachMoneyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>הגשת הוצאות</ListItemText>
      </MenuItem>
      {user && user.userType === 1 && (
        <div>
          <MenuItem
            style={{ textAlign: "right", display: "flex !important" }}
            onClick={() => {
              GoToPage("/WorkerExpensesReports/");
            }}
          >
            <ListItemIcon>
              <AssessmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>דוחות</ListItemText>
          </MenuItem>
          <MenuItem
            style={{ textAlign: "right", display: "flex !important" }}
            onClick={() => {
              GoToPage("/WorkerExpensesShortReports/");
            }}
          >
            <ListItemIcon>
              <AssessmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>דוחות מקוצר</ListItemText>
          </MenuItem>
          <MenuItem
            style={{ textAlign: "right", display: "flex !important" }}
            onClick={() => {
              GoToPage("/WorkerExpenseAndShiftCalendar/");
            }}
          >
            <ListItemIcon>
              <CalendarMonthIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>לוח שנה</ListItemText>
          </MenuItem>
        </div>
      )}

      <MenuItem
        style={{
          textAlign: "right",
          display: "flex !important",
          background: "rgb(255, 229, 198)",
        }}
      >
        <ListItemText>סידור עבודה</ListItemText>
      </MenuItem>

      <MenuItem
        style={{ textAlign: "right", display: "flex !important" }}
        onClick={() => {
          GoToPage("/Shifts/");
        }}
      >
        <ListItemIcon>
          <WbCloudyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>סידור עבודה </ListItemText>
      </MenuItem>

      {user && (user.userType === 1 || user.department === 16) && (
        <MenuItem
          style={{ textAlign: "right", display: "flex !important" }}
          onClick={() => {
            GoToPage("/ShiftPlans/");
          }}
        >
          <ListItemIcon>
            <VolunteerActivismIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>זמינות </ListItemText>
        </MenuItem>
      )}

      <MenuItem
        style={{ textAlign: "right", display: "flex !important" }}
        onClick={() => {
          GoToPage("/ShiftsPersonal/");
        }}
      >
        <ListItemIcon>
          <PunchClockIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>המשמרות שלי</ListItemText>
      </MenuItem>

      <MenuItem
        style={{
          textAlign: "right",
          display: "flex !important",
          background: "rgb(255, 229, 198)",
        }}
      >
        <ListItemText>הגדרות</ListItemText>
      </MenuItem>
      {user && user.userType === 1 && (
        <MenuItem
          style={{ textAlign: "right", display: "flex !important" }}
          onClick={() => {
            GoToPage("/Workers/");
          }}
        >
          <ListItemIcon>
            <SettingsApplicationsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>עובדים</ListItemText>
        </MenuItem>
      )}
      {user && user.userType === 1 && (
        <MenuItem
          style={{ textAlign: "right", display: "flex !important" }}
          onClick={() => {
            GoToPage("/WorkExpenseTypeSettings/");
          }}
        >
          <ListItemIcon>
            <MonetizationOnIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>הוצאות</ListItemText>
        </MenuItem>
      )}

      <MenuItem
        style={{
          textAlign: "right",
          display: "flex !important",
          background: "rgb(255, 229, 198)",
        }}
      >
        <ListItemText>אחר</ListItemText>
      </MenuItem>
      {user && user.userType === 1 && (
        <MenuItem
          style={{ textAlign: "right", display: "flex !important" }}
          onClick={() => {
            GoToPage("/Stats/");
          }}
        >
          <ListItemIcon>
            <InsightsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>סטטיסטיקה </ListItemText>
        </MenuItem>
      )}
      {user && user.userType === 1 && (
        <MenuItem
          style={{ textAlign: "right", display: "flex !important" }}
          onClick={() => {
            GoToPage("/V3Settings/");
          }}
        >
          <ListItemIcon>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>V3 </ListItemText>
        </MenuItem>
      )}

      <MenuItem
        style={{ textAlign: "right", display: "flex !important" }}
        onClick={() => {
          GoToPage("/PlacesBizNumber/");
        }}
      >
        <ListItemIcon>
          <TwoWheelerIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>מסופונים דג&#39;וו </ListItemText>
      </MenuItem>

      {/* {user && user.userType === 1 && (
        <MenuItem
          style={{ textAlign: "right", display: "flex !important" }}
          onClick={(e) => {
            history("/HardwareCenter/");
          }}
        >
          <ListItemIcon>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>מחסן </ListItemText>
        </MenuItem>
      )} */}
      <MenuItem
        style={{
          textAlign: "right",
          display: "flex !important",
          background: "rgb(255, 219, 168)",
        }}
        onClick={exit}
      >
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>יציאה מהמערכת</ListItemText>
      </MenuItem>
    </Paper>
  );
}

export default ScreenMenu;
