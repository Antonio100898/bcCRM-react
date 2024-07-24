import { Stack } from "@mui/material";
import { IshiftDetail } from "../../Model";
import Shift from "./Shift";
import EmptyShift from "./EmptyShift";
import { useUser } from "../../Context/useUser";

type Props = {
  shifts: IshiftDetail[];
  jobTypeId: number;
  shiftTypeId: number;
  refreshList: () => void;
  shiftGroupId: number;
  defDate: Date;
  userType: number;
  showEmptyShift: (jobTypeId: number, shiftTypeId: number, date: Date) => void;
  setShowInstallationShiftDetailsDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowShiftDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentShift: React.Dispatch<React.SetStateAction<IshiftDetail | null>>;
};

const ShiftsStack = ({
  shifts,
  jobTypeId,
  shiftTypeId,
  refreshList,
  shiftGroupId,
  defDate,
  showEmptyShift,
  setShowInstallationShiftDetailsDialog,
  setShowShiftDialog,
  setCurrentShift,
}: Props) => {
  const { isAdmin } = useUser();
  return (
    <Stack sx={{ maxWidth: "250px" }} flex={1} textAlign="center" gap={1}>
      {shifts.map((shift) => {
        return (
          <Shift
            setCurrentShift={setCurrentShift}
            setShowInstallationShiftDetailsDialog={
              setShowInstallationShiftDetailsDialog
            }
            setShowShiftDialog={setShowShiftDialog}
            key={shift.id}
            shift={shift}
            jobTypeId={jobTypeId}
            shiftTypeId={shiftTypeId}
            defDate={defDate}
            refreshList={refreshList}
            shiftGroupId={shiftGroupId}
          />
        );
      })}
      {isAdmin && (
        <EmptyShift
          showEmptyShift={() => showEmptyShift(jobTypeId, shiftTypeId, defDate)}
        />
      )}
    </Stack>
  );
};

export default ShiftsStack;
