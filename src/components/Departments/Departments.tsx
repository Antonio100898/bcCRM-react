import { useEffect, useState } from "react";
import { HeaderSummery } from "../../Model/HeaderSummery";
import DepartmentButton from "./DepartmentButton";
import { useUser } from "../../Context/useUser";
import { problemService } from "../../API/services";

function Departments() {
  const [summery, setSummery] = useState<HeaderSummery>(null!);
  const { refreshProblemCount, updateRefreshProblemCount, updateShowLoader } =
    useUser();
  useEffect(() => {
    if (refreshProblemCount) {
      updateShowLoader(true);

      problemService.getProblemSummary().then((data) => {
        if (data) setSummery(data.d.summery);

        updateRefreshProblemCount(false);
        updateShowLoader(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshProblemCount]);
  return (
    <div style={{ margin: "5px" }}>
      {summery &&
        summery?.departments &&
        (summery?.departments || []).map((pSum) => {
          return (
            <DepartmentButton
              key={pSum.departmentId}
              text={pSum.departmentName}
              count={pSum.count}
              department={pSum.departmentValue}
            />
          );
        })}
    </div>
  );
}

export default Departments;
