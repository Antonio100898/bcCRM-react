import { createContext, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  IProblem,
  IWorker,
  IUser,
  IProblemType,
  ProblemSummery,
} from "../Model";
import { TOKEN_KEY } from "../Consts/Consts";
import { authService } from "../API/services/authService";
import { problemService } from "../API/services";

export interface Props {
  children: React.ReactNode;
}

export type LoginUsernamePassword = {
  userName: string;
  password: string;
};

export type LoginToken = {
  workerKey: string;
};

export type LoginCredetials = LoginUsernamePassword | LoginToken;

export interface IUserContext {
  user: IUser | null;
  updateUser: (u: IUser | null) => void;
  departments: ProblemSummery[];
  updateDepartments: (summery: ProblemSummery[]) => void;
  showProblemDialog: boolean;
  updateShowProblemDialog: (u: boolean) => void;
  currentProblem: IProblem | null;
  updateCurrentProblem: (u: IProblem | null) => void;
  refreshProblemCount: boolean;
  updateRefreshProblemCount: (u: boolean) => void;
  showLoader: boolean;
  updateShowLoader: (u: boolean) => void;
  allProblems: IProblem[];
  updateAllProblems: (u: IProblem[]) => void;
  refreshProblems: boolean;
  updateRefreshProblems: (u: boolean) => void;
  workers: IWorker[];
  updateWorkers: (u: IWorker[]) => void;
  selectedDepartmentId: number;
  updateSelectedDepartmentId: (u: number) => void;
  showScreensMenu: boolean;
  updateShowScreensMenu: (u: boolean) => void;
  problemTypes: IProblemType[];
  updateProblemTypes: (u: IProblemType[]) => void;
  login: (credentials: LoginCredetials) => Promise<IUser | null>;
  handleProblemClose: () => void;
  updateProblem: (value: IProblem) => Promise<void>;
  orderBy: keyof IProblem;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof IProblem>>;
  fileLoading: boolean;
  updateDepartment: (department: string) => Promise<void>;
  isAdmin: boolean;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  updateUser: () => {},
  departments: [],
  updateDepartments: () => {},
  showProblemDialog: false,
  updateShowProblemDialog: () => {},
  currentProblem: null,
  updateCurrentProblem: () => {},
  refreshProblemCount: true,
  updateRefreshProblemCount: () => {},
  showLoader: false,
  updateShowLoader: () => {},
  allProblems: [],
  updateAllProblems: () => {},
  refreshProblems: true,
  updateRefreshProblems: () => {},
  workers: [],
  updateWorkers: () => {},
  selectedDepartmentId: 0,
  updateSelectedDepartmentId: () => {},
  showScreensMenu: false,
  updateShowScreensMenu: () => {},
  problemTypes: [],
  updateProblemTypes: () => {},
  login: async () => null,
  handleProblemClose: () => {},
  updateProblem: () => new Promise(() => {}),
  orderBy: "startTimeEN",
  setOrderBy: () => {},
  fileLoading: false,
  updateDepartment: () => new Promise(() => {}),
  isAdmin: false,
});

export function UserContextProvider(props: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<ProblemSummery[]>([]);

  const updateDepartments = (summery: ProblemSummery[]) => {
    setDepartments(summery);
  };

  const [user, setUser] = useState<IUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateUser = (u: IUser | null) => {
    setUser(u);
    setIsAdmin(u?.userType === 1);
  };

  const [showProblemDialog, setShowProblemDialog] = useState<boolean>(false);

  const updateShowProblemDialog = (u: boolean | false) => {
    setShowProblemDialog(u);
  };

  const [currentProblem, setCurrentProblem] = useState<IProblem | null>(null);

  const updateCurrentProblem = (u: IProblem | null) => {
    setCurrentProblem(u);
  };

  const [refreshProblemCount, setRefreshProblemCount] =
    useState<boolean>(false);

  const updateRefreshProblemCount = (u: boolean | false) => {
    setRefreshProblemCount(u);
  };

  const [showLoader, setShowLoader] = useState<boolean>(false);

  const updateShowLoader = (u: boolean | false) => {
    setShowLoader(u);
  };

  const [allProblems, setAllProblems] = useState<IProblem[]>([]);

  const updateAllProblems = (u: IProblem[]) => {
    setAllProblems(u);
  };

  const [refreshProblems, setRefreshProblems] = useState<boolean>(true);

  const updateRefreshProblems = (u: boolean) => {
    setRefreshProblems(u);
  };

  const [workers, setWorkers] = useState<IWorker[]>([]);

  const updateWorkers = (u: IWorker[]) => {
    setWorkers(u);
  };

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0);

  const updateSelectedDepartmentId = (u: number | 0) => {
    setSelectedDepartmentId(u);
  };

  const [showScreensMenu, setShowScreensMenu] = useState<boolean>(false);

  const updateShowScreensMenu = (u: boolean | false) => {
    // console.log("setShowLoader: " + u);
    setShowScreensMenu(u);
  };

  const [problemTypes, setProblemTypes] = useState<IProblemType[]>([]);

  const updateProblemTypes = (u: IProblemType[]) => {
    setProblemTypes(u);
  };

  const login = async (credentials: LoginCredetials): Promise<IUser | null> => {
    try {
      const data =
        "workerKey" in credentials
          ? await authService.loginAgain(credentials)
          : await authService.login(credentials);
      if (!data?.d) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: "אין משתמש כזה",
          variant: "error",
        });
        localStorage.removeItem(TOKEN_KEY);
        navigate("/login");
        return null;
      }

      if (!data?.d.success) {
        updateShowLoader(false);
        enqueueSnackbar({
          message: data.d.msg,
          variant: "error",
        });
        localStorage.removeItem(TOKEN_KEY);
        navigate("/login");
        return null;
      }
      updateUser(data.d);
      localStorage.setItem(TOKEN_KEY, data.d.key);
      updateWorkers(data.d.workers);
      updateProblemTypes(data.d.problemTypes);
      updateShowScreensMenu(false);
      updateSelectedDepartmentId(-1);
      updateDepartments(data.d.summery?.departments);
      return data.d;
    } catch (error) {
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
      console.error(error);
      return null;
    }
  };

  const [fileLoading] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof IProblem>("startTimeEN");

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

  const handleProblemClose = () => {
    if (fileLoading) {
      if (confirm("הקבצים שהעלת עדיין לא נשמרו, שנבטל?")) {
        updateShowProblemDialog(false);
        setCurrentProblem(null);
      }
    } else {
      updateShowProblemDialog(false);
      setCurrentProblem(null);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        departments,
        updateDepartments,
        updateDepartment,
        showProblemDialog,
        updateShowProblemDialog,
        currentProblem,
        updateCurrentProblem,
        refreshProblemCount,
        updateRefreshProblemCount,
        showLoader,
        updateShowLoader,
        allProblems,
        updateAllProblems,
        refreshProblems,
        updateRefreshProblems,
        workers,
        updateWorkers,
        selectedDepartmentId,
        updateSelectedDepartmentId,
        showScreensMenu,
        updateShowScreensMenu,
        problemTypes,
        updateProblemTypes,
        login,
        handleProblemClose,
        updateProblem,
        orderBy,
        setOrderBy,
        fileLoading,
        isAdmin: true,
      }}
      {...props}
    />
  );
}
