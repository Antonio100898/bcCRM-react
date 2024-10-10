import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../../Context/useUser";
import { IProblem } from "../../Model";
import { TOKEN_KEY } from "../../Consts/Consts";
import ProblemsContainer from "../../components/Problems/ProblemsContainer";
import styles from "./Problems.module.css";

export type Props = {
  someProblems: IProblem[] | null;
};

export default function Problems() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showRows] = useState(false);

  const {
    updateRefreshProblemCount,
    allProblems,
    updateAllProblems,
    updateDepartment,
    updateSelectedDepartmentId,
    orderBy,
    updateShowProblemDialog,
    updateCurrentProblem,
  } = useUser();

  const handleShowProblem = (clickedProblem: IProblem) => {
    updateCurrentProblem(clickedProblem);
    updateShowProblemDialog(true);
  };

  useEffect(() => {
    updateRefreshProblemCount(true);
    const k = localStorage.getItem(TOKEN_KEY);
    if (k?.length === 0) {
      navigate("/Login");
    }

    updateAllProblems(
      allProblems?.sort((a: IProblem, b: IProblem) => {
        return (a[orderBy] || "")
          .toString()
          .localeCompare((b[orderBy] || "").toString());
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy]);

  useEffect(() => {
    const department = searchParams.get("department");
    if (department === null) {
      setSearchParams({ department: "-1" });
      return;
    }
    updateSelectedDepartmentId(Number(department) || -1);
    updateDepartment(department || "-1");
  }, [searchParams]);

  return (
    <div>
      {/* {false && (
        <>
          <Select
            label="סדר לפי"
            variant="outlined"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value as keyof IProblem)}
            style={{ width: "150px" }}
          >
            <MenuItem value="startTimeEN">תאריך</MenuItem>
            <MenuItem value="placeName">שם מקום</MenuItem>
            <MenuItem value="workerCreateName">עובד יוצר</MenuItem>
            <MenuItem value="toWorker">עובד מטפל</MenuItem>
          </Select>

          <Tooltip title="הצג שורות">
            <Switch onChange={() => setShowRows(!showRows)} />
          </Tooltip>
        </>
      )} */}
      {!showRows && (
        <div className={styles.container}>
          <ProblemsContainer
            someProblems={allProblems}
            title="היום"
            startDays={0}
            finishDays={1}
            onClick={handleShowProblem}
          />

          <ProblemsContainer
            someProblems={allProblems}
            title="השבוע"
            startDays={2}
            finishDays={7}
            onClick={handleShowProblem}
          />

          <ProblemsContainer
            someProblems={allProblems}
            title="החודש"
            startDays={8}
            finishDays={31}
            onClick={handleShowProblem}
          />

          <ProblemsContainer
            someProblems={allProblems}
            title="יותר מחודש"
            startDays={32}
            finishDays={180}
            onClick={handleShowProblem}
          />

          <ProblemsContainer
            someProblems={allProblems}
            title="יותר מחצי שנה"
            startDays={181}
            finishDays={365}
            ticketColor="#FFF4E4"
            onClick={handleShowProblem}
          />

          <ProblemsContainer
            someProblems={allProblems}
            title="יותר משנה"
            startDays={366}
            finishDays={1500}
            ticketColor="#D45A33"
            onClick={handleShowProblem}
          />
        </div>
      )}
      {/* {showRows && <ProblemsRowsContainer someProblems={allProblems} />} */}
    </div>
  );
}
