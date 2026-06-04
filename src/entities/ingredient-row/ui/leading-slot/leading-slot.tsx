import { Checkbox, InCartIndicator } from "@/shared/ui";

export const LeadingSlot = ({
  isSelectionMode,
  isSelected,
  isLocked,
  isInCart,
}: {
  isSelectionMode: boolean;
  isSelected: boolean;
  isLocked: boolean;
  isInCart: boolean;
}) => {
  if (isSelectionMode) {
    return (
      <Checkbox isLocked={isLocked} isSelected={isSelected} />
    );
  }

  if (isInCart) {
    return <InCartIndicator />;
  }

  return null;
};