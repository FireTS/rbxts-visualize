# @rbxts/visualize
`@rbxts/visualize` is a module that allows you to visualize several different data types.

## Installation:

```npm i @rbxts/visualize```

## Example Usage
```typescript
import { Visualize } from "@rbxts/visualize";

// Visualizations are cleared after 1 frame automatically.
game.GetService("RunService").Heartbeat.Connect(() => {
	// Visualize white (default color) point
	Visualize.point(new Vector3(0, 2, 0));

	// Visualize red line
	Visualize.line(new Vector3(0, 2, 0), new Vector3(2, 0, 0), new Color3(1, 0, 0));

	// Visualize green CFrame
	Visualize.cframe(new CFrame(0, 3, 0), new Color3(0, 1, 0));

	// Visualize blue vector
	Visualize.vector(new Vector3(0, 2, 0), new Vector3(0, 1, 0), new Color3(0, 0, 1));
});
```

## Configuration
You can override the global settings for rendering using `Visualize.configure()`
The following settings are exposed:
```typescript
interface ConfigureSettings {
	/**
	 * Whether this module should draw the visualized points.
	 */
	enabled: boolean;

	/**
	 * The default color for all visualizations.
	 */
	color: Color3;

	/**
	 * Whether visualizations should be drawn over models.
	 */
	alwaysOnTop: boolean;

	/**
	 * The default transparency for all visualizations.
	 */
	transparency: number;

	/**
	 * The default length for CFrame visualizations.
	 */
	cframeLength: number;

	/**
	 * The default radius for vector visualizations.
	 */
	vectorRadius: number;

	/**
	 * Should vector visualizations be drawn as a line instead of a zone?
	 */
	vectorLine: boolean;

	/**
	 * The default radius for point visualizations.
	 */
	pointRadius: number;

	/**
	 * The default radius for line visualizations.
	 */
	lineRadius: number;

	/**
	 * The default inner radius for line visualizations.
	 */
	lineInnerRadius: number;

	/**
	 * Whether to reuse cached adornments.
	 * This can cause flickering, so it's disabled by default.
	 */
	cacheAdornments: boolean;
}
```

## Changelog

### 1.0.0
- Inital release
