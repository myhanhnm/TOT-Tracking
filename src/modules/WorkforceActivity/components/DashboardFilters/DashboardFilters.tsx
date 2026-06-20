'use client';

import * as React from 'react';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';

import { ActivityFilterOptions, ActivityFilters } from '../../models/activity-filters.model';
import { useFilteredAnalysis } from '../../hooks';

import classes from './DashboardFilters.module.scss';

function formatDateLabel(dateKey: string): string {
  try {
    return format(parseISO(dateKey), 'MMM d, yyyy');
  } catch {
    return dateKey;
  }
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps): React.ReactElement {
  return (
    <FormControl size="small" className={classes['filter-field']} fullWidth>
      <InputLabel id={`filter-${label}`}>{label}</InputLabel>
      <Select
        labelId={`filter-${label}`}
        value={value}
        label={label}
        onChange={(event) => onChange(event.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

type Props = {
  filterOptions: ActivityFilterOptions;
};

export function DashboardFilters({ filterOptions }: Props): React.ReactElement {
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useFilteredAnalysis();

  const handleFilterChange = <K extends keyof ActivityFilters>(key: K, value: ActivityFilters[K]) => {
    updateFilter(key, value);
  };

  return (
    <Box className={classes['wrapper']}>
      <Box className={classes['header']}>
        <Typography variant="subtitle1" component="h2" className={classes['title']}>
          Filters
        </Typography>
        {hasActiveFilters ? (
          <Box className={classes['actions']}>
            <Button
              size="small"
              startIcon={<FilterAltOffIcon />}
              onClick={resetFilters}
              variant="text"
            >
              Clear filters
            </Button>
          </Box>
        ) : null}
      </Box>

      <TextField
        size="small"
        placeholder="Search associates by name or login ID..."
        value={filters.search}
        onChange={(event) => handleFilterChange('search', event.target.value)}
        className={classes['search-field']}
        fullWidth
        slotProps={{
          input: {
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
          },
        }}
      />

      <Box className={classes['filters-grid']}>
        <FormControl size="small" className={classes['filter-field']} fullWidth>
          <InputLabel id="filter-date">Date</InputLabel>
          <Select
            labelId="filter-date"
            value={filters.date ?? ''}
            label="Date"
            onChange={(event) =>
              handleFilterChange('date', event.target.value === '' ? null : event.target.value)
            }
          >
            <MenuItem value="">All dates</MenuItem>
            {filterOptions.dates.map((date) => (
              <MenuItem key={date} value={date}>
                {formatDateLabel(date)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
          size="small"
          options={filterOptions.associateNames}
          value={filters.associateName || null}
          onChange={(_event, value) => handleFilterChange('associateName', value ?? '')}
          renderInput={(params) => <TextField {...params} label="Associate Name" />}
          className={classes['filter-field']}
          fullWidth
          clearOnEscape
        />

        <Autocomplete
          size="small"
          options={filterOptions.loginIds}
          value={filters.loginId || null}
          onChange={(_event, value) => handleFilterChange('loginId', value ?? '')}
          renderInput={(params) => <TextField {...params} label="Login ID" />}
          className={classes['filter-field']}
          fullWidth
          clearOnEscape
        />

        <FilterSelect
          label="Function"
          value={filters.function}
          options={filterOptions.functions}
          onChange={(value) => handleFilterChange('function', value)}
        />

        <FilterSelect
          label="Process"
          value={filters.process}
          options={filterOptions.processes}
          onChange={(value) => handleFilterChange('process', value)}
        />

        <FilterSelect
          label="Unit Class"
          value={filters.unitClass}
          options={filterOptions.unitClasses}
          onChange={(value) => handleFilterChange('unitClass', value)}
        />
      </Box>
    </Box>
  );
}
