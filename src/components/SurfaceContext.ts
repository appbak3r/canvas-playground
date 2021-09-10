import { createContext } from "react";
import { CanvasController } from "../lib/CanvasController";

type SurfaceContextValue = {
  canvas: CanvasController;
};

export const SurfaceContext = createContext<SurfaceContextValue>({
  canvas: null as unknown as CanvasController,
});
