import { IshiftDetail } from "../../Model";
import { Box, Typography } from "@mui/material";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSnackbar } from "notistack";
import { shiftService } from "../../API/services";
import { useUser } from "../../Context/useUser";
import { useEffect } from "react";

export type Props = {
  shift: Partial<IshiftDetail>;
  jobTypeId: number;
  shiftTypeId: number;
  defDate: Date;
  refreshList: () => void;
  showDetails: boolean;
  shiftGroupId: number;
  setShowShiftDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInstallationShiftDetailsDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setCurrentShift: React.Dispatch<
    React.SetStateAction<Partial<IshiftDetail> | null>
  >;
};

export default function Shift({
  shift,
  defDate,
  refreshList,
  showDetails,
  shiftGroupId,
  setShowInstallationShiftDetailsDialog,
  setShowShiftDialog,
  setCurrentShift,
  jobTypeId,
  shiftTypeId,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { isAdmin } = useUser();
  useEffect(() => {
    console.log(isAdmin);
  }, [isAdmin]);
  const handleShiftClicked = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setCurrentShift(shift);
    setShowShiftDialog(true);
  };

  const setShowInstallationShiftDetailsDialogClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (shift.jobTypeId !== 1) return;
    setCurrentShift(shift);
    setShowInstallationShiftDetailsDialog(true);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text", event.currentTarget.id);
  };
  const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const UpdateShiftStartDate = async (id: number) => {
    try {
      const data = await shiftService.updateShiftStartDate(id, defDate);
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

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const idName = event.dataTransfer.getData("text");

    const id = parseInt(idName.replace("shift", ""), 10);
    UpdateShiftStartDate(id);
  };

  return (
    <div onDragOver={enableDropping} onDrop={handleDrop}>
      <Box
        id={`shift${shift.id}`}
        draggable="true"
        onDragStart={handleDragStart}
        onClick={isAdmin ? handleShiftClicked : undefined}
        sx={{
          overflow: "hidden",
          borderRadius: "8px",
          border: "grey thin solid",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: shift.workerName === "עובד כללי" ? "red" : "black",
            position: "relative",
            backgroundColor: "#E9E9E9",
            py: "2px",
          }}
        >
          <Typography component="span" fontWeight={500} fontSize={14}>
            {shift.workerName}
          </Typography>
        </Box>
        {shift.placeName && (
          <Box
            onClick={
              shift.jobTypeId === 1
                ? setShowInstallationShiftDetailsDialogClick
                : undefined
            }
            sx={{ backgroundColor: "secondary.light" }}
          >
            <Box
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                maxWidth: "114px",
                py: "2px",
                m: "auto",
                cursor: "pointer",
              }}
            >
              <Typography
                fontWeight={500}
                component="span"
                color="text.secondary"
                fontSize={14}
              >
                {shift.placeName}
              </Typography>
            </Box>
            {/* {currentShift!.remark && currentShift!.remark?.length > 1 && (
                <Tooltip
                  title={
                    <h3
                      style={{
                        color: "lightblue",
                        textAlign: "right",
                      }}
                    >
                      {currentShift!.remark}
                    </h3>
                  }
                >
                  <InfoIcon
                    style={{
                      color: "blue",
                      fontSize: `${FONST_SIZE}px`,
                      position: "absolute",
                      top: 7,
                      left: 3,
                    }}
                  />
                </Tooltip>
              )} */}
          </Box>
        )}

        {showDetails && (
          <div>
            {shift.contactName && (
              <div className="shiftDivMiddleSimple textSmall">
                <PersonIcon />
                {shift.contactName}
              </div>
            )}
            {shift.phone && (
              <div className="shiftDivMiddleSimple textSmall">
                <PhoneEnabledIcon />
                {shift.phone}
              </div>
            )}
            {shift.address && shift.address.length > 2 && (
              <div className="shiftDivMiddleSimple textSmall">
                <LocationOnIcon />
                {shift.address}
              </div>
            )}
            <div className="shiftDivMiddleSimple textSmall">{shift.remark}</div>
          </div>
        )}

        <Box
          sx={{
            backgroundColor: "#F8F8F8",
            py: "2px",
          }}
        >
          <Typography fontWeight={500} component="span" fontSize={14}>
            {`${shift.finishHour}  -  ${shift.startHour}`}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
