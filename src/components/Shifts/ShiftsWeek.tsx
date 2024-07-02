import { useEffect, useState } from "react";

import { IshiftDetail, IshiftWeek } from "../../Model";
import { useUser } from "../../Context/useUser";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
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
  part: number;
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
  part,
}: Props) {
  const [week, setWeeks] = useState<IshiftWeek[]>([]);
  const { user } = useUser();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const wsData1: IshiftWeek[] | null =
      shiftsList &&
      shiftsList.filter((name: IshiftWeek) => {
        return name.jobType === jobTypeId;
      });

    if (wsData1) {
      setWeeks(wsData1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftsList]);

  function addDays(theDate: Date, days: number) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  type Shifts = {
    day: number;
    shifts: IshiftDetail[];
  }[];

  const shifts: Shifts = [
    {
      day: 0,
      shifts: week[0]?.sunday,
    },
    {
      day: 1,
      shifts: week[0]?.monday,
    },
    {
      day: 2,
      shifts: week[0]?.tuesday,
    },
    {
      day: 3,
      shifts: week[0]?.wendsday,
    },
    {
      day: 4,
      shifts: week[0]?.thursday,
    },
    {
      day: 5,
      shifts: week[0]?.friday,
    },
    {
      day: 6,
      shifts: week[0]?.saturday,
    },
  ];

  if (!week || week.length === 0 || !user) return <CircularProgress />;

  return (
    <Box mb={2}>
      <Box
        sx={{
          backgroundColor: "primary.light",
          color: "secondary.main",
          borderRadius: "5px",
        }}
      >
        <Typography fontWeight="bold" fontSize={18} textAlign="center">
          {jobTypeName}
        </Typography>
      </Box>
      <Stack direction="row" justifyContent="center" gap={1} mt={1}>
        {isTablet &&
          part === 1 &&
          shifts
            .slice(0, 3)
            .map((shift) => (
              <ShiftsStack
                key={shift.day}
                defDate={addDays(startOfWeek, shift.day)}
                shifts={shift.shifts}
                jobTypeId={jobTypeId}
                refreshList={refreshList}
                shiftGroupId={shiftGroupId}
                shiftTypeId={shiftTypeId}
                showDetails={showDetails}
                userType={user!.userType}
              />
            ))}
        {isTablet &&
          part === 2 &&
          shifts
            .slice(3, 6)
            .map((shift) => (
              <ShiftsStack
                key={shift.day}
                defDate={addDays(startOfWeek, shift.day)}
                shifts={shift.shifts}
                jobTypeId={jobTypeId}
                refreshList={refreshList}
                shiftGroupId={shiftGroupId}
                shiftTypeId={shiftTypeId}
                showDetails={showDetails}
                userType={user!.userType}
              />
            ))}
        {isTablet && part === 3 && (
          <ShiftsStack
            defDate={addDays(startOfWeek, 6)}
            shifts={week[0].saturday}
            jobTypeId={jobTypeId}
            refreshList={refreshList}
            shiftGroupId={shiftGroupId}
            shiftTypeId={shiftTypeId}
            showDetails={showDetails}
            userType={user!.userType}
          />
        )}
        {!isTablet &&
          shifts.map((shift) => (
            <ShiftsStack
              key={shift.day}
              defDate={addDays(startOfWeek, shift.day)}
              shifts={shift.shifts}
              jobTypeId={jobTypeId}
              refreshList={refreshList}
              shiftGroupId={shiftGroupId}
              shiftTypeId={shiftTypeId}
              showDetails={showDetails}
              userType={user!.userType}
            />
          ))}
      </Stack>
    </Box>
  );
}

export default ShiftsWeek;
