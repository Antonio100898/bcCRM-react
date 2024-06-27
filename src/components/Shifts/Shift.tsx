import { useEffect, useState } from "react";
import { IshiftDetail } from "../../Model";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Typography } from "@mui/material";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSnackbar } from "notistack";
import ShiftEdit from "./ShiftEdit";
import { shiftService } from "../../API/services";

const FONST_SIZE = 24;

export type Props = {
  shift: Partial<IshiftDetail>;
  jobTypeId: number;
  shiftTypeId: number;
  defDate: Date;
  refreshList: () => void;
  showDetails: boolean;
  shiftGroupId: number;
};

export default function Shift({
  shift,
  jobTypeId,
  shiftTypeId,
  defDate,
  refreshList,
  showDetails,
  shiftGroupId,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [currentShift, setCurrentShift] =
    useState<Partial<IshiftDetail>>(shift);
  const [showEditShift, setShowEditShift] = useState<boolean>(false);

  useEffect(() => {
    setCurrentShift(shift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift]);

  const handleCloseEdit = () => {
    setShowEditShift(false);
    refreshList();
  };

  const showEmptyShift = () => {
    const d: Partial<IshiftDetail> = {
      id: 0,
      workerId: 199,
      jobTypeId,
      shiftTypeId,
      placeName: "",
      phone: "",
      remark: "",
      contactName: "",
      startDate: defDate.toString(),
      finishTime: defDate.toString(),
      startDateEN: defDate.toString(),
      finishTimeEN: defDate.toString(),
    };

    setCurrentShift(d);
    setShowEditShift(true);
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
      {currentShift && currentShift!.id! > 0 && (
        <Box
          id={`shift${currentShift.id}`}
          draggable="true"
          onDragStart={handleDragStart}
          onClick={() => setShowEditShift(true)}
          sx={{
            overflow: "hidden",
            borderRadius: "8px",
            border: "grey thin solid",
          }}
        >
          <Box
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              color: currentShift!.workerName === "עובד כללי" ? "red" : "black",
              position: "relative",
              backgroundColor: "#E9E9E9",
              py: "2px",
            }}
          >
            <Typography component="span" fontSize={14}>
              {currentShift!.workerName}
            </Typography>
          </Box>
          {currentShift!.placeName && (
            <div>
              <Box
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: "114px",
                }}
              >
                <Typography component="span" fontSize={14}>
                  {currentShift!.placeName}
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
            </div>
          )}

          {showDetails && (
            <div>
              {currentShift!.contactName && (
                <div className="shiftDivMiddleSimple textSmall">
                  <PersonIcon />
                  {currentShift!.contactName}
                </div>
              )}
              {currentShift!.phone && (
                <div className="shiftDivMiddleSimple textSmall">
                  <PhoneEnabledIcon />
                  {currentShift!.phone}
                </div>
              )}
              {currentShift!.address && currentShift!.address.length > 2 && (
                <div className="shiftDivMiddleSimple textSmall">
                  <LocationOnIcon />
                  {currentShift!.address}
                </div>
              )}
              <div className="shiftDivMiddleSimple textSmall">
                {currentShift!.remark}
              </div>
            </div>
          )}

          <Box
            sx={{
              backgroundColor: "#F8F8F8",
              py: "2px",
            }}
          >
            <Typography component="span" fontSize={14}>
              {`${currentShift!.finishHour}  -  ${currentShift!.startHour}`}
            </Typography>
          </Box>
        </Box>
      )}

      {currentShift.id === 0 && (
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            borderRadius: "10px",
            border: "1px dotted black",
            borderStyle: "dotted",
          }}
        >
          <IconButton onClick={showEmptyShift}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </div>
      )}

      <ShiftEdit
        open={showEditShift}
        shift={currentShift}
        handleClose={handleCloseEdit}
        shiftGroupId={shiftGroupId}
      />
    </div>
  );
}
