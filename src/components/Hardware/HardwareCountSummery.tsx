import { useEffect, useState } from "react";

import { IHardware } from "../../Model";

export type Props = {
  title: string;
  hardwares_count: IHardware[];
  statusId: number;
};

function HardwareCountSummery({ title, hardwares_count, statusId }: Props) {
  const [hardwares, setHardwares] = useState<IHardware[]>([]);

  useEffect(() => {
    const w = hardwares_count.filter(
      (name: IHardware) => name.statusId === statusId
    );
    setHardwares(w);
  }, [hardwares_count, statusId]);

  return (
    <div
      style={{
        fontFamily: "Rubik",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "26px",
        lineHeight: "38px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "300px",
          background: "#FFAD4A",
          borderWidth: "1px 1px 0px 1px",
          borderStyle: "solid",
          borderColor: "#FFF5E9",
          borderRadius: "8px 8px 0px 0px",
          fontFamily: "Rubik",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: "26px",
          lineHeight: "38px",
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div>
        {hardwares &&
          hardwares.map((h: IHardware) => {
            return (
              <div
                key={Math.random()}
                style={{
                  display: "flex",
                  flex: "row",
                  background: "#FFF5E9",
                  borderWidth: "0px 2px 2px 2px",
                  borderStyle: "solid",
                  borderColor: "#FFF5E9",
                  borderRadius: "0px 0px 8px 8px",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                }}
              >
                <div style={{ width: "80%", textAlign: "right" }}>
                  {h.hardwareName}
                </div>
                <div style={{ width: "20%", textAlign: "left" }}>{h.id}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default HardwareCountSummery;
