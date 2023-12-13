import { useEffect, useState } from "react";

import { IshiftDetail, IshiftWeek } from "../../Model";
import Shift from "./Shift";
import "./ShiftWeek.styles.css";
import { useUser } from "../../Context/useUser";

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
  color,
  shiftTypeId,
  startOfWeek,
  refreshList,
  showDetails,
  shiftGroupId,
}: Props) {
  const [week, setWeeks] = useState<IshiftWeek[]>([]);
  const { user } = useUser();

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

  return (
    <div
      style={{
        borderLeft: "0px",
        borderRadius: "49px",
        marginBottom: "15px",
        textAlign: "center",
        background: "white",
      }}
    >
      {jobTypeName && jobTypeName.length > 0 && (
        <div>
          <div style={{ display: "flex", flex: "row" }}>
            <div style={{ width: "150px" }}>
              <div
                style={{
                  width: "150px",
                  background: color,
                }}
                className="jobTypeDiv"
              >
                {jobTypeName}
              </div>
            </div>
            <div
              style={{ width: "175px", marginRight: "25px", marginTop: "20px" }}
            >
              {week &&
                week.length > 0 &&
                week[0].sunday.map((shift) => {
                  return (
                    <Shift
                      key={shift.id}
                      shift={shift}
                      jobTypeId={jobTypeId}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 0)}
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
                  defDate={addDays(startOfWeek, 0)}
                  refreshList={refreshList}
                  showDetails={showDetails}
                  shiftGroupId={shiftGroupId}
                />
              )}
            </div>
            <div
              style={{ width: "175px", marginRight: "10px", marginTop: "20px" }}
            >
              {week &&
                week.length > 0 &&
                week[0].monday.map((shift) => {
                  return (
                    <Shift
                      key={shift.id}
                      shift={shift}
                      jobTypeId={jobTypeId}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 1)}
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
                  defDate={addDays(startOfWeek, 1)}
                  refreshList={refreshList}
                  showDetails={showDetails}
                  shiftGroupId={shiftGroupId}
                />
              )}
            </div>
            <div
              style={{ width: "175px", marginRight: "25px", marginTop: "20px" }}
            >
              {week &&
                week.length > 0 &&
                week[0].tuesday.map((shift) => {
                  return (
                    <Shift
                      key={shift.id}
                      shift={shift}
                      jobTypeId={jobTypeId}
                      shiftTypeId={shiftTypeId}
                      defDate={addDays(startOfWeek, 2)}
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
                  defDate={addDays(startOfWeek, 2)}
                  refreshList={refreshList}
                  showDetails={showDetails}
                  shiftGroupId={shiftGroupId}
                />
              )}
            </div>
            <div
              style={{ width: "175px", marginRight: "25px", marginTop: "20px" }}
            >
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
            </div>
            <div
              style={{ width: "175px", marginRight: "25px", marginTop: "20px" }}
            >
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
                  key={Math.random()}
                  shift={emptyShift}
                  jobTypeId={jobTypeId}
                  shiftTypeId={shiftTypeId}
                  defDate={addDays(startOfWeek, 4)}
                  refreshList={refreshList}
                  showDetails={showDetails}
                  shiftGroupId={shiftGroupId}
                />
              )}
            </div>
            <div
              style={{ width: "175px", marginRight: "25px", marginTop: "20px" }}
            >
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
                key={Math.random()}
                shift={emptyShift}
                jobTypeId={jobTypeId}
                shiftTypeId={shiftTypeId}
                defDate={addDays(startOfWeek, 5)}
                refreshList={refreshList}
                showDetails={showDetails}
                shiftGroupId={shiftGroupId}
              />
            </div>
            <div
              style={{
                width: "175px",
                marginRight: "25px",
                marginTop: "20px",
              }}
            >
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
                  key={Math.random()}
                  shift={emptyShift as Partial<IshiftDetail>}
                  jobTypeId={jobTypeId}
                  shiftTypeId={shiftTypeId}
                  defDate={addDays(startOfWeek, 6)}
                  refreshList={refreshList}
                  showDetails={showDetails}
                  shiftGroupId={shiftGroupId}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShiftsWeek;
