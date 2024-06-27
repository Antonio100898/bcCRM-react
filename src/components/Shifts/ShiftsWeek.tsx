import { useEffect, useState } from "react";

import { IshiftWeek } from "../../Model";
import Shift from "./Shift";
import { useUser } from "../../Context/useUser";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { color_blue, color_yellow_light } from "../../Consts/Consts";
import ShiftsStack from "./ShiftsStack";

export type Props = {
  shiftsList: IshiftWeek[] | null;
  jobTypeName: string;
  startOfWeek: Date;
  jobTypeId: number;
  color: string;
  shiftTypeId: number;
  refreshList: () => void;
  showDetails: boolean;
  shiftGroupId: number;
};

export function ShiftsWeek({
  shiftsList,
  jobTypeName,
  jobTypeId,
  shiftTypeId,
  startOfWeek,
  refreshList,
  showDetails,
  shiftGroupId,
}: Props) {
  const [week, setWeeks] = useState<IshiftWeek[]>([]);
  const { user } = useUser();

  useEffect(() => {
    // console.log(shiftsList);
    const wsData1: IshiftWeek[] | null =
      shiftsList &&
      shiftsList.filter((name: IshiftWeek) => {
        return name.jobType === jobTypeId;
      });

    // console.log({ wsData1, shiftsList });
    if (wsData1) {
      setWeeks(wsData1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftsList]);

  function addDays(theDate: Date, days: number) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  if (!week || week.length === 0 || !user) return <CircularProgress />;

  return (
    <Box mb={2}>
      <Box
        sx={{
          backgroundColor: color_yellow_light,
          color: color_blue,
          borderRadius: "5px",
        }}
      >
        <Typography fontWeight="bold" fontSize={18} textAlign="center">
          {jobTypeName}
        </Typography>
      </Box>
      <Stack direction="row" gap={1} mt={1}>
        <ShiftsStack
          defDate={addDays(startOfWeek, 0)}
          shifts={week[0].sunday}
          jobTypeId={jobTypeId}
          refreshList={refreshList}
          shiftGroupId={shiftGroupId}
          shiftTypeId={shiftTypeId}
          showDetails={showDetails}
          userType={user!.userType}
        />
        <ShiftsStack
          defDate={addDays(startOfWeek, 1)}
          shifts={week[0].monday}
          jobTypeId={jobTypeId}
          refreshList={refreshList}
          shiftGroupId={shiftGroupId}
          shiftTypeId={shiftTypeId}
          showDetails={showDetails}
          userType={user!.userType}
        />
        <ShiftsStack
          defDate={addDays(startOfWeek, 2)}
          shifts={week[0].tuesday}
          jobTypeId={jobTypeId}
          refreshList={refreshList}
          shiftGroupId={shiftGroupId}
          shiftTypeId={shiftTypeId}
          showDetails={showDetails}
          userType={user!.userType}
        />

        {/* <Stack width="200px">
                {week &&
                  week.length > 0 &&
                  week[0].wendsday.map((shift) => {
                    return (
                      <Shift
                        key={shift.id}
                        shift={shift}
                        jobTypeId={jobTypeId}
                        shiftTypeId={shiftTypeId}
                        defDate={addDays(startOfWeek, 3)}
                        refreshList={refreshList}
                        showDetails={showDetails}
                        shiftGroupId={shiftGroupId}
                      />
                    );
                  })}
                {user && user.userType === 1 && (
                  <Shift
                    key={Math.random()}
                    shift={emptyShift}
                    jobTypeId={jobTypeId}
                    shiftTypeId={shiftTypeId}
                    defDate={addDays(startOfWeek, 3)}
                    refreshList={refreshList}
                    showDetails={showDetails}
                    shiftGroupId={shiftGroupId}
                  />
                )}
              </Stack>
              <Stack width="200px">
                {week &&
                  week.length > 0 &&
                  week[0].thursday.map((shift) => {
                    return (
                      <Shift
                        key={shift.id}
                        shift={shift}
                        jobTypeId={jobTypeId}
                        shiftTypeId={shiftTypeId}
                        defDate={addDays(startOfWeek, 4)}
                        refreshList={refreshList}
                        showDetails={showDetails}
                        shiftGroupId={shiftGroupId}
                      />
                    );
                  })}

                {user && user.userType === 1 && (
                  <Shift
                    shift={emptyShift}
                    jobTypeId={jobTypeId}
                    shiftTypeId={shiftTypeId}
                    defDate={addDays(startOfWeek, 4)}
                    refreshList={refreshList}
                    showDetails={showDetails}
                    shiftGroupId={shiftGroupId}
                  />
                )}
              </Stack>
              <Stack width="200px">
                {week &&
                  week.length > 0 &&
                  week[0].friday.map((shift) => {
                    return (
                      <Shift
                        key={shift.id}
                        shift={shift}
                        jobTypeId={jobTypeId}
                        shiftTypeId={shiftTypeId}
                        defDate={addDays(startOfWeek, 5)}
                        refreshList={refreshList}
                        showDetails={showDetails}
                        shiftGroupId={shiftGroupId}
                      />
                    );
                  })}

                <Shift
                  shift={emptyShift}
                  jobTypeId={jobTypeId}
                  shiftTypeId={shiftTypeId}
                  defDate={addDays(startOfWeek, 5)}
                  refreshList={refreshList}
                  showDetails={showDetails}
                  shiftGroupId={shiftGroupId}
                />
              </Stack>
              <Stack width="200px">
                {week &&
                  week.length > 0 &&
                  week[0].saturday.map((shift) => {
                    return (
                      <Shift
                        key={shift.id}
                        shift={shift}
                        jobTypeId={jobTypeId}
                        shiftTypeId={shiftTypeId}
                        defDate={addDays(startOfWeek, 6)}
                        refreshList={refreshList}
                        showDetails={showDetails}
                        shiftGroupId={shiftGroupId}
                      />
                    );
                  })}
                {user && user.userType === 1 && (
                  <Shift
                    shift={emptyShift as Partial<IshiftDetail>}
                    jobTypeId={jobTypeId}
                    shiftTypeId={shiftTypeId}
                    defDate={addDays(startOfWeek, 6)}
                    refreshList={refreshList}
                    showDetails={showDetails}
                    shiftGroupId={shiftGroupId}
                  />
                )}
              </Stack> */}
      </Stack>
    </Box>
  );
}

export default ShiftsWeek;
