import { IWorker } from "../../Model";
import { IMAGES_PATH_WORKERS } from "../../Consts/Consts";
import "./WorkersList.styles.css";

interface Props {
  worker: IWorker;
  selected: boolean;
}

export function WorkerAvatar({ selected, worker }: Props) {
  const getName = () => {
    const [f, l] = worker.workerName.split(" ");
    return `${f ? f[0] : ""}${l ? l[0] : ""}`;
  };

  return (
    <div className="avatar">
      {!selected && worker.imgPath && (
        <img src={`${IMAGES_PATH_WORKERS}${worker.imgPath}`} alt="" />
      )}
      {(selected || !worker.imgPath) && <div>{selected ? "✓" : getName()}</div>}
    </div>
  );
}
