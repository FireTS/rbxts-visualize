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

interface Swappable<T extends Instance = Instance> {
	used: Array<T>;
	unused: Array<T>;
}

type HandleAdornments = {
	[k in keyof CreatableInstances]: CreatableInstances[k] extends HandleAdornment ? k : never;
}[keyof CreatableInstances];
