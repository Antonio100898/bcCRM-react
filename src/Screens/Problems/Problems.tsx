import { useEffect, useRef, useState } from "react";
import { MenuItem, Select, Switch, Tooltip } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfirm } from "../../Context/useConfirm";
import { useUser } from "../../Context/useUser";
import { IProblem } from "../../Model";
import { TOKEN_KEY } from "../../Consts/Consts";
import ProblemsContainer from "../../components/Problems/ProblemsContainer";
import ProblemsRowsContainer from "../../components/Problems/ProblemsRowsContainer";
import { ProblemDialog } from "../../Dialogs/ProblemDialog";
import { problemService } from "../../API/services";

export type Props = {
  someProblems: IProblem[] | null;
};

export default function Problems() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { confirm } = useConfirm();
  const abortController = useRef(new AbortController());
  const [showRows, setShowRows] = useState(false);
  const [fileLoading] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof IProblem>("startTimeEN");

  const [problemOpen, setProblemOpen] = useState(false);
  const [problem, setProblem] = useState<IProblem | null>(null);

  const {
    updateRefreshProblemCount,
    updateRefreshProblems,
    allProblems,
    updateAllProblems,
    updateShowLoader,
    selectedDepartmentId,
  } = useUser();

  const handleShowProblem = (clickedProblem: IProblem) => {
    setProblem(clickedProblem);
    setProblemOpen(true);
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

  const updateDepartment = async (department: string) => {
    updateShowLoader(true);
    try {
      const data = await problemService.getProblems(department);
      if (data?.d.success) {
        updateRefreshProblemCount(true);
        updateAllProblems(data.d.problems);
      }
    } catch (error) {
      console.error(error);
    }
    updateShowLoader(false);
  };

  useEffect(() => {
    const department = searchParams.get("department");
    if (department === null) {
      setSearchParams({ department: "-1" });
      return;
    }
    updateDepartment(department || "-1");
  }, [searchParams]);

  const updateProblem = async (value: IProblem) => {
    updateAllProblems(
      allProblems
        ?.sort((a: IProblem, b: IProblem) => {
          return (a[orderBy] || "")
            .toString()
            .localeCompare((b[orderBy] || "").toString());
        })
        .map((p) => (p.id === value.id ? value : p)) || []
    );
    updateRefreshProblemCount(true);
    updateRefreshProblems(true);
    updateDepartment(selectedDepartmentId.toString());
  };

  const handleClose = async () => {
    if (fileLoading) {
      if (await confirm("הקבצים שהעלת עדיין לא נשמרו, שנבטל?")) {
        abortController.current.abort();
        setProblemOpen(false);
      }
    } else {
      setProblemOpen(false);
    }
  };

  return (
    <div>
      {false && (
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
      )}
      {!showRows && (
        <div>
          <ProblemsContainer
            someProblems={allProblems}
            title="היום"
            startDays={0}
            finishDays={1}
            ticketColor="#FFF4E4"
            onClick={handleShowProblem}
          />

          <ProblemsContainer
            someProblems={allProblems}
            title="השבוע"
            startDays={2}
            finishDays={7}
            ticketColor="#FFF4E4"
            onClick={handleShowProblem}
            // ticketColor="#FFC092"
          />

          <ProblemsContainer
            someProblems={allProblems}
            title="החודש"
            startDays={8}
            finishDays={31}
            ticketColor="#FFF4E4"
            onClick={handleShowProblem}
          />

          <ProblemsContainer
            someProblems={allProblems}
            title="יותר מחודש"
            startDays={32}
            finishDays={180}
            ticketColor="#FFF4E4"
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
      {showRows && <ProblemsRowsContainer someProblems={allProblems} />}

      <ProblemDialog
        key={problem?.id}
        open={problemOpen}
        onClose={handleClose}
        problem={problem}
        updateProblem={updateProblem}
      />
    </div>
  );
}
