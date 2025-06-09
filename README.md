# 🌟 [@siguici/envig](npm.im/@siguici/envig) – Unified Configuration and Environment Manager for Bun/TypeScript

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.md)
[![Bun](https://img.shields.io/badge/bun-%3E=1.0-blue?logo=bun)](https://bun.sh)

**Envig** is a lightweight and flexible configuration
and environment manager for **TypeScript**,
designed to work seamlessly with **Bun**.  
It unifies configuration loading from `.env` files and JSON/TOML files,
and supports dynamic variable expansion.

---

## 🚀 Features

✅ Load configuration from JSON or TOML files dynamically  
✅ Support for environment variables via `.env` files  
✅ Dynamic variable expansion (`${VAR_NAME}` style)  
✅ Load from directories, single files, or raw text  
✅ Fallback and default values for missing keys  
✅ Type-safe retrieval with automatic conversion  
✅ Lightweight and fast, built specifically for Bun

---

## 📦 Installation

With **Bun**:

```bash
bun add @siguici/envig
````

Or clone the repository:

```bash
git clone https://github.com/siguici/envig-ts.git envig
cd envig
bun install
```

---

## ⚙️ Usage

Envig provides a powerful unified interface combining environment and configuration:

### 🔹 From a Single File

```ts
import { envig } from "@siguici/envig";

const config = await envig("config.toml");
console.log(config.get("database.host"));
```

### 🔹 From a Directory

```ts
const config = await envig("config");
console.log(config.get("app.debug"));
```

### 🔹 From Raw Text

```ts
const toml = `
  host = "localhost"
  port = 5432
`;
const config = await envig(toml);
console.log(config.get("database.port"));
```

---

## 🏗️ Roadmap

* [ ] Support for YAML configuration formats
* [ ] CLI tool for managing environment variables
* [ ] Integration with popular logging tools
* [ ] Node.js compatibility (future)

---

## 🤝 Contributing

Feel free to submit issues, ideas, or pull requests!
Let’s build something great together.

---

## 📜 License

Envig is released under the **MIT License**.

---

## ⭐ Show Your Support

If you like **Envig**, give it a *⭐* on [GitHub](https://github.com/siguici/envig-ts)!

---

Enjoy seamless configuration management with **Envig**! 🚀
