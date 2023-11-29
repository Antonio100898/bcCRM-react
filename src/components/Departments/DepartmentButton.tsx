import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { api } from "../../API/Api";
import "./DepartmentButton.styles.css";
import { useUser } from "../../Context/useUser";

export interface Props {
  count: number;
  text: string;
  department: string;
}

function DepartmentButton({ count, text, department }: Props) {
  const {
    updateShowLoader,
    updateRefreshProblems,
    updateAllProblems,
    updateRefreshProblemCount,
    selectedDepartmentId,
    updateSelectedDepartmentId,
    refreshProblems,
  } = useUser();
  const history = useNavigate();

  const getProblems = () => {
    api.getProblems(department || "-1").then((data) => {
      if (data) {
        updateSelectedDepartmentId(parseInt(department, 10));
        updateAllProblems(data.d.problems);
        updateRefreshProblemCount(true);
        updateRefreshProblems(false);
        updateShowLoader(false);
      }

      if (!window.location.href.endsWith("/Problems")) {
        history("/Problems");
      }
    });
  };

  useEffect(() => {
    if (refreshProblems && selectedDepartmentId === parseInt(department, 10)) {
      getProblems();
      updateRefreshProblems(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshProblems]);

  return (
    <Box
      onClick={getProblems}
      style={{
        display: "flex",
        flex: "row",
        justifyContent: "space-between",
        maxHeight: "30px",
        borderRadius: "12px",
        paddingRight: "15px",
        paddingLeft: "15px",
        background:
          selectedDepartmentId === parseInt(department, 10)
            ? "rgba(230, 81, 0, 0.1)"
            : "white",
        color:
          selectedDepartmentId === parseInt(department, 10)
            ? "#E67C00"
            : "black",
      }}
    >
      <p
        style={{
          justifyContent: "start",
          marginRight: "4px",
          fontFamily: "Rubik",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: 20,

          textAlign: "right",
          marginBottom: 0,
        }}
      >
        {text}
      </p>
      <p
        style={{
          justifyContent: "start",
          marginLeft: "4px",
          fontFamily: "Rubik",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: 20,
          textAlign: "right",
        }}
      >
        {count}
      </p>
    </Box>
  );
}

export default DepartmentButton;
