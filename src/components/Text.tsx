import { forwardRef } from "react";
import { TextObject, TextObjectConfig } from "../lib/shapes/TextObject";
import { CanvasObjectProps, useCanvasObject } from "../hooks/useCanvasObject";

export type TextProps = CanvasObjectProps<TextObjectConfig>;

export const Text = forwardRef<TextObject, TextProps>(
  ({ children, ...props }, ref) => {
    console.log(props);
    useCanvasObject<TextObject, TextObjectConfig>(TextObject, props, ref);

    return null;
  }
);

Text.displayName = "Text";
