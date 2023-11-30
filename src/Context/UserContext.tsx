import { createContext, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  IProblem,
  IWorker,
  User,
  IProblemType,
  ProblemSummery,
} from "../Model";
import { TOKEN_KEY } from "../Consts/Consts";
import { api } from "../API/axoisConfig";

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
  user: User | null;
  updateUser: (u: User | null) => void;
  departments: ProblemSummery[];
  updateDepartments: (summery: ProblemSummery[]) => void;
  showProblemDialog: boolean;
  updateShowProblemDialog: (u: boolean) => void;
  currentProblem: Partial<IProblem> | null;
  updateCurrentProblem: (u: Partial<IProblem> | null) => void;
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
  login: (credentials: LoginCredetials) => Promise<User | null>;
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
});

export function UserContextProvider(props: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<ProblemSummery[]>([]);

  const updateDepartments = (summery: ProblemSummery[]) => {
    setDepartments(summery);
  };

  const [user, setUser] = useState<User | null>(null);

  const updateUser = (u: User | null) => {
    setUser(u);
  };

  const [showProblemDialog, setShowProblemDialog] = useState<boolean>(false);

  const updateShowProblemDialog = (u: boolean | false) => {
    setShowProblemDialog(u);
  };

  const [currentProblem, setCurrentProblem] =
    useState<Partial<IProblem> | null>(null);

  const updateCurrentProblem = (u: Partial<IProblem> | null) => {
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

  const login = async (credentials: LoginCredetials): Promise<User | null> => {
    const { data } = await api.post(
      "workerKey" in credentials ? "/loginAgain" : "/login",
      credentials
    );

    if (!data.d) {
      updateShowLoader(false);
      enqueueSnackbar({
        message: "אין משתמש כזה",
        variant: "error",
      });
      localStorage.removeItem(TOKEN_KEY);
      navigate("/login");
      return null;
    }

    if (!data.d.success) {
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
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        departments,
        updateDepartments,
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
      }}
      {...props}
    />
  );
}
