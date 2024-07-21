import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./Screens/Login/Login";
import Workers from "./Screens/WorkersSettings/Workers";
import Search from "./components/Search/Search";
import WorkerPeronalSpace from "./components/Workers/WorkerPeronalSpace";
import Problems from "./Screens/Problems/Problems";
import WorkersCars from "./Screens/WorkersCars/WorkersCars";
import WorkerExpenses from "./Screens/WorkerExpenses/WorkerExpenses";
import WorkerInfo from "./Screens/WorkerInfo/WorkerInfo";
import WorkExpenseTypeSettings from "./Screens/WorkExpenseTypeSettings/WorkExpenseTypeSettings";
import WorkerExpensesReports from "./Screens/WorkerExpensesReports/WorkerExpensesReports";
import Stats from "./Screens/V3Settings/Stats/Stats";
import HardwareCenter from "./components/Hardware/HardwareCenter";
import V3Settings from "./Screens/V3Settings/V3Settings";
import ShiftPlans from "./Screens/ShiftPlans/ShiftPlansScreen";
import PlacesBizNumber from "./Screens/PlacesBizNumber/PlacesBizNumber";
import WorkersFreeday from "./Screens/WorkersFreeday/workersFreeday";
import WorkersSickday from "./Screens/WorkersSickday/workersSickday";
import WorkerExpenseAndShiftCalendar from "./Screens/WorkerExpenseAndShiftCalendar/WorkerExpenseAndShiftCalendar";
import WorkerExpensesShortReports from "./Screens/WorkerExpensesShortReports/WorkerExpensesShortReports";
import ShiftsPersonal from "./Screens/MyShifts/ShiftsPersonal";
import { ProtectedRoute } from "./utils/protectedRoute";
import ConfirmProvider from "./Context/ConfirmContext";
import AppLayout from "./AppLayout";
import { useUser } from "./Context/useUser";
import { useLayoutEffect } from "react";
import Shifts from "./components/Shifts/Shifts";
import InfoScreen from "./Screens/Info/InfoScreen";

function App() {
  const { showLoader } = useUser();

  useLayoutEffect(() => {
    document.dir = "rtl";
  }, []);

  return (
    <ConfirmProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/Problems"
            element={
              <AppLayout loading={showLoader}>
                <Problems />
              </AppLayout>
            }
          />
          <Route path="/Search" element={<Search />} />
          <Route
            path="/Workers"
            element={
              <AppLayout loading={showLoader}>
                <Workers />
              </AppLayout>
            }
          />
          <Route
            path="/WorkerPeronalSpace"
            element={
              <AppLayout loading={showLoader}>
                <WorkerPeronalSpace />
              </AppLayout>
            }
          />
          <Route
            path="/WorkerInfo"
            element={
              <AppLayout loading={showLoader}>
                <WorkerInfo />{" "}
              </AppLayout>
            }
          />
          <Route
            path="/workersSickday"
            element={
              <AppLayout loading={showLoader}>
                <WorkersSickday />{" "}
              </AppLayout>
            }
          />
          <Route
            path="/WorkersFreeday"
            element={
              <AppLayout loading={showLoader}>
                <WorkersFreeday />{" "}
              </AppLayout>
            }
          />

          <Route
            path="/PlacesBizNumber"
            element={
              <AppLayout loading={showLoader}>
                <PlacesBizNumber />{" "}
              </AppLayout>
            }
          />

          <Route
            path="/WorkersCars"
            element={
              <AppLayout loading={showLoader}>
                <WorkersCars />{" "}
              </AppLayout>
            }
          />
          <Route
            path="/WorkerExpenses"
            element={
              <AppLayout loading={showLoader}>
                <WorkerExpenses />{" "}
              </AppLayout>
            }
          />
          <Route
            path="/WorkerExpensesReports"
            element={
              <AppLayout loading={showLoader}>
                <WorkerExpensesReports />{" "}
              </AppLayout>
            }
          />
          <Route
            path="/WorkerExpensesShortReports"
            element={
              <AppLayout loading={showLoader}>
                <WorkerExpensesShortReports />{" "}
              </AppLayout>
            }
          />

          <Route
            path="/WorkerExpenseAndShiftCalendar"
            element={
              <AppLayout loading={showLoader}>
                <WorkerExpenseAndShiftCalendar />{" "}
              </AppLayout>
            }
          />

          <Route
            path="/WorkExpenseTypeSettings"
            element={
              <AppLayout loading={showLoader}>
                <WorkExpenseTypeSettings />{" "}
              </AppLayout>
            }
          />

          <Route
            path="/Stats"
            element={
              <AppLayout loading={showLoader}>
                <Stats />{" "}
              </AppLayout>
            }
          />
          <Route
            path="/Shifts"
            element={
              <AppLayout loading={showLoader}>
                <Shifts />{" "}
              </AppLayout>
            }
          />
          <Route
            path="/ShiftPlans"
            element={
              <AppLayout loading={showLoader}>
                <ShiftPlans />{" "}
              </AppLayout>
            }
          />
          <Route
            path="/ShiftsPersonal"
            element={
              <AppLayout loading={showLoader}>
                <ShiftsPersonal />{" "}
              </AppLayout>
            }
          />

          <Route
            path="/V3Settings"
            element={
              <AppLayout loading={showLoader}>
                <V3Settings />{" "}
              </AppLayout>
            }
          />

          <Route
            path="/HardwareCenter"
            element={
              <AppLayout loading={showLoader}>
                <HardwareCenter />{" "}
              </AppLayout>
            }
          />
          <Route
            path="/Info"
            element={
              <AppLayout loading={showLoader}>
                <InfoScreen />
              </AppLayout>
            }
          />
          <Route
            path="/"
            element={
              <AppLayout loading={showLoader}>
                <Problems />
              </AppLayout>
            }
          />
        </Route>
        <Route path="/Login" element={<Login />} />
      </Routes>
    </ConfirmProvider>
  );
}

export default App;
