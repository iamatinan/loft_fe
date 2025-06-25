import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface LineFiltersProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
}

export function LineFilters({
  keyword,
  onKeywordChange,
}: LineFiltersProps): React.JSX.Element {
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
      <OutlinedInput
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        fullWidth
        placeholder="ระบุชื่อไลน์โปรไฟล์"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
}
