import { useEffect, useState } from "react";

import { IconButton, Tooltip } from "@mui/material";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import HailIcon from "@mui/icons-material/Hail";
import { useSnackbar } from "notistack";
import ShiftPlanEdit from "./ShiftPlanEdit";
import { IshiftDetail } from "../../Model";
import { useUser } from "../../Context/useUser";
import { shiftService } from "../../API/services";

export type Props = {
  shift: Partial<IshiftDetail>;
  shiftTypeId: number;
  defDate: Date;
  refreshList: () => void;
};

export default function ShiftPlan({
  shift,
  shiftTypeId,
  defDate,
  refreshList,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [currentShift, setCurrentShift] =
    useState<Partial<IshiftDetail>>(shift);
  const [showEditShift, setShowEditShift] = useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    // console.log(shift);
    setCurrentShift(shift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift]);

  const handleCloseEdit = () => {
    setShowEditShift(false);
    refreshList();
  };

  const showEmptyShift = async () => {
    if (currentShift === null || currentShift.id === 0) {
      const d: Partial<IshiftDetail> = {
        id: 0,
        workerId: 199,
        shiftTypeId,
        remark: "",
        startDate: defDate.toString(),
        startDateEN: defDate.toString(),
      };
      try {
        const data = await shiftService.updateShiftPlan(d);
        if (!data?.d.success) {
          enqueueSnackbar({
            message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
            variant: "error",
          });
          return;
        }
        setCurrentShift(d);
      } catch (error) {
        console.error(error);
      }
    } else {
      currentShift.shiftTypeId = shiftTypeId;
      currentShift.startDate = defDate.toString();
      currentShift.finishTime = defDate.toString();
      currentShift.startDateEN = defDate.toString();
      currentShift.finishTimeEN = defDate.toString();

      setShowEditShift(true);
    }
  };

  const addNewShiftPlan = async () => {
    const d: Partial<IshiftDetail> = {
      id: 0,
      workerId: user!.workerId,
      shiftTypeId,
      remark: "",
      startDate: defDate.toDateString(),
      finishTime: defDate.toDateString(),
      startDateEN: defDate.toDateString(),
      finishTimeEN: defDate.toDateString(),
    };
    try {
      const data = await shiftService.updateShiftPlan(d);
      if (!data?.d.success) {
        enqueueSnackbar({
          message: `נכשל לעדכן תקלה. ${data?.d.msg}`,
          variant: "error",
        });
        return;
      }
      refreshList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #A6A6A6",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
        margin: "2px",
        minWidth: "120px",
      }}
    >
      {currentShift && currentShift.id! > 0 && (
        <IconButton onClick={showEmptyShift}>
          <div style={{ fontSize: "1.3rem" }}>
            {currentShift.remark && currentShift.remark.length > 1 && (
              <Tooltip title={currentShift.remark}>
                <HailIcon />
              </Tooltip>
            )}
            {/* <TaskAltIcon fontSize="large" style={{ color: "green" }} /> */}
            {currentShift.workerName}
          </div>
        </IconButton>
      )}

      {currentShift && currentShift.id === 0 && (
        <IconButton onClick={addNewShiftPlan}>
          <DoNotDisturbIcon fontSize="large" style={{ color: "red" }} />
        </IconButton>
      )}

      <ShiftPlanEdit
        open={showEditShift}
        shift={currentShift}
        handleClose={handleCloseEdit}
      />
    </div>
  );
}
