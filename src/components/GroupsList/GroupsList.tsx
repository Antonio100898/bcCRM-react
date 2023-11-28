import { TextField } from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './GroupsList.styles.css';

export type Group<T> = { title: string; options: T[] };

interface Props<T> {
  groups: Group<T>[];
  renderOption: (item: T) => JSX.Element;
  title: string;
  renderKey: (option: T) => string;
  filterPredicat?: (filter: string, option: T) => boolean;
  optionIsSelected?: (option: T) => boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  idsDismissBlur?: string[];
}

export function GroupsList<T>({
  groups,
  renderOption,
  title,
  renderKey,
  filterPredicat,
  startAdornment,
  endAdornment,
  idsDismissBlur,
  optionIsSelected,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const filterdGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          options: group.options.filter(
            (option) =>
              !filter || !filterPredicat || filterPredicat(filter, option)
          ),
        }))
        .filter((group) => !!group.options.length),
    [filter, filterPredicat, groups]
  );

  const continerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lisnter = (event: any) => {
      const dismissBlur =
        !idsDismissBlur ||
        !idsDismissBlur.filter(
          (id) => document.getElementById(id)?.contains(event.target)
        ).length;
      if (
        continerRef.current &&
        !continerRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target) &&
        dismissBlur
      ) {
        setOpen(false);
        inputRef.current?.blur();
        setTimeout(() => setFilter(''), 300);
      }
    };

    document.addEventListener('mousedown', lisnter);

    return () => document.removeEventListener('mousedown', lisnter);
  }, [idsDismissBlur]);

  const onOpen = useCallback(() => setOpen(true), []);

  return (
    <div className="root">
      <TextField
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        InputProps={{ startAdornment, endAdornment }}
        variant="outlined"
        placeholder={title}
        fullWidth
        onFocus={onOpen}
        ref={inputRef}
      />

      <div
        className={`popContainer ${open ? 'popContainerOpen' : ''}`}
        dir="rtl"
        ref={continerRef}
      >
        {filterdGroups.map(({ title: groupTitle, options }, groupIndex) => (
          <React.Fragment key={groupTitle}>
            <div className="groupTitle">{groupTitle}</div>
            <hr className="line" />
            {options.map((option, optionIndex) => (
              <React.Fragment key={renderKey(option)}>
                <div
                  className={`renderOption ${
                    optionIsSelected && optionIsSelected(option)
                      ? 'selected'
                      : ''
                  }`}
                  key={renderKey(option)}
                >
                  {renderOption(option)}
                </div>
                {(groupIndex < groups.length - 1 ||
                  optionIndex < options.length - 1) && <hr className="line" />}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
