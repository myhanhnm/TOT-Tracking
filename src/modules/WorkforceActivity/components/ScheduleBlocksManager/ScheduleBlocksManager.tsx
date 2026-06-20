'use client';

import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { DEFAULT_SCHEDULE_BLOCKS } from '../../constants/schedule.constants';
import { SCHEDULE_BLOCK_TYPE_LABELS } from '../../constants/segment.constants';
import { useActivityContext } from '../../context';
import { ScheduleBlockType } from '../../models/schedule-block.model';

import classes from './ScheduleBlocksManager.module.scss';

const BLOCK_TYPES: ScheduleBlockType[] = ['MEETING', 'PAID_BREAK', 'UNPAID_BREAK'];

type NewBlockForm = {
  type: ScheduleBlockType;
  label: string;
  startTime: string;
  endTime: string;
};

const EMPTY_FORM: NewBlockForm = {
  type: 'PAID_BREAK',
  label: '',
  startTime: '10:00',
  endTime: '10:15',
};

export function ScheduleBlocksManager(): React.ReactElement {
  const { scheduleBlocks, addScheduleBlock, updateScheduleBlock, deleteScheduleBlock, setScheduleBlocks } =
    useActivityContext();
  const [form, setForm] = React.useState<NewBlockForm>(EMPTY_FORM);

  const handleAddBlock = () => {
    if (!form.label.trim() || !form.startTime || !form.endTime) {
      return;
    }

    addScheduleBlock({
      type: form.type,
      label: form.label.trim(),
      startTime: form.startTime,
      endTime: form.endTime,
      appliesTo: 'ALL_ASSOCIATES',
    });

    setForm(EMPTY_FORM);
  };

  const handleResetDefaults = () => {
    setScheduleBlocks(DEFAULT_SCHEDULE_BLOCKS);
  };

  return (
    <Box className={classes['wrapper']}>
      <Box className={classes['header']}>
        <Box>
          <Typography variant="subtitle1" component="h2" className={classes['title']}>
            Schedule blocks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure paid breaks, lunch, and meetings. Blocks overlay off-task gaps on the timeline.
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<RestartAltIcon />}
          onClick={handleResetDefaults}
          variant="text"
        >
          Reset defaults
        </Button>
      </Box>

      <TableContainer className={classes['table-container']}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduleBlocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className={classes['empty-state']}>
                  <Typography variant="body2" color="text.secondary">
                    No schedule blocks configured.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              scheduleBlocks.map((block) => (
                <TableRow key={block.id}>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={block.type}
                        onChange={(event) =>
                          updateScheduleBlock(block.id, {
                            type: event.target.value as ScheduleBlockType,
                          })
                        }
                      >
                        {BLOCK_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {SCHEDULE_BLOCK_TYPE_LABELS[type]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={block.label}
                      onChange={(event) =>
                        updateScheduleBlock(block.id, { label: event.target.value })
                      }
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="time"
                      value={block.startTime}
                      onChange={(event) =>
                        updateScheduleBlock(block.id, { startTime: event.target.value })
                      }
                      className={classes['mono']}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="time"
                      value={block.endTime}
                      onChange={(event) =>
                        updateScheduleBlock(block.id, { endTime: event.target.value })
                      }
                      className={classes['mono']}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => deleteScheduleBlock(block.id)}
                      aria-label={`Delete ${block.label}`}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className={classes['form-grid']}>
        <FormControl size="small" fullWidth>
          <InputLabel id="new-block-type">Type</InputLabel>
          <Select
            labelId="new-block-type"
            value={form.type}
            label="Type"
            onChange={(event) =>
              setForm((current) => ({ ...current, type: event.target.value as ScheduleBlockType }))
            }
          >
            {BLOCK_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {SCHEDULE_BLOCK_TYPE_LABELS[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Label"
          value={form.label}
          onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
          fullWidth
        />
        <TextField
          size="small"
          label="Start time"
          type="time"
          value={form.startTime}
          onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />
        <TextField
          size="small"
          label="End time"
          type="time"
          value={form.endTime}
          onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddBlock}
          sx={{ alignSelf: 'end' }}
        >
          Add block
        </Button>
      </Box>
    </Box>
  );
}
