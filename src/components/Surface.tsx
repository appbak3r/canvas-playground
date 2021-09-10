import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  RefObject,
  useState,
} from "react";
import { SurfaceContext } from "./SurfaceContext";
import { useRef } from "react";
import { useEffect } from "react";
import { CanvasController } from "../lib/CanvasController";

// TODO: surface onClick should pass event with relative coords
export const Surface = forwardRef<
  CanvasController,
  { children: ReactNode } & HTMLAttributes<HTMLCanvasElement>
>(({ children, ...rest }, forwardedRef) => {
  const canvasRef = useRef<HTMLCanvasElement>();

  const [canvasController, setCanvasController] = useState<CanvasController>();

  useEffect(() => {
    if (!canvasController) {
      return;
    }

    if (typeof forwardedRef === "function") {
      forwardedRef(canvasController);
    } else if (forwardedRef) {
      forwardedRef.current = canvasController;
    }
  }, [forwardedRef, canvasController]);

  useEffect(() => {
    if (canvasRef.current && canvasRef.current.parentElement) {
      const controller = new CanvasController(canvasRef.current);
      controller.configure({
        dpi: window.devicePixelRatio,
        width: canvasRef.current.parentElement.clientWidth,
        height: canvasRef.current.parentElement.clientHeight,
      });

      setCanvasController(controller);
    }
  }, [canvasRef]);

  useEffect(() => {
    const redraw = () => {
      return window.requestAnimationFrame(() => {
        canvasController?.redraw();
        redraw();
      });
    };

    window.addEventListener("resize", () => {
      canvasController?.configure({
        dpi: window.devicePixelRatio,
        width: canvasRef.current!.parentElement!.clientWidth,
        height: canvasRef.current!.parentElement!.clientHeight,
      });
    });

    const timer = redraw();

    return () => {
      canvasController?.destroy();
      window.cancelAnimationFrame(timer);
    };
  }, [canvasController]);

  return (
    <SurfaceContext.Provider
      value={{ canvas: canvasController as CanvasController }}
    >
      <canvas {...rest} ref={canvasRef as RefObject<HTMLCanvasElement>}>
        {canvasController && children}
      </canvas>
    </SurfaceContext.Provider>
  );
});

Surface.displayName = "Surface";
