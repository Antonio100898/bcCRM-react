import { useEffect, useState } from "react";

import { IshiftDetail, IshiftWeek } from "../../Model";
import { ShiftsWeek } from "./ShiftsWeek";
import { Box, Typography, Stack } from "@mui/material";

export type Props = {
  shiftsList: IshiftWeek[] | null;
  title: string;
  shiftTypeId: number;
  startOfWeek: Date;
  refreshList: () => void;
  shiftGroupId: number;
  part: number;
  setShowInstallationShiftDetailsDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowShiftDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showEmptyShift: (jobTypeId: number, shiftTypeId: number, date: Date) => void;
  setCurrentShift: React.Dispatch<
    React.SetStateAction<IshiftDetail | null>
  >;
};

export function ShiftsContainer({
  shiftsList,
  title,
  shiftTypeId,
  startOfWeek,
  refreshList,
  shiftGroupId,
  part,
  setShowInstallationShiftDetailsDialog,
  setShowShiftDialog,
  showEmptyShift,
  setCurrentShift,
}: Props) {
  const [shifts, setShifts] = useState<IshiftWeek[]>([]);

  useEffect(() => {
    const wsData1: IshiftWeek[] | null =
      shiftsList &&
      shiftsList.filter((name: IshiftWeek) => {
        return name.shiftType === shiftTypeId;
      });

    if (wsData1) {
      setShifts(wsData1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftsList]);

  return (
    <div>
      <Box
        sx={{
          backgroundColor: "secondary.main",
          color: "primary.light",
          borderRadius: "5px",
          py: 0.5,
          mt: 2,
        }}
      >
        <Typography fontWeight="bold" fontSize={24} textAlign="center">
          {title}
        </Typography>
      </Box>
      <Box mt={1}>
        {shifts && shifts.length > 0 && (
          <Stack>
            {shifts &&
              shifts.map((jobTypes) => {
                return (
                  <ShiftsWeek
                    setCurrentShift={setCurrentShift}
                    setShowInstallationShiftDetailsDialog={
                      setShowInstallationShiftDetailsDialog
                    }
                    setShowShiftDialog={setShowShiftDialog}
                    showEmptyShift={showEmptyShift}
                    part={part}
                    key={jobTypes.jobType}
                    startOfWeek={startOfWeek}
                    shiftsList={shifts}
                    jobTypeName={jobTypes.jobTypeName}
                    jobTypeId={jobTypes.jobType}
                    color={jobTypes.color}
                    shiftTypeId={shiftTypeId}
                    refreshList={refreshList}
                    shiftGroupId={shiftGroupId}
                  />
                );
              })}
          </Stack>
        )}
      </Box>
    </div>
  );
}

export default ShiftsContainer;
