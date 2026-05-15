interface IconProps extends React.SVGProps<SVGSVGElement> {
  SVG: React.ElementType;
  className?: string;
}

export const Icon = ({ SVG, className, ...props }: IconProps) => {
  return (
    <SVG aria-hidden='true' className={className} {...props} />
  ) as React.ReactNode;
};
