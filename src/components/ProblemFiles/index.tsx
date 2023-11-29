import { useSnackbar } from "notistack";
import { api } from "../../API/Api";
import { CrmFile, IProblem } from "../../Model";
import {
  useCallback,
  useState,
  useRef,
  SetStateAction,
  ChangeEvent,
} from "react";
import { useUser } from "../../Context/useUser";
import { IMAGES_PATH_PROBLEMS } from "../../Consts/Consts";
import { useConfirm } from "../../Context/useConfirm";
import {
  Box,
  Typography,
  LinearProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AxiosProgressEvent } from "axios";

type Props = {
  myProblem: IProblem;
  setSelfProblem: React.Dispatch<SetStateAction<IProblem | null>>;
};

export default function ProblemFiles({ myProblem, setSelfProblem }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [fileProgress, setFileProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>();
  const [dragActive, setDragActive] = useState(false);
  const [fileInput, setFileInput] = useState<string>("");
  const [fileLoading, setFileLoading] = useState(false);
  const abortController = useRef(new AbortController());
  const { confirm } = useConfirm();

  const { updateRefreshProblems } = useUser();

  const handleDrag = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    setDragActive(event.type === "dragenter" || event.type === "dragover");
  }, []);

  const toBase64 = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(`${reader.result}`);
      };
      reader.onerror = (error) => reject(error);
    });

  const deleteFile = useCallback(
    async (f: string) => {
      setFileInput("");

      if (await confirm("האם אתה בטוח שברצונך למחוק את הקובץ?")) {
        try {
          const data = await api.deleteFile(f, myProblem.id);
          if (data.d.success) {
            setSelfProblem((prevProblem) => ({
              ...prevProblem,
              files: prevProblem.files.filter((i) => i !== f),
            }));
            updateRefreshProblems(true);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [confirm, myProblem.id, updateRefreshProblems, setSelfProblem]
  );
  const uploadFiles = useCallback(
    async (inputFiles: FileList | null, isClipboard = false) => {
      if (inputFiles) {
        const promises: Promise<CrmFile>[] = [];
        const filteredFiles: File[] = [];

        for (let i = 0; i < inputFiles.length; i += 1) {
          if (
            isClipboard ||
            !(myProblem.files || []).includes(
              `${myProblem.id}_${inputFiles?.[i].name || "file.what"}`
                .replaceAll("-", "_")
                .replaceAll(" ", "_")
            )
          ) {
            filteredFiles.push(inputFiles?.[i]);
          } else {
            enqueueSnackbar(`הקובץ הזה כבר עלה ${inputFiles?.[i].name}`);
          }
        }

        for (let i = 0; i < filteredFiles.length; i += 1) {
          promises.push(
            toBase64(filteredFiles[i]).then((base64) => ({
              filename: `${isClipboard ? `${Date.now()}_` : ""}${
                myProblem.id
              }_${filteredFiles?.[i].name || "file.what"}`
                .replaceAll("-", "_")
                .replaceAll(" ", "_"),
              content: base64,
            }))
          );
        }

        if (promises.length === 0) {
          setFileInput("");
          return;
        }

        setFileLoading(true);
        const files = await Promise.all(promises);

        const updatedProblem = {
          ...myProblem,
          crmFiles: [...(myProblem.crmFiles || []), ...files],
          files: [
            ...(myProblem.files || []),
            ...(files || []).map((f) => f.filename),
          ],
        };

        try {
          const data = await api.uploadProblemFiles(updatedProblem, {
            signal: abortController.signal,
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              setFileProgress(percentCompleted === 100 ? -1 : percentCompleted);
            },
          });
          if (data?.d.success) {
            setSelfProblem({
              ...updatedProblem,
              files: [...new Set(data.d.filesName as string[])],
            });
          }
        } catch (error) {
          enqueueSnackbar({
            message: `נכשל לטעון קבצים.`,
            variant: "error",
          });
        } finally {
          setFileLoading(false);
          updateRefreshProblems(true);
        }
      }
    },
    [
      abortController.signal,
      enqueueSnackbar,
      myProblem,
      setFileLoading,
      updateRefreshProblems,
      setSelfProblem,
    ]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      setDragActive(event.type === "dragover");

      if (event.dataTransfer.files && event.dataTransfer.files.length === 1) {
        uploadFiles(event.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const handleUploadFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setFileInput(e.target.value);
      uploadFiles(e.target.files);
    },
    [uploadFiles]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) =>
      uploadFiles(e.clipboardData.files, true),
    [uploadFiles]
  );

  return (
    <Box
      dir="rtl"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrop}
      onDrop={handleDrop}
    >
      {dragActive && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 128, 255, 0.25)",
            zIndex: 100000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" color="white" fontWeight="bold">
            שחרר קבצים כאן
          </Typography>
        </Box>
      )}
      <input
        type="file"
        multiple
        value={fileInput}
        ref={(r) => {
          fileInputRef.current = r;
        }}
        style={{ display: "none" }}
        onChange={handleUploadFile}
      />

      {fileLoading && (
        <LinearProgress
          variant={fileProgress < 0 ? "indeterminate" : "determinate"}
          value={fileProgress}
        />
      )}
      <Box sx={{ margin: 2, display: "flex", gap: 1 }}>
        {myProblem.files &&
          [...new Set(myProblem.files)].map((file, index) => {
            return (
              <Box key={`${file}${index}`} sx={{ position: "relative" }}>
                <a
                  href={IMAGES_PATH_PROBLEMS + file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip title={file}>
                    <img
                      src={IMAGES_PATH_PROBLEMS + file}
                      alt={file}
                      onError={(e) => {
                        e.currentTarget.src = "broken.png";
                      }}
                      style={{
                        backgroundColor: "#0E0E0E",
                        height: 80,
                        width: 142.2,
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />
                  </Tooltip>
                </a>
                <IconButton
                  color="info"
                  sx={{
                    zIndex: 1000,
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                  }}
                  onClick={() => {
                    deleteFile(file);
                  }}
                >
                  <Tooltip title="מחק קובץ">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}
