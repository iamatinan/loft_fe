import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface TagsFiltersProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
}

export function TagsFilters({ keyword, onKeywordChange }: TagsFiltersProps): React.JSX.Element {
  const [inputValue, setInputValue] = React.useState(keyword);
  
  React.useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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
        placeholder="ค้นหา Tag"
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
