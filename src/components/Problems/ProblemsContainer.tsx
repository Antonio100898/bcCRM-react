import { useEffect, useMemo, useState } from "react";
import Masonry from "@mui/lab/Masonry";

import { Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import { IProblem } from "../../Model";
import { ProblemNote } from "./ProblemNote";
import { useUser } from "../../Context/useUser";

export type Props = {
  someProblems: IProblem[] | null;
  title: string;
  startDays: number;
  finishDays: number;
  ticketColor?: string;
  onClick: (pro: IProblem) => void;
};

export function ProblemsContainer({
  title,
  startDays,
  finishDays,
  someProblems,
  ticketColor,
  onClick,
}: Props) {
  const [problems, setProblems] = useState<IProblem[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const media = useMediaQuery("(max-width: 820px)");
  const media2 = useMediaQuery("(max-width: 1200px)");
  const media3 = useMediaQuery("(max-width: 1900px)");

  const columns = useMemo(() => {
    if (media) return 1;
    if (media2) return 2;
    if (media3) return 3;
    return 4;
  }, [media, media2, media3]);

  const { updateRefreshProblemCount } = useUser();

  useEffect(() => {
    updateRefreshProblemCount(true);

    const now = new Date();
    // console.log("now: " + now);
    const wsData1: IProblem[] | null =
      someProblems &&
      someProblems.filter((name: IProblem) => {
        const d = new Date(name.startTimeEN);
        const diffInTime = now.getTime() - d.getTime();
        const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

        const b = startDays <= diffInDays && diffInDays <= finishDays;

        return b;
      });

    if (wsData1) {
      setProblems(wsData1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [someProblems]);

  return (
    <div className="App" style={{ marginRight: 10, borderLeft: "0px" }}>
      {problems && problems.length > 0 && (
        <div>
          <Typography variant="h5" textAlign="start" fontWeight="bold">
            {title}
          </Typography>
          <div className="row">
            <Masonry
              columns={columns}
              spacing={1}
              style={{
                background: "#FFFFFF",
              }}
            >
              {problems &&
                problems.map((problem) => {
                  return (
                    <ProblemNote
                      dense={isMobile}
                      key={problem.id}
                      problem={problem}
                      onClick={onClick}
                      ticketColor={ticketColor || alpha(theme.palette.primary.light, 0.3)}
                    />
                  );
                })}
            </Masonry>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemsContainer;
