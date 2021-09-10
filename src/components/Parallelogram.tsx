import { forwardRef } from "react";
import {
  ParallelogramObjectConfig,
  ParallelogramObject,
} from "../lib/shapes/ParallelogramObject";
import { useMoveable } from "../hooks/useMoveable";
import { CanvasObjectProps, useCanvasObject } from "../hooks/useCanvasObject";

type ParallelogramProps = CanvasObjectProps<ParallelogramObjectConfig>;

export const Parallelogram = forwardRef<
  ParallelogramObject,
  ParallelogramProps
>(({ children, ...props }, ref) => {
  const parallelogram = useCanvasObject<
    ParallelogramObject,
    ParallelogramObjectConfig
  >(ParallelogramObject, props, ref);

  useMoveable(parallelogram, delta => {
    parallelogram.configure({
      a: {
        x: parallelogram.config.a!.x + delta.x,
        y: parallelogram.config.a!.y + delta.y,
      },
      b: {
        x: parallelogram.config.b!.x + delta.x,
        y: parallelogram.config.b!.y + delta.y,
      },
      c: {
        x: parallelogram.config.c!.x + delta.x,
        y: parallelogram.config.c!.y + delta.y,
      },
    });
  });

  return null;
});

Parallelogram.displayName = "Parallelogram";
