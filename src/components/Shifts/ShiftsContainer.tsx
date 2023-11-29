import { useCallback, useEffect, useState } from "react";

import { IshiftDetail, IshiftWeek } from "../../Model";
import { ShiftsWeek } from "./ShiftsWeek";
import ShiftEdit from "./ShiftEdit";

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

  const handleCloseAddNewShift = useCallback(() => {
    setShowAddNew(false);
    refreshList();
  }, [refreshList]);

  return (
    <div
      style={{
        marginRight: 5,
        marginTop: "40px",
        border: "1px solid #000000",
        borderRadius: "20px",
        marginLeft: 20,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Rubik",
            fontStyle: "normal",
            fontWeight: "700",
            fontSize: "26px",
            lineHeight: "35px",
            textAlign: "center",
            width: "300px",
            background: "#f5f5f5",
          }}
        >
          {title}
        </p>
      </div>
      <div style={{ padding: 40 }}>
        <div
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
          {/* <Tooltip title="הוסף חדש">
            <IconButton onClick={AddNewShift}>
              <SaveIcon
                style={{
                  fontSize: 35,
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              />
            </IconButton>
          </Tooltip> */}
        </div>
        {shifts && shifts.length > 0 && (
          <div>
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
          </div>
        )}
      </div>

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
