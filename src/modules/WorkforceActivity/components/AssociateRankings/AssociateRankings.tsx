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
  Typography,
} from '@mui/material';

import { useActivityContext } from 'src/context';
import { AssociateSummary } from '../../models';
import { formatDuration, formatUtilizationPercent } from 'src/shared/utils';

import classes from './AssociateRankings.module.scss';

type Props = {
  topOffTaskAssociates: AssociateSummary[];
  topUtilizedAssociates: AssociateSummary[];
  topScanVolumeAssociates: AssociateSummary[];
};

type RankingPanelProps = {
  title: string;
  children: React.ReactNode;
};

function RankingPanel({ title, children }: RankingPanelProps): React.ReactElement {
  return (
    <Box className={classes['ranking-panel']}>
      <Typography variant="subtitle1" component="h3" className={classes['ranking-title']}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

type EmptyTableBodyProps = {
  message: string;
};

function EmptyTableBody({ message }: EmptyTableBodyProps): React.ReactElement {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={5} className={classes['empty-row']}>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export function AssociateRankings({
  topOffTaskAssociates,
  topUtilizedAssociates,
  topScanVolumeAssociates,
}: Props): React.ReactElement {
  const { openAssociate } = useActivityContext();

  return (
    <Box className={classes['rankings-grid']}>
      <RankingPanel title="Top off-task associates">
        <TableContainer className={classes['table-container']}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Associate</TableCell>
                <TableCell>Login ID</TableCell>
                <TableCell align="right">Off-task time</TableCell>
                <TableCell align="right">Gaps</TableCell>
                <TableCell align="right">Utilization</TableCell>
              </TableRow>
            </TableHead>
            {topOffTaskAssociates.length > 0 ? (
              <TableBody>
                {topOffTaskAssociates.map((associate) => (
                  <TableRow
                    key={associate.loginId}
                    hover
                    onClick={() => openAssociate(associate.loginId)}
                    className={classes['table-row']}
                  >
                    <TableCell className={classes['name-cell']}>{associate.associateName}</TableCell>
                    <TableCell className={classes['mono']}>{associate.loginId}</TableCell>
                    <TableCell align="right" className={classes['mono']}>
                      {formatDuration(associate.totalOffTaskDurationMs)}
                    </TableCell>
                    <TableCell align="right" className={classes['mono']}>
                      {associate.offTaskGapCount}
                    </TableCell>
                    <TableCell align="right" className={classes['mono']}>
                      {formatUtilizationPercent(associate.utilizationPercent)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <EmptyTableBody message="No off-task data for current filters" />
            )}
          </Table>
        </TableContainer>
      </RankingPanel>

      <RankingPanel title="Top utilized associates">
        <TableContainer className={classes['table-container']}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Associate</TableCell>
                <TableCell align="right">Utilization</TableCell>
                <TableCell align="right">Active time</TableCell>
                <TableCell align="right">Scans</TableCell>
              </TableRow>
            </TableHead>
            {topUtilizedAssociates.length > 0 ? (
              <TableBody>
                {topUtilizedAssociates.map((associate) => (
                  <TableRow
                    key={associate.loginId}
                    hover
                    onClick={() => openAssociate(associate.loginId)}
                    className={classes['table-row']}
                  >
                    <TableCell className={classes['name-cell']}>{associate.associateName}</TableCell>
                    <TableCell align="right" className={classes['mono']}>
                      {formatUtilizationPercent(associate.utilizationPercent)}
                    </TableCell>
                    <TableCell align="right" className={classes['mono']}>
                      {formatDuration(associate.activeTimeMs)}
                    </TableCell>
                    <TableCell align="right" className={classes['mono']}>
                      {associate.totalScans}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <EmptyTableBody message="No utilization data for current filters" />
            )}
          </Table>
        </TableContainer>
      </RankingPanel>

      <RankingPanel title="Top scan volume">
        <TableContainer className={classes['table-container']}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Associate</TableCell>
                <TableCell align="right">Scans</TableCell>
              </TableRow>
            </TableHead>
            {topScanVolumeAssociates.length > 0 ? (
              <TableBody>
                {topScanVolumeAssociates.map((associate) => (
                  <TableRow
                    key={associate.loginId}
                    hover
                    onClick={() => openAssociate(associate.loginId)}
                    className={classes['table-row']}
                  >
                    <TableCell className={classes['name-cell']}>{associate.associateName}</TableCell>
                    <TableCell align="right" className={classes['mono']}>
                      {associate.totalScans.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <EmptyTableBody message="No scan data for current filters" />
            )}
          </Table>
        </TableContainer>
      </RankingPanel>
    </Box>
  );
}
