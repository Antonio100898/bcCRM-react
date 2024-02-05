import {
  IconButton,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  ListItemIcon,
  alpha,
  useTheme,
  styled,
  Box,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";
import { Link } from "react-router-dom";
import { NestedMenuItem } from "mui-nested-menu";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssessmentIcon from "@mui/icons-material/Assessment";
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
import { MenuCategory } from "../../AppLayout";
import { IMAGES_PATH_WORKERS } from "../../Consts/Consts";
import { IUser, ProblemSummery } from "../../Model";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const menuEntities: MenuCategory[] = [
  {
    label: "האזור האישי",
    entities: [
      {
        label: "פרופיל",
        icon: <PersonIcon />,
        to: "/WorkerInfo",
      },
      {
        label: "חופש",
        icon: <FreeBreakfastIcon />,
        to: "/WorkersFreeday",
      },
      {
        label: "מחלה",
        icon: <SickIcon />,
        to: "/WorkersSickday",
      },
    ],
  },
  {
    label: "הוצאות",
    entities: [
      {
        label: "הגשת הוצאות",
        icon: <AttachMoneyIcon />,
        to: "/WorkerExpenses",
      },
      {
        label: "דוחות",
        icon: <AssessmentIcon />,
        to: "/WorkerExpensesShortReports",
        onlyDepartments: [1],
      },
      {
        label: "דוחות מקוצרים",
        icon: <AssessmentIcon />,
        to: "/WorkerExpensesShortReports",
        onlyDepartments: [1],
      },
      {
        label: "לוח שנה",
        icon: <CalendarMonthIcon />,
        to: "/WorkerExpenseAndShiftCalendar",
      },
    ],
  },
  {
    label: "סידור עבודה",
    entities: [
      {
        label: "סידור עבודה",
        icon: <WbCloudyIcon />,
        to: "/Shifts",
      },
      {
        label: "זמינות",
        icon: <VolunteerActivismIcon />,
        to: "/ShiftPlans",
        onlyDepartments: [1, 16],
      },
      {
        label: "המשמרות שלי",
        icon: <PunchClockIcon />,
        to: "/ShiftsPersonal",
      },
    ],
  },
  {
    label: "ההגדרות",
    entities: [
      {
        label: "עובדים",
        icon: <SettingsApplicationsIcon />,
        to: "/Workers",
        onlyDepartments: [1],
      },
      {
        label: "הוצאות",
        icon: <MonetizationOnIcon />,
        to: "/WorkExpenseTypeSettings",
        onlyDepartments: [1],
      },
    ],
  },
  {
    label: "אחר",
    entities: [
      {
        label: "סטטיסטיקה",
        icon: <InsightsIcon />,
        to: "/Stats",
        onlyDepartments: [1],
      },
      {
        label: "רשימת קונקטורים",
        icon: <InventoryIcon />,
        to: "/V3Settings",
        onlyDepartments: [1],
      },
      {
        label: "מסופונים",
        icon: <TwoWheelerIcon />,
        to: "/PlacesBizNumber",
      },
    ],
  },
];

type Props = {
  isMobile: boolean;
  handleDrawerClose: () => void;
  drawerOpen: boolean;
  user: IUser | null;
  anchorEl: null | HTMLElement;
  handleMenuClose: () => void;
  searchParams: URLSearchParams;
  departments: ProblemSummery[];
  handleAnchor: (event: React.MouseEvent<HTMLElement>) => void;
};

export default function AppDrawer({
  anchorEl,
  departments,
  drawerOpen,
  handleDrawerClose,
  handleMenuClose,
  isMobile,
  searchParams,
  user,
  handleAnchor,
}: Props) {
  const theme = useTheme();

  return (
    <Drawer
      sx={{
        width: 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      onClose={isMobile ? handleDrawerClose : undefined}
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={drawerOpen}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronRightIcon />
        </IconButton>
        <Tooltip title={user?.workerName}>
          <IconButton onClick={handleAnchor}>
            <Avatar
              sx={{ width: 48, height: 48 }}
              alt="profile picture"
              src={`${IMAGES_PATH_WORKERS}${user?.imgPath}`}
            >
              {(user?.workerName || "N").substring(0, 1).toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {menuEntities.map((e) => (
            <NestedMenuItem
              key={`${e.label}`}
              label={e.label}
              parentMenuOpen={Boolean(anchorEl)}
            >
              <Box>
                {e.entities.map((en) => (
                  <MenuItem key={en.label} component={Link} to={en.to}>
                    <ListItemIcon sx={{ pr: 1.5 }}>{en.icon}</ListItemIcon>
                    <ListItemText>{en.label}</ListItemText>
                  </MenuItem>
                ))}
              </Box>
            </NestedMenuItem>
          ))}
        </Menu>
      </DrawerHeader>
      <Divider />
      <List>
        {(departments || []).map((department) => (
          <ListItem key={department.departmentId} disablePadding>
            <ListItemButton
              onClick={isMobile ? () => handleDrawerClose() : undefined}
              selected={
                searchParams.get("department") === `${department.departmentId}`
              }
              component={Link}
              to={{
                pathname: "/",
                search: `?department=${department.departmentId}`,
              }}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.light, 0.3),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.light, 0.5),
                  },
                },
              }}
            >
              <ListItemText primary={department.departmentName} />
              <ListItemIcon sx={{ display: "flex", justifyContent: "end" }}>
                <Chip
                  color="success"
                  size="small"
                  label={department.count}
                  sx={{ fontWeight: "bold" }}
                />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
}
