import { CheckboxBase } from './checkbox-base'

export const Checkbox = ({
  isSelected,
  isLocked,
}: {
  isSelected: boolean;
  isLocked: boolean;
}) => (
  <CheckboxBase
    checked={isSelected}
    className='pointer-events-none'
    disabled={isLocked}
    tabIndex={-1}
  />
);