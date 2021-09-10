import { forwardRef } from "react";
import { CircleObject, CircleObjectConfig } from "../lib/shapes/CircleObject";
import { useMoveable } from "../hooks/useMoveable";
import { CanvasObjectProps, useCanvasObject } from "../hooks/useCanvasObject";

export type CircleProps = CanvasObjectProps<CircleObjectConfig>;

export const Circle = forwardRef<CircleObject, CircleProps>(
  ({ children, ...props }, ref) => {
    const circle = useCanvasObject<CircleObject, CircleObjectConfig>(
      CircleObject,
      props,
      ref
    );

    useMoveable(circle, ({ x, y }) => {
      circle.configure(
        {
          x: circle.config.x + x,
          y: circle.config.y + y,
        },
        false
      );
    });

    return null;
  }
);

Circle.displayName = "Circle";
