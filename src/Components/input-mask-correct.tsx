import { ReactNode } from "react";
import InputMask, { Props as InputMaskProps } from "react-input-mask";

type TInputMaskCorrect = Omit<InputMaskProps, "children"> & {
  children?: (inputProps: any) => JSX.Element;
};
export const InputMaskCorrect: React.FC<TInputMaskCorrect> = ({
  children,
  ...props
}) => {
  const child = children as ReactNode;
  return <InputMask {...props}>{child}</InputMask>;
};
