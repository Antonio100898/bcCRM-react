import { Box, IconButton, TextField } from "@mui/material";
import {
  FilterAltOutlined as FilterIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { ISearchProblem } from "../../Model";
import { api } from "../../API/axoisConfig";
import { useUser } from "../../Context/useUser";
import { SearchFilterDialog } from "../../Dialogs/SearchFilterDialog";

export default function Search() {
  const { enqueueSnackbar } = useSnackbar();
  const [searchFilterOpen, setSearchFilterOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState<Partial<ISearchProblem>>({
    daysBack: 3,
    place: true,
    phone: false,
    workerName: false,
    desc: false,
  });

  const { updateAllProblems, updateShowLoader, updateRefreshProblems } =
    useUser();

  const searchProblems = async () => {
    if (
      typeof searchFilter.searchValue !== "string" ||
      !searchFilter.searchValue.length
    ) {
      enqueueSnackbar({
        message: "אנא הזן משהו לחיפוש",
        variant: "error",
      });
      return;
    }
    try {
      updateShowLoader(true);

      const data = await api.searchProblems(searchFilter);

      if (data?.d.success) {
        updateAllProblems(data.d.problems);
        updateRefreshProblems(false);
        updateShowLoader(false);
      } else {
        enqueueSnackbar({
          message: data?.d.msg,
          variant: "error",
        });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        enqueueSnackbar({
          message: error.message,
          variant: "error",
        });
    }
  };

  const handleFilterChange = (filter: Partial<ISearchProblem>) => {
    const newFilter = { ...searchFilter, ...filter };
    setSearchFilter(newFilter);

    if (
      typeof newFilter.searchValue === "string" &&
      newFilter.searchValue.length
    ) {
      searchProblems();
    }
  };

  const onChange = <K extends keyof ISearchProblem>(
    key: K,
    val: ISearchProblem[K]
  ) => {
    setSearchFilter({ ...searchFilter, [key]: val });
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchProblems();
    }
  };

  return (
    <div>
      <TextField
        placeholder="חפש"
        onKeyDown={handleKeywordKeyPress}
        onChange={(e) => onChange("searchValue", e.target.value)}
        InputProps={{
          sx: {
            maxWidth: 1000,
            fontSize: 20,
            borderRadius: 30,
            "& .MuiInputBase-input": {
              py: "0 !important",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              "& legend": {
                textAlign: "right",
                float: "left",
              },
            },
          },
          endAdornment: (
            <Box sx={{ display: "flex" }}>
              <IconButton onClick={() => setSearchFilterOpen(true)}>
                <FilterIcon />
              </IconButton>
              <IconButton onClick={() => searchProblems()}>
                <SearchIcon />
              </IconButton>
            </Box>
          ),
        }}
      />
      <SearchFilterDialog
        open={searchFilterOpen}
        onClose={() => setSearchFilterOpen(false)}
        filter={searchFilter}
        onFilterChanged={handleFilterChange}
      />
    </div>
  );
}
