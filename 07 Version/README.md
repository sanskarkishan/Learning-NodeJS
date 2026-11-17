# Version Numbers in Node.js Projects

## What does `1.2.3` mean?

Many npm packages use **Semantic Versioning**, usually written as `MAJOR.MINOR.PATCH`:

```text
1.2.3
| | |
| | +-- PATCH: backward-compatible bug fixes
| +---- MINOR: backward-compatible features
+------ MAJOR: breaking changes
```

For example, a library could move from `1.2.3` to `1.2.4` to fix a bug, or to `1.3.0` to add a feature without breaking its documented API. A change to `2.0.0` signals that users may need to change their code. These are compatibility expectations, not a guarantee that every package follows the rules perfectly.

The dots separate the three numeric parts; they are not decimal points. Version comparison is by part, so `1.10.0` is newer than `1.9.0`.

Versions can also include a **pre-release** label, such as `2.0.0-beta.1`. Pre-release versions are intended for testing and are generally considered earlier than the final `2.0.0` release.

## What do `^` and `~` mean?

In `package.json`, `^` and `~` are version-range operators. They tell npm which newer versions it may choose when resolving a dependency.

| Range | Example allowed versions | Meaning |
| --- | --- | --- |
| `^1.2.3` | `1.2.3`, `1.2.4`, `1.9.0` | Allow compatible updates that do not change the major version; stop before `2.0.0`. |
| `~1.2.3` | `1.2.3`, `1.2.4`, `1.2.99` | Allow patch updates in the same minor version; stop before `1.3.0`. |
| `1.2.3` | `1.2.3` | Request that exact version. |

For example, if `package.json` contains:

```json
{
	"dependencies": {
		"express": "^5.1.0",
		"some-package": "~2.4.3"
	}
}
```

npm may select an Express `5.x` release at or above `5.1.0`, but not `6.0.0`. For `some-package`, it may select `2.4.3` or a newer `2.4.x` patch, but not `2.5.0`.

### Important: caret ranges and `0.x` versions

Before a package reaches `1.0.0`, its API may change more freely. Caret ranges are therefore narrower when the major version is zero:

- `^0.2.3` allows versions from `0.2.3` up to, but not including, `0.3.0`.
- `^0.0.3` allows versions from `0.0.3` up to, but not including, `0.0.4`.

As a rule, `^` allows updates that keep the leftmost non-zero version part unchanged. `~` is more restrictive: it allows patch-level updates within the specified minor version.

## Choosing a dependency version yourself

Add `@` and a version or range to a package name to choose what npm installs:

```sh
npm install express@5.1.0
npm install "express@~5.1.0"
npm install express@5.1.0 --save-exact
```

The first command installs `5.1.0`. By default, npm usually records it in `package.json` as `^5.1.0`, so later installs may use a compatible `5.x` version. The second explicitly requests the `~5.1.0` range, allowing patch updates but not `5.2.0`. The third saves exactly `5.1.0`, without a range operator. The lockfile records the resolved version for reproducible installs.

You can also edit the dependency entry in `package.json` to set a range such as `"express": "^5.1.0"` or `"express": "5.1.0"`, then run `npm install` to update the lockfile and installed packages.

## `package.json` and the lockfile

- **`package.json`** describes your project and its dependency ranges, along with scripts and other metadata.
- **`package-lock.json`** records the resolved dependency versions (including transitive dependencies) so installs can be reproduced more consistently.
- **`node_modules/`** contains the installed packages and is normally not committed to Git.

Use `npm install <package>` to add a dependency; npm updates `package.json` and the lockfile. Commit both files to your project so teammates and build systems share the dependency requirements and resolution.

For a reproducible install from the lockfile, CI systems commonly use:

```sh
npm ci
```

`npm ci` installs the versions recorded in the lockfile and fails if the lockfile and `package.json` disagree. Do not edit the lockfile by hand; use npm commands to update dependencies.

## Which range should I use?

- Use `^` when you want normal compatible minor and patch updates for a package that follows semantic versioning.
- Use `~` when you want to receive patch fixes but avoid minor-version changes.
- Use an exact version when you specifically need to prevent npm from selecting a different version from the declared range.
- Avoid `*` (any version) for important dependencies because it gives very little control over which version may be installed.

Even when ranges are present, the lockfile controls the exact resolved versions for a normal locked install. Review dependency updates and run your tests before deploying them.