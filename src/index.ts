import { existsSync, readdirSync, statSync } from "node:fs";
import path, { basename, extname, join } from "node:path";
import { TOML } from "bun";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

export class Envig<T extends object> {
	constructor(
		public readonly data: T,
		readonly vars = process.env,
	) {
		this.expandEnvVars(this.data);
	}

	private expandEnvVars(obj: unknown): unknown {
		if (typeof obj === "string") {
			return this.expandString(obj);
		}

		if (Array.isArray(obj)) {
			return obj.map((item) => this.expandEnvVars(item));
		}

		if (typeof obj === "object" && obj !== null) {
			for (const [key, value] of Object.entries(obj)) {
				obj[key] = this.expandEnvVars(value);
			}
		}

		return obj;
	}

	private expandString(value: string): string {
		let result = value;
		for (const [k, v] of Object.entries(this.vars)) {
			if (v !== undefined) {
				result = result.replace(`$${k}`, v).replace(`\${${k}}`, v);
			}
		}
		return result;
	}

	get(path: string): unknown {
		return path.split(".").reduce((acc, key) => acc?.[key], this.data);
	}
}

export namespace Envig {
	export async function loadText(text: string) {
		return new Envig(await parseText(text));
	}

	export async function loadFile(path: string) {
		return new Envig(await parseFile(path));
	}

	export async function loadDir(dir: string) {
		return new Envig(await parseDir(dir));
	}

	export async function load(pathOrText: string) {
		try {
			const check = path.resolve(process.cwd(), pathOrText);
			if (existsSync(check)) {
				const stats = statSync(check);
				if (stats.isDirectory()) return loadDir(check);
				if (stats.isFile()) return loadFile(check);
			}

			return loadText(pathOrText);
		} catch (e) {
			throw new Error(`Invalid path or not supported ${pathOrText}: ${e}`);
		}
	}

	export async function parseText(txt: string) {
		return TOML.parse(txt);
	}

	export async function parseFile(path: string) {
		return parseText(await Bun.file(path).text());
	}

	export async function parseDir(dir: string) {
		const entries = readdirSync(dir);
		const mergedData: object = {};

		for (const entry of entries) {
			const entryPath = join(dir, entry);
			const stats = statSync(entryPath);

			if (stats.isFile() && extname(entry) === ".toml") {
				const name = basename(entry, ".toml");
				mergedData[name] = await parseFile(entryPath);
			} else if (stats.isDirectory()) {
				mergedData[basename(entryPath)] = await parseDir(entryPath);
			}
		}

		return mergedData;
	}
}

export async function envig(path: string) {
	return Envig.load(path);
}

const _envig = Bun.peek(envig("config")) as Envig<object>;

export default _envig;
