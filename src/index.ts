import Object from "@rbxts/object-utils";
import { RunService, Workspace } from "@rbxts/services";

export namespace Visualize {
	const swappableArrays = new Array<Swappable>();
	const config: ConfigureSettings = {
		enabled: true,
		color: new Color3(1, 1, 1),
		alwaysOnTop: true,
		vectorRadius: 0.1,
		pointRadius: 0.1,
		lineRadius: 0.02,
		lineInnerRadius: 0,
		transparency: 0.5,
		cframeLength: 1,
		cacheAdornments: false,
		vectorLine: false,
	};

	function createHandleAdornment<T extends HandleAdornments>(className: T) {
		const instance = new Instance(className);
		instance.Transparency = config.transparency;
		instance.AlwaysOnTop = config.alwaysOnTop;
		instance.Color3 = config.color;
		instance.Visible = true;
		instance.ZIndex = 2;
		instance.Adornee = Workspace.Terrain;
		instance.Parent = Workspace.Terrain;
		return instance;
	}

	function createSwappable<T extends Instance>() {
		const swappable = {
			used: new Array<T>(),
			unused: new Array<T>(),
		};

		swappableArrays.push(swappable);
		return swappable;
	}

	function pop<T extends Instance>(swappable: Swappable<T>) {
		return config.cacheAdornments ? swappable.unused.pop() : undefined;
	}

	const vectors = createSwappable<ConeHandleAdornment | CylinderHandleAdornment>();
	const points = createSwappable<SphereHandleAdornment>();
	const lines = createSwappable<CylinderHandleAdornment>();

	/**
	 * Override the default Visualize settings.
	 */
	export function configure(newConfig: Partial<ConfigureSettings>) {
		Object.assign(config, newConfig);
	}

	/**
	 * Render a direction Vector3
	 * @param origin The origin of the vector.
	 * @param direction The direction of the vector.
	 * @param color An optional color.
	 */
	export function vector(origin: Vector3, direction: Vector3, color = config.color) {
		if (!config.enabled) return;

		let offset = 0;
		let adornment = pop(vectors);
		if (!adornment) {
			adornment = createHandleAdornment(config.vectorLine ? "CylinderHandleAdornment" : "ConeHandleAdornment");
			adornment.Height = math.max(direction.Magnitude, 1);
			adornment.Radius = config.vectorRadius;
			offset = config.vectorLine ? direction.Magnitude / 2 : 0;
		}

		adornment.CFrame = CFrame.lookAt(origin, origin.add(direction)).mul(new CFrame(0, 0, -offset));
		adornment.Color3 = color;

		vectors.used.push(adornment);
	}

	/**
	 * Render a single position as a point
	 * @param origin The point's location.
	 * @param color An optional color.
	 */
	export function point(origin: Vector3, color = config.color) {
		if (!config.enabled) return;

		let adornment = pop(points);
		if (!adornment) {
			adornment = createHandleAdornment("SphereHandleAdornment");
			adornment.Radius = config.pointRadius;
		}

		adornment.CFrame = new CFrame(origin);
		adornment.Color3 = color;

		points.used.push(adornment);
	}

	/**
	 * Draw a line between two points
	 * @param start The start of the line.
	 * @param finish The end of the line.
	 * @param color An optional color.
	 */
	export function line(start: Vector3, finish: Vector3, color = config.color) {
		if (!config.enabled) return;

		let adornment = pop(lines);
		if (!adornment) {
			adornment = createHandleAdornment("CylinderHandleAdornment");
			adornment.Height = start.sub(finish).Magnitude;
			adornment.Radius = config.lineRadius;
			adornment.InnerRadius = config.lineInnerRadius;
		}

		adornment.CFrame = CFrame.lookAt(start, finish).mul(new CFrame(0, 0, -start.sub(finish).Magnitude / 2));
		adornment.Color3 = color;

		lines.used.push(adornment);
	}

	/**
	 * Render a CFrame.
	 * Equivalent to: Visualize.vector(pos, lookVector, color)
	 * @param cframe The CFrame to render.
	 * @param color An optional color.
	 */
	export function cframe(cframe: CFrame, color = config.color) {
		vector(cframe.Position, cframe.LookVector.mul(config.cframeLength), color);
	}

	RunService.Heartbeat.Connect(() => {
		for (const swappable of swappableArrays) {
			for (const unused of swappable.unused) {
				unused.Destroy();
			}

			swappable.unused = swappable.used;
			swappable.used = [];
		}
	});
}
