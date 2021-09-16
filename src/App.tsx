import { Surface } from "./components/Surface";
import { Circle } from "./components/Circle";
import { Text } from "./components/Text";
import { Parallelogram } from "./components/Parallelogram";
import {
  StyledAppContainer,
  GlobalStyles,
  StyledButton,
  StyledText,
  StyledToolbar,
} from "./styles";
import { RefObject, useCallback, useRef, useState } from "react";
import { CircleObject } from "./lib/shapes/CircleObject";
import {
  ParallelogramObject,
  ParallelogramObjectConfig,
} from "./lib/shapes/ParallelogramObject";
import { Point } from "./lib/CanvasObject";
import { TextObject } from "./lib/shapes/TextObject";
import { getCircleRadiusByArea } from "./lib/utils";
import { useForceUpdate } from "./hooks/useForceUpdate";
import { IoReloadSharp, IoInformation } from "react-icons/io5";

const MaxCircles = 4;
const MaxUserCreatedCircles = 3;

export const App = () => {
  const circles = useRef<Point[]>([]);
  const forceUpdate = useForceUpdate();
  const centerCircleRef = useRef<CircleObject | null>(null);
  const [centerCircle, setCenterCircle] = useState<Point>();
  const informationRef = useRef<TextObject | null>(null);

  const circleRefs = [
    useRef<CircleObject | null>(null),
    useRef<CircleObject | null>(null),
    useRef<CircleObject | null>(null),
    useRef<CircleObject | null>(null),
  ];

  const textRefs = [
    useRef<TextObject | null>(null),
    useRef<TextObject | null>(null),
    useRef<TextObject | null>(null),
    useRef<TextObject | null>(null),
  ];

  const onReset = () => {
    circles.current = [];
    setCenterCircle(undefined);
    forceUpdate();
  };

  const parallelogramRef = useRef<ParallelogramObject | null>(null);

  const handleSurfaceClick = useCallback(
    (event: MouseEvent & { data: Point }) => {
      if (circles.current.length < MaxUserCreatedCircles) {
        circles.current.push(event.data as Point);
        forceUpdate();
      }
    },
    [forceUpdate]
  );

  const updateCenterCircle = () => {
    centerCircleRef.current?.configure(
      {
        ...parallelogramRef.current!.getCenter(),
        radius: getCircleRadiusByArea(parallelogramRef.current!.getArea()),
      },
      false
    );
  };

  const updateCircleTextInfo = (
    point: Point,
    textRef: RefObject<TextObject>
  ) => {
    textRef.current?.configure(
      {
        ...point,
        text: `${point.x.toFixed(2)}:${point.y.toFixed(2)}`,
      },
      true
    );
  };

  const handleCircleChange = (index: number) => () => {
    if (circles.current.length !== MaxCircles) {
      return;
    }

    const points = ["a", "b", "c", "b"] as const;
    const newConfig: Partial<{ [key in typeof points[number]]: Point }> = {};

    newConfig[points[index]] = {
      x: circleRefs[index].current!.config.x,
      y: circleRefs[index].current!.config.y,
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
      updateCircleTextInfo(point, textRefs[i]);
    });

    updateCenterCircle();
    updateInformation();
  };

  const onParallelogramChange = (config: ParallelogramObjectConfig) => {
    updateCenterCircle();

    if (circles.current.length === MaxCircles && config.d) {
      const points = [config.a, config.b, config.c, config.d] as Point[];

      points.forEach((point, index) => {
        circleRefs[index].current?.configure(point, true);
        updateCircleTextInfo(point, textRefs[index]);
      });
    }

    if (circles.current.length === MaxUserCreatedCircles && config.d) {
      circles.current.push({
        x: config.d.x,
        y: config.d.y,
      });
      setCenterCircle(parallelogramRef.current!.getCenter());

      forceUpdate();
    }
    updateInformation();
  };

  const updateInformation = () => {
    const parallelogramArea = parallelogramRef.current?.getArea();
    const parallelogramCenter = parallelogramRef.current?.getCenter();

    const circleRadius = centerCircleRef.current?.config.radius;

    const information = [
      `Parallelogram area: ${parallelogramArea?.toFixed(2)}`,
      `Parallelogram center: ${parallelogramCenter?.x.toFixed(
        2
      )}:${parallelogramCenter?.y.toFixed(2)}`,
      `Circle radius: ${circleRadius?.toFixed(2)}`,
    ];

    informationRef.current?.configure({
      text: information.join("\n"),
    });
  };

  return (
    <StyledAppContainer>
      <GlobalStyles />
      <StyledToolbar>
        <StyledButton onClick={onReset} aria-label="Reset canvas">
          <IoReloadSharp />
        </StyledButton>
        <StyledButton
          onClick={() => {
            alert(
              `
==== CANVAS PLAYGROUND ====
This program draws a parallelogram based on three provided points.
It also creates a circle with the same area as the parallelogram.
Circle center is also aligned with the parallelogram center.

Author: https://github.com/appbak3r

Basic usage:

1. Click on canvas to set 3 points of parallelogram
2. Drag points if you need to change the parallelogram
3. See information about the parallelogram and circle on the right

Have fun!
P.S. Sorry didn't have time to create a more readable dialog. xoxo
              `
            );
          }}
          aria-label="About program"
        >
          <IoInformation />
        </StyledButton>
      </StyledToolbar>

      <Surface onClick={handleSurfaceClick}>
        {circles.current.length === 4 && (
          <>
            <Text x={15} y={150} text="Information:" fill="white" />
            <Text x={15} y={170} text={""} fill="white" ref={informationRef} />
          </>
        )}
        {centerCircle && (
          <Circle
            ref={centerCircleRef}
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
              ref={parallelogramRef}
              onChange={onParallelogramChange}
            />
          </>
        )}
        {circles.current.map((circle, index) => (
          <Text
            key={index}
            x={circle.x}
            y={circle.y}
            fill="white"
            fontSize={16}
            ref={textRefs[index]}
            text={`${circle.x}:${circle.y}`}
          />
        ))}
        {circles.current.map((circle, index) => (
          <Circle
            key={index}
            x={circle.x}
            y={circle.y}
            radius={11}
            stroke="red"
            ref={circleRefs[index]}
            onChange={handleCircleChange(index)}
          />
        ))}
      </Surface>
      {circles.current.length === 0 && (
        <StyledText>Click anywhere on the canvas to start</StyledText>
      )}
    </StyledAppContainer>
  );
};
