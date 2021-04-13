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
	};

	function createHandleAdornment<T extends HandleAdornments>(className: T) {
		const instance = new Instance(className);
		instance.Transparency = config.transparency;
		instance.AlwaysOnTop = config.alwaysOnTop;
		instance.Color3 = config.color;
		instance.Visible = true;
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

	export function configure(newConfig: Partial<ConfigureSettings>) {
		Object.assign(config, newConfig);
	}

	const vectors = createSwappable<ConeHandleAdornment>();
	export function vector(origin: Vector3, direction: Vector3, color = config.color) {
		if (!config.enabled) return;

		let adornment = pop(vectors);
		if (!adornment) {
			adornment = createHandleAdornment("ConeHandleAdornment");
			adornment.Height = math.max(direction.Magnitude, 1);
			adornment.Radius = config.vectorRadius;
		}

		adornment.CFrame = CFrame.lookAt(origin, origin.add(direction));
		adornment.Color3 = color;

		vectors.used.push(adornment);
	}

	const points = createSwappable<SphereHandleAdornment>();
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

	const lines = createSwappable<CylinderHandleAdornment>();
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
