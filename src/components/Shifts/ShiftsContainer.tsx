import { useEffect, useState } from "react";

import { IshiftDetail, IshiftWeek } from "../../Model";
import { ShiftsWeek } from "./ShiftsWeek";
import ShiftEdit from "./ShiftEdit";
import { Box, Typography, Stack } from "@mui/material";
import { color_dark_blue, color_main_light } from "../../Consts/Consts";

export type Props = {
  shiftsList: IshiftWeek[] | null;
  title: string;
  shiftTypeId: number;
  startOfWeek: Date;
  refreshList: () => void;
  showDetails: boolean;
  shiftGroupId: number;
};

export function ShiftsContainer({
  shiftsList,
  title,
  shiftTypeId,
  startOfWeek,
  refreshList,
  showDetails,
  shiftGroupId,
}: Props) {
  const [shifts, setShifts] = useState<IshiftWeek[]>([]);
  const [showAddNew, setShowAddNew] = useState<boolean>(false);

  const emptyShift: Partial<IshiftDetail> = {
    id: 0,
    workerId: 199,
    jobTypeId: 1,
    shiftTypeId,
    placeName: "",
    phone: "",
    remark: "",
    contactName: "",
    startDateEN: startOfWeek.toString(),
    finishTimeEN: startOfWeek.toString(),
  };

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

  const handleCloseAddNewShift = () => {
    setShowAddNew(false);
    refreshList();
  };

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
        {/* <div
          style={{
            display: "flex",
            flex: "row",
            justifyContent: "center",
            position: "relative",
            borderRadius: "8px 8px 0px 0px",
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: 800,
            fontSize: "48px",
            lineHeight: "58px",
            alignItems: "center",
            textAlign: "center",
            color: "#000000",
          }}
        >
          <Tooltip title="הוסף חדש">
            <IconButton onClick={AddNewShift}>
              <SaveIcon
                style={{
                  fontSize: 35,
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              />
            </IconButton>
          </Tooltip>
        </div> */}
        {shifts && shifts.length > 0 && (
          <Stack>
            {shifts &&
              shifts.map((jobTypes) => {
                return (
                  <ShiftsWeek
                    key={jobTypes.jobType}
                    startOfWeek={startOfWeek}
                    shiftsList={shifts}
                    jobTypeName={jobTypes.jobTypeName}
                    jobTypeId={jobTypes.jobType}
                    color={jobTypes.color}
                    shiftTypeId={shiftTypeId}
                    refreshList={refreshList}
                    showDetails={showDetails}
                    shiftGroupId={shiftGroupId}
                  />
                );
              })}
          </Stack>
        )}
      </Box>
      <ShiftEdit
        handleClose={handleCloseAddNewShift}
        shift={emptyShift}
        open={showAddNew}
        shiftGroupId={shiftGroupId}
      />
    </div>
  );
}

export default ShiftsContainer;
