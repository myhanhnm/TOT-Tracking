'use client';

import * as React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';

import { useActivityContext } from '../../context';
import { AssociateSummary } from '../../models';
import { formatDuration, formatEventDateTime, formatUtilizationPercent } from 'src/shared/utils';

import classes from './AssociateTable.module.scss';

type SortField =
  | 'totalOffTaskDurationMs'
  | 'totalScans'
  | 'associateName'
  | 'utilizationPercent'
  | 'activeTimeMs';

type Props = {
  associates: AssociateSummary[];
};

export function AssociateTable({ associates }: Props): React.ReactElement {
  const { openAssociate } = useActivityContext();
  const [sortField, setSortField] = React.useState<SortField>('totalOffTaskDurationMs');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const sortedAssociates = React.useMemo(() => {
    return [...associates].sort((left, right) => {
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

      if (sortField === 'associateName') {
        return left.associateName.localeCompare(right.associateName) * directionMultiplier;
      }

      return (left[sortField] - right[sortField]) * directionMultiplier;
    });
  }, [associates, sortDirection, sortField]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortDirection('desc');
  };

  return (
    <Box className={classes['table-wrapper']}>
      <Typography variant="h5" component="h2" className={classes['title']}>
        All associates
      </Typography>

      {associates.length === 0 ? (
        <Box className={classes['empty-state']}>
          <Typography variant="body2" color="text.secondary">
            No associates match the current filters.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'associateName'}
                    direction={sortField === 'associateName' ? sortDirection : 'asc'}
                    onClick={() => handleSort('associateName')}
                  >
                    Associate
                  </TableSortLabel>
                </TableCell>
                <TableCell>Login ID</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortField === 'totalScans'}
                    direction={sortField === 'totalScans' ? sortDirection : 'asc'}
                    onClick={() => handleSort('totalScans')}
                  >
                    Scans
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortField === 'utilizationPercent'}
                    direction={sortField === 'utilizationPercent' ? sortDirection : 'asc'}
                    onClick={() => handleSort('utilizationPercent')}
                  >
                    Utilization
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortField === 'activeTimeMs'}
                    direction={sortField === 'activeTimeMs' ? sortDirection : 'asc'}
                    onClick={() => handleSort('activeTimeMs')}
                  >
                    Active time
                  </TableSortLabel>
                </TableCell>
                <TableCell>First scan</TableCell>
                <TableCell>Last scan</TableCell>
                <TableCell align="right">Gaps</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortField === 'totalOffTaskDurationMs'}
                    direction={sortField === 'totalOffTaskDurationMs' ? sortDirection : 'asc'}
                    onClick={() => handleSort('totalOffTaskDurationMs')}
                  >
                    Off-task time
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAssociates.map((associate) => (
                <TableRow
                  key={associate.loginId}
                  hover
                  onClick={() => openAssociate(associate.loginId)}
                  className={classes['table-row']}
                >
                  <TableCell className={classes['name-cell']}>{associate.associateName}</TableCell>
                  <TableCell className={classes['mono']}>{associate.loginId}</TableCell>
                  <TableCell align="right" className={classes['mono']}>
                    {associate.totalScans}
                  </TableCell>
                  <TableCell align="right" className={classes['mono']}>
                    {formatUtilizationPercent(associate.utilizationPercent)}
                  </TableCell>
                  <TableCell align="right" className={classes['mono']}>
                    {formatDuration(associate.activeTimeMs)}
                  </TableCell>
                  <TableCell className={classes['mono']}>
                    {formatEventDateTime(associate.firstScan)}
                  </TableCell>
                  <TableCell className={classes['mono']}>
                    {formatEventDateTime(associate.lastScan)}
                  </TableCell>
                  <TableCell align="right" className={classes['mono']}>
                    {associate.offTaskGapCount}
                  </TableCell>
                  <TableCell align="right" className={classes['mono']}>
                    {formatDuration(associate.totalOffTaskDurationMs)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
