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
  showDetails: boolean;
  shiftGroupId: number;
  defDate: Date;
  userType: number;
  showEmptyShift: (jobTypeId: number, shiftTypeId: number) => void;
  setShowInstallationShiftDetailsDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowShiftDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentShift: React.Dispatch<
    React.SetStateAction<Partial<IshiftDetail> | null>
  >;
};

const ShiftsStack = ({
  shifts,
  jobTypeId,
  shiftTypeId,
  refreshList,
  shiftGroupId,
  showDetails,
  defDate,
  userType,
  showEmptyShift,
  setShowInstallationShiftDetailsDialog,
  setShowShiftDialog,
  setCurrentShift,
}: Props) => {
  const { isAdmin } = useUser();
  return (
    <Stack width="200px" maxWidth={250} flex={1} textAlign="center" gap={1}>
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
            showDetails={showDetails}
            shiftGroupId={shiftGroupId}
          />
        );
      })}
      {isAdmin && (
        <EmptyShift
          showEmptyShift={() => showEmptyShift(jobTypeId, shiftTypeId)}
        />
      )}
    </Stack>
  );
};

export default ShiftsStack;
