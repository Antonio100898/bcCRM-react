import "./ProblemNote.styles.css";
import { IconButton } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { IProblem } from "../../Model";

export interface IProp {
  click: (pro: IProblem) => void;
  problem?: IProblem;
}

export function ProblemRow({ problem, click }: IProp) {
  return (
    <div>
      <div
        className="row"
        style={{
          textAlign: "center",
          fontFamily: "Rubik",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "20px",
          lineHeight: "27px",
          color: "#000000",
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FFF4E4 89.58%, #FBD6A9 100%)",
          whiteSpace: "pre-wrap",
          padding: "3px",
        }}
      >
        <div
          className="col-1"
          style={{
            borderLeft: "1px dashed rgba(0, 0, 0, 0.5)",
          }}
        >
          {`${new Date(problem!.startTimeEN)
            .getDate()
            .toString()
            .padStart(2, "0")}/${(new Date(problem!.startTimeEN).getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${new Date(
            problem!.startTimeEN
          ).getFullYear()} ${new Date(problem!.startTimeEN)
            .getHours()
            .toString()
            .padStart(2, "0")}:${new Date(problem!.startTimeEN)
            .getMinutes()
            .toString()
            .padStart(2, "0")}`}
        </div>
        <div
          className="col-1"
          style={{
            borderLeft: "1px dashed rgba(0, 0, 0, 0.5)",
          }}
        >
          {problem && problem.workerCreateName}
        </div>
        <div
          className="col-1"
          style={{
            borderLeft: "1px dashed rgba(0, 0, 0, 0.5)",
          }}
        >
          {problem && problem.phone}
        </div>
        <div
          className="col-1"
          style={{
            borderLeft: "1px dashed rgba(0, 0, 0, 0.5)",
          }}
        >
          {problem && problem.placeName}
        </div>
        <div
          className="col-1"
          style={{
            borderLeft: "1px dashed rgba(0, 0, 0, 0.5)",
          }}
        >
          {problem && problem.customerName}
        </div>
        <div
          className="col-4"
          style={{
            borderLeft: "1px dashed rgba(0, 0, 0, 0.5)",
          }}
        >
          {problem && problem.desc}
        </div>
        <div
          className="col-1"
          style={{
            borderLeft: "1px dashed rgba(0, 0, 0, 0.5)",
          }}
        >
          {problem && problem.departmentName}
        </div>
        <div
          className="col-1"
          style={{
            borderLeft: "1px dashed rgba(0, 0, 0, 0.5)",
          }}
        >
          {problem && problem.updaterWorkerName}
        </div>
        <div className="col-1">
          <IconButton
            style={{ position: "relative", top: "10%" }}
            onClick={() => {
              return problem && click(problem);
            }}
          >
            <ZoomInIcon style={{ fontSize: "35px" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default ProblemRow;
