import { Stack } from "@mui/material";
import { IshiftDetail } from "../../Model";
import Shift from "./Shift";

type Props = {
  shifts: IshiftDetail[];
  jobTypeId: number;
  shiftTypeId: number;
  refreshList: () => void;
  showDetails: boolean;
  shiftGroupId: number;
  defDate: Date;
  userType: number;
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
}: Props) => {
  const emptyShift: Partial<IshiftDetail> = {
    id: 0,
    workerId: 199,
    jobTypeId,
    shiftTypeId,
    placeName: "",
    phone: "",
    remark: "",
    contactName: "",
    startDate: new Date().toString(),
    finishTime: new Date().toString(),
    startDateEN: new Date().toString(),
    finishTimeEN: new Date().toString(),
  };
  return (
    <Stack width="200px" textAlign="center" gap={1}>
      {shifts.map((shift) => {
        return (
          <Shift
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
      {userType === 1 && (
        <Shift
          shift={emptyShift}
          jobTypeId={jobTypeId}
          shiftTypeId={shiftTypeId}
          defDate={defDate}
          refreshList={refreshList}
          showDetails={showDetails}
          shiftGroupId={shiftGroupId}
        />
      )}
    </Stack>
  );
};

export default ShiftsStack;
