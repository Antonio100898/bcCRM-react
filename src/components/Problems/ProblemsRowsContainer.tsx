import { useEffect, useState } from "react";

import { IProblem } from "../../Model";
import { ProblemRow } from "./ProblemRow";
import { NivTextField } from "../BaseCompnents/NivTextField/NivTextField";
import { useUser } from "../../Context/useUser";

export type Props = {
  someProblems: IProblem[] | null;
};

export function ProblemsRowsContainer({ someProblems }: Props) {
  const [problems, setProblems] = useState<IProblem[] | null>([]);
  const [filterWokrerCreate, setFilterWokrerCreate] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterPlace, setFilterPlace] = useState("");
  const [filterCusName, setFilterCusName] = useState("");
  const [filterDesc, setFilterDesc] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const {
    updateShowProblemDialog,
    updateCurrentProblem,
    updateRefreshProblemCount,
  } = useUser();

  useEffect(() => {
    updateRefreshProblemCount(true);
    setProblems(someProblems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [someProblems]);

  const showProblemEdit = (problem: IProblem) => {
    // problem.workerKey = localStorage.getItem(TOKEN_KEY);

    updateCurrentProblem(problem);
    updateShowProblemDialog(true);
  };

  return (
    <div className="App" style={{ marginRight: 10, borderLeft: "0px" }}>
      {problems && problems.length > 0 && (
        <div>
          <div
            className="row"
            style={{
              fontFamily: "Rubik",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "33px",
              textAlign: "center",
              color: "#000000",
              background: "#FFAD4A",
            }}
          >
            <div className="col-1">תאריך</div>
            <div className="col-1">
              <NivTextField
                style={{}}
                variant="standard"
                dir="rtl"
                label="יוצר"
                value={filterWokrerCreate}
                onChange={(e) => setFilterWokrerCreate(e.target.value)}
              />
            </div>
            <div className="col-1">
              <NivTextField
                style={{}}
                variant="standard"
                dir="rtl"
                label="טלפון"
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
              />
            </div>
            <div className="col-1">
              <NivTextField
                style={{}}
                variant="standard"
                dir="rtl"
                label="מקום"
                value={filterPlace}
                onChange={(e) => setFilterPlace(e.target.value)}
              />
            </div>
            <div className="col-1">
              {" "}
              <NivTextField
                style={{}}
                variant="standard"
                dir="rtl"
                label="לקוח"
                value={filterCusName}
                onChange={(e) => setFilterCusName(e.target.value)}
              />
            </div>
            <div className="col-4">
              {" "}
              <NivTextField
                style={{}}
                variant="standard"
                dir="rtl"
                label="תיאור"
                value={filterDesc}
                onChange={(e) => setFilterDesc(e.target.value)}
              />
            </div>
            <div className="col-1">
              {" "}
              <NivTextField
                style={{}}
                variant="standard"
                dir="rtl"
                label="מחלה"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              />
            </div>
            <div className="col-1">מעדכן</div>
            <div className="col-1" />
          </div>
          <div className="row">
            {problems &&
              problems
                .filter((a: IProblem) =>
                  a.workerCreateName.includes(filterWokrerCreate)
                )
                .filter((a: IProblem) => a.phone.includes(filterPhone))
                .filter((a: IProblem) => a.placeName.includes(filterPlace))
                .filter((a: IProblem) => a.customerName.includes(filterCusName))
                .filter((a: IProblem) => a.desc.includes(filterDesc))
                .filter((a: IProblem) =>
                  a.departmentName.includes(filterDepartment)
                )
                .map((problem: IProblem) => {
                  return (
                    <ProblemRow
                      key={problem.id}
                      problem={problem}
                      click={showProblemEdit}
                    />
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemsRowsContainer;
