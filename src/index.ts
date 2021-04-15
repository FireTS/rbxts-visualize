import Object from "@rbxts/object-utils";
import { RunService, Workspace } from "@rbxts/services";
import { ConfigureSettings, HandleAdornments, Swappable } from "types";

export class Visualizer {
	private config: ConfigureSettings = {
		enabled: true,
		color: new Color3(1, 1, 1),
		alwaysOnTop: true,
		vectorRadius: 0.1,
		pointRadius: 0.1,
		lineRadius: 0.02,
		lineInnerRadius: 0,
		transparency: 0.5,
		cframeLength: 1,
		cacheAdornments: true,
		vectorLine: false,
	};

	private swappable = new Array<Swappable>();
	private vectors = this.createSwappable<ConeHandleAdornment | CylinderHandleAdornment>();
	private points = this.createSwappable<SphereHandleAdornment>();
	private lines = this.createSwappable<CylinderHandleAdornment>();

	private createHandleAdornment<T extends HandleAdornments>(className: T) {
		const instance = new Instance(className);
		instance.Transparency = this.config.transparency;
		instance.AlwaysOnTop = this.config.alwaysOnTop;
		instance.Color3 = this.config.color;
		instance.Visible = true;
		instance.ZIndex = 2;
		instance.Adornee = Workspace.Terrain;
		instance.Parent = Workspace.Terrain;
		return instance;
	}

	private createSwappable<T extends Instance>() {
		const swappable = {
			used: new Array<T>(),
			unused: new Array<T>(),
		};

		this.swappable.push(swappable);
		return swappable;
	}

	private pop<T extends Instance>(swappable: Swappable<T>) {
		return this.config.cacheAdornments ? swappable.unused.pop() : undefined;
	}

	private step() {
		for (const swappable of this.swappable) {
			for (const unused of swappable.unused) {
				unused.Destroy();
			}

			swappable.unused = swappable.used;
			swappable.used = [];
		}
	}

	/**
	 * A utility class for drawing different datatypes in 3d space.
	 */
	constructor(settings?: Partial<ConfigureSettings>) {
		if (settings) this.configure(settings);

		if (RunService.IsServer()) {
			RunService.Heartbeat.Connect(() => this.step());
		} else {
			RunService.RenderStepped.Connect(() => this.step());
		}
	}

	/**
	 * Override the default Visualizer settings.
	 */
	configure(settings: Partial<ConfigureSettings>) {
		Object.assign(this.config, settings);
	}

	/**
	 * Render a direction Vector3
	 * @param origin The origin of the vector.
	 * @param direction The direction of the vector.
	 * @param color An optional color.
	 */
	vector(origin: Vector3, direction: Vector3, color = this.config.color) {
		if (!this.config.enabled || !Visualize.config.enabled) return;

		let adornment = this.pop(this.vectors);
		if (!adornment) {
			const adornmentType = this.config.vectorLine ? "CylinderHandleAdornment" : "ConeHandleAdornment";
			adornment = this.createHandleAdornment(adornmentType);
		}

		const offset = this.config.vectorLine ? direction.Magnitude / 2 : 0;
		adornment.Height = math.max(direction.Magnitude, 1);
		adornment.Radius = this.config.vectorRadius;

		adornment.CFrame = CFrame.lookAt(origin, origin.add(direction)).mul(new CFrame(0, 0, -offset));
		adornment.Color3 = color;

		this.vectors.used.push(adornment);
	}

	/**
	 * Render a single position as a point
	 * @param origin The point's location.
	 * @param color An optional color.
	 */
	point(origin: Vector3, color = this.config.color) {
		if (!this.config.enabled || !Visualize.config.enabled) return;

		let adornment = this.pop(this.points);
		if (!adornment) {
			adornment = this.createHandleAdornment("SphereHandleAdornment");
		}

		adornment.Radius = this.config.pointRadius;

		adornment.CFrame = new CFrame(origin);
		adornment.Color3 = color;

		this.points.used.push(adornment);
	}

	/**
	 * Draw a line between two points
	 * @param start The start of the line.
	 * @param finish The end of the line.
	 * @param color An optional color.
	 */
	line(start: Vector3, finish: Vector3, color = this.config.color) {
		if (!this.config.enabled || !Visualize.config.enabled) return;

		let adornment = this.pop(this.lines);
		if (!adornment) {
			adornment = this.createHandleAdornment("CylinderHandleAdornment");
		}

		adornment.Height = start.sub(finish).Magnitude;
		adornment.Radius = this.config.lineRadius;
		adornment.InnerRadius = this.config.lineInnerRadius;

		adornment.CFrame = CFrame.lookAt(start, finish).mul(new CFrame(0, 0, -start.sub(finish).Magnitude / 2));
		adornment.Color3 = color;

		this.lines.used.push(adornment);
	}

	/**
	 * Render a CFrame.
	 * Equivalent to: Visualize.vector(pos, lookVector, color)
	 * @param cframe The CFrame to render.
	 * @param color An optional color.
	 */
	cframe(cframe: CFrame, color = this.config.color) {
		this.vector(cframe.Position, cframe.LookVector.mul(this.config.cframeLength), color);
	}
}

/**
 * A global visualizer instance for convenience.
 *
 * Disabling the global visualizer will disable all Visualizer instances.
 */
export const Visualize = new Visualizer();
