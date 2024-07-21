import { useUser } from "../../Context/useUser";
import ShiftPlans from "../../components/ShiftPlans/ShiftPlans";
import ShiftPlansAdmin from "../../components/ShiftPlans/ShiftPlansAdmin";

const ShiftPlansScreen = () => {
  const { isAdmin } = useUser();
  return isAdmin ? <ShiftPlansAdmin /> : <ShiftPlans />;
};

export default ShiftPlansScreen;
