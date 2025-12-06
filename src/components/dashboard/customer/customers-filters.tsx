import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';

interface Tag {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface CustomersFiltersProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  tagId: string;
  onTagChange: (value: string) => void;
  tags: Tag[];
}

export function CustomersFilters({
  keyword,
  onKeywordChange,
  tagId,
  onTagChange,
  tags,
}: CustomersFiltersProps): React.JSX.Element {
  const [inputValue, setInputValue] = React.useState(keyword);
  React.useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onKeywordChange(inputValue);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <OutlinedInput
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          fullWidth
          placeholder="ระบุชื่อหรือเบอร์โทรศัพท์"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="tag-filter-label">กรองตาม Tag</InputLabel>
          <Select
            labelId="tag-filter-label"
            id="tag-filter"
            value={tagId}
            label="กรองตาม Tag"
            onChange={(e) => onTagChange(e.target.value)}
          >
            <MenuItem value="">
              <em>ทั้งหมด</em>
            </MenuItem>
            {tags.map((tag) => (
              <MenuItem key={tag._id} value={tag._id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Card>
  );
}
