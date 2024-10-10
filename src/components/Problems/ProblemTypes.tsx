import "./ProblemNote.styles.css";
import { Avatar, Chip } from "@mui/material";
import { IProblemType } from "../../Model";

export interface IProp {
  problemTypes: IProblemType[];
}

export function ProblemTypes({ problemTypes }: IProp) {
  return (
    <div style={{ display: "flex", flex: "row", flexWrap: "wrap" }}>
      {problemTypes &&
        problemTypes.map((pType: IProblemType) => {
          return (
            <Chip
              key={pType.id}
              label={pType.problemTypeName}
              size="small"
              variant="outlined"
              sx={{ borderColor: pType.color, m: "3px" }}
              avatar={
                <Avatar
                  sx={{ bgcolor: pType.color }}
                  style={{
                    marginRight: "5px",
                  }}
                >
                  {" "}
                </Avatar>
              }
            />
          );
        })}
    </div>
  );
}

export default ProblemTypes;
