import { Surface } from "./components/Surface";
import { Circle } from "./components/Circle";
import { Text } from "./components/Text";
import { Parallelogram } from "./components/Parallelogram";
import { StyledAppContainer, GlobalStyles } from "./styles";
import {
  MouseEventHandler,
  useCallback,
  useReducer,
  useRef,
  useState,
} from "react";
import { CircleObject } from "./lib/shapes/CircleObject";
import {
  ParallelogramObject,
  ParallelogramObjectConfig,
} from "./lib/shapes/ParallelogramObject";
import { Point } from "./lib/CanvasObject";
import { TextObject } from "./lib/shapes/TextObject";
import { getCircleRadiusByArea } from "./lib/utils";

const forceUpdateReducer = (i: number) => i + 1;

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0);
  return forceUpdate;
};

export const App = () => {
  const circles = useRef<Point[]>([]);
  const forceUpdate = useForceUpdate();
  const [fill, setFill] = useState("blue");

  const centerCircleRef = useRef<CircleObject>();
  const [centerCircle, setCenterCircle] = useState<Point>();

  const circleRefs = [
    useRef<CircleObject>(),
    useRef<CircleObject>(),
    useRef<CircleObject>(),
    useRef<CircleObject>(),
  ];

  const textRefs = [
    useRef<TextObject>(),
    useRef<TextObject>(),
    useRef<TextObject>(),
    useRef<TextObject>(),
  ];

  const onReset = () => {
    circles.current = [];
    setCenterCircle(undefined);
    forceUpdate();
  };

  const parallelogramRef = useRef<ParallelogramObject>();

  const handleSurfaceClick: MouseEventHandler = useCallback(
    event => {
      if (circles.current.length < 3) {
        circles.current.push((event as any).data as Point);
        forceUpdate();
      }
    },
    [forceUpdate]
  );

  const handleCircleChange = (index: number) => (_: any) => {
    if (circles.current.length !== 4) {
      return;
    }

    const points = ["a", "b", "c", "b"];
    const newConfig: any = {};

    newConfig[points[index]] = {
      x: circleRefs[index].current?.config.x,
      y: circleRefs[index].current?.config.y,
    };

    parallelogramRef.current!.configure(newConfig, true);

    const { config } = parallelogramRef.current!;

    const parallelogramPoints: Point[] = [
      config.a,
      config.b,
      config.c,
      config.d,
    ] as Point[];

    parallelogramPoints.forEach((point, i) => {
      circleRefs[index === 3 ? 1 : i].current?.configure(point, true);
      textRefs[i].current?.configure(
        {
          ...point,
          text: `${point.x}:${point.y}`,
        },
        true
      );
    });

    // TODO: radius and all size props should respect canvas DPI
    centerCircleRef.current?.configure(
      {
        ...parallelogramRef.current!.getCenter(),
        radius: getCircleRadiusByArea(parallelogramRef.current!.getArea()) * 2,
      },
      false
    );
  };

  // TODO: radius and all size props should respect canvas DPI
  const onParallelogramChange = (config: ParallelogramObjectConfig) => {
    centerCircleRef.current?.configure(
      {
        ...parallelogramRef.current!.getCenter(),
        radius: getCircleRadiusByArea(parallelogramRef.current!.getArea()) * 2,
      },
      false
    );

    if (circles.current.length === 4 && config.d) {
      const points = [config.a, config.b, config.c, config.d] as Point[];
      points.forEach((point, index) => {
        circleRefs[index].current?.configure(point, true);
        textRefs[index].current?.configure(
          {
            ...point,
            text: `${point.x}:${point.y}`,
          },
          true
        );
      });
    }

    if (circles.current.length === 3 && config.d) {
      setFill("red");
      circles.current.push({
        x: config.d.x,
        y: config.d.y,
      });
      setCenterCircle(parallelogramRef.current!.getCenter());

      forceUpdate();
    }
  };

  return (
    <StyledAppContainer>
      <GlobalStyles />
      <button onClick={onReset}>reset</button>

      <Surface onClick={handleSurfaceClick}>
        {centerCircle && (
          <Circle
            ref={centerCircleRef as any}
            {...centerCircle}
            moveable={false}
            stroke="yellow"
            radius={50}
          />
        )}
        {circles.current.length >= 3 && (
          <>
            <Parallelogram
              a={{
                x: circles.current[0].x,
                y: circles.current[0].y,
              }}
              b={{
                x: circles.current[1].x,
                y: circles.current[1].y,
              }}
              c={{
                x: circles.current[2].x,
                y: circles.current[2].y,
              }}
              stroke="blue"
              ref={node => {
                if (node) {
                  parallelogramRef.current = node;
                }
              }}
              onChange={onParallelogramChange}
            />
          </>
        )}
        {circles.current.map((circle, index) => (
          <Text
            key={index}
            x={circle.x}
            y={circle.y}
            fill={"white"}
            fontSize={20}
            ref={textRefs[index] as any}
            text={`${circle.x}:${circle.y}`}
          />
        ))}
        {circles.current.map((circle, index) => (
          <Circle
            key={index}
            x={circle.x}
            y={circle.y}
            radius={11 * 2}
            stroke={fill}
            ref={node => {
              if (node) {
                circleRefs[index].current = node;
              }
            }}
            onChange={handleCircleChange(index)}
          />
        ))}
      </Surface>
    </StyledAppContainer>
  );
};
