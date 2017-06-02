var b = require('./build.json');
var pkg = require('./package.json');
var path = require('path');
var _ = require('underscore');

var re_start_at = /^@+/, 
	re_start_slash = /^\/+/,
	re_end_slash = /\/$/,
	re_slash = /^\/+$/, 
	re_dot = /^\.$/,
	re_relative_path = /^(?:\.{1,2})?\/+/;

var extnames = [
	'.js', 
	'.css', '.less', '.scss', '.sass', 
	'.jpg', '.jpeg', '.png', '.gif', '.bmp',
	'.svg', '.swf', '.xap'
];

var buildConf = {
	"dir": {
		"test"		 : b.testDir,

		"src"        : b.srcDir,
		"srcFonts"   : joinPath(b.srcDir, "fonts"),
		"srcStyles"  : joinPath(b.srcDir, "styles"),
		"srcScripts" : joinPath(b.srcDir, "scripts"),
		"srcTmpls"    : joinPath(b.srcDir, "scripts/tmpls"),
		"srcCore"    : joinPath(b.srcDir, "scripts/core"),
		"srcModules" : joinPath(b.srcDir, "scripts/modules"),

		"destDoc"    : b.docDir,

		"dest"       : b.destDir,
		"destOrg"    : joinPath(b.destDir, b.orgDir),
		"destMin"    : joinPath(b.destDir, b.minDir),

		"destOrgCore"   : joinPath(b.destDir, b.orgDir, "yfjs-core.js"),
		"destMinCore"   : joinPath(b.destDir, b.minDir, "yfjs-core.js"),
		"destOrgFonts"   : joinPath(b.destDir, b.orgDir, "fonts"),
		"destMinFonts"   : joinPath(b.destDir, b.minDir, "fonts"),
		"destOrgModules" : joinPath(b.destDir, b.orgDir, "modules"),
		"destMinModules" : joinPath(b.destDir, b.minDir, "modules"),
		"destOrgStyles"  : joinPath(b.destDir, b.orgDir, "styles"),
		"destMinStyles"  : joinPath(b.destDir, b.minDir, "styles")
	},
  	"original" : b.orgDir,
  	"minified" : b.minDir,
	"version": pkg.version
};

var tmplConf = {};

// yfjs test tpl
tmplConf.yfjsTest = {};
tmplConf.yfjsTest[joinPath(buildConf.dir.test, "yfjs.js")] = joinPath(buildConf.dir.test, "yfjs.js.tmpl");

// yfjs tpl
tmplConf.yfjs = {};
tmplConf.yfjs[joinPath(buildConf.dir.srcScripts, "yfjs.js")] = joinPath(buildConf.dir.srcTmpls, "yfjs.js.tmpl");

// requireConf tpl
tmplConf.requireConf = {};
tmplConf.requireConf[joinPath(buildConf.dir.srcCore, "requireConf.js")] = joinPath(buildConf.dir.srcTmpls, "requireConf.js.tmpl");

tmplConf.building = JSON.stringify(buildConf);

buildConf.template = tmplConf;

var scripts = b.scripts || {};

var DirCopies, MdCopies;

// parse core
var buildingCore = parseCore(scripts.core);

// parse modules
var modulesConf = parseModules(scripts);

// parse modules require config
modulesConf.require.paths = parseModulePaths(modulesConf.require.paths);

tmplConf.require = JSON.stringify(modulesConf.require);

buildConf.require = modulesConf.require || {};

for (var id in buildConf.require) {
	try {
		buildConf.require[id] = JSON.stringify(buildConf.require[id]);
	} catch (e) {}
}

// parse modules building config
modulesConf.building.copy = parseBuildingCopies(modulesConf.building.copy);

// distinct modules building copy config
modulesConf.building.copy = distinctBuildingCopies(modulesConf.building.copy);

buildConf.building = modulesConf.building;

buildConf.building.copy.Fonts$Org = {
	expand: true,
    cwd: buildConf.dir.srcFonts,
    src: '**',
    dest: joinPath(buildConf.dir.destOrg, "fonts")
};

buildConf.building.copy.Fonts$Min = {
	expand: true,
    cwd: buildConf.dir.srcFonts,
    src: '**',
    dest: joinPath(buildConf.dir.destMin, "fonts")
};

buildConf.building.copy.ModulesOther$Min = {
    expand: true,
    cwd: buildConf.dir.destOrgModules,
    src: ['**', '!**/*.{css,js,html}'],
    dest: joinPath(buildConf.dir.destMin, "modules")
}

buildConf.building.copy.Docs = {
    expand: true,
    cwd: buildConf.dir.dest,
    src: ['**'],
    dest: buildConf.dir.destDoc
}

buildConf.building.concat.Core = {
	src: buildingCore.src,
	dest: buildingCore.dest
};

buildConf.building.concat.Base = {
	src: joinPath(buildConf.dir.srcStyles, "*.css"),
	dest: joinPath(buildConf.dir.destOrg, "styles/base.css")
};

function parseCore(coreMap) {
	coreMap = coreMap || {};
	var src = coreMap.src || [];
	if (_.isArray(src)) {
		_.each(src, function(val, i) {
			src[i] = joinPath(buildConf.dir.srcCore, val);
		});
	} else {
		src = joinPath(buildConf.dir.srcCore, src);
	}
	var destOrg = coreMap.dest,
		dest = joinPath(buildConf.dir.destOrg, destOrg);
	return {
		src: src,
		dest: dest,
		destOrg: destOrg
	};
}

/*
 * 解析规则
 * 0. 查找 modules 属性，其对应的值为模块配置项
 * 1. 配置项为数组时，则需要打包
 * 2. 配置项为对象时：
 *    2-0. 其下若存在 modules 属性，则返回第 0 步递归处理
 *    2-1. 配置项下对应的键名为模块的 ID，多层模块时，模块的 ID 以 "/" 间隔自动拼接
 * 3. 返回对象，含键 require 和 building，分别用于定义 requirejs 模块和编译处理
 */
function parseModules(mdMap, level) {
	mdMap = mdMap || {};
	level = level || 0;
	var rqConf = {}, building = {};
	var modules = mdMap.modules || {};
	if (modules != null) {
		var mdConf;
		var __id = mdMap.__id,
			__path = mdMap.__path,
			__version = mdMap.__version,
			__location = level == 0 ? buildConf.dir.srcModules : mdMap.__location;
		var _id, _pathSrc, _pathTo, _location;
		if (_.isArray(modules)) {
			// 模块打包
			var concats = [];
			for (var i=0; i<modules.length; i++) {
				mdConf = modules[i];
				if (__id == null) {
					_id = mdConf + '';
				} else {
					_id = __id + '/' + mdConf;
				}
				if (__path == null) {
					_pathTo = _pathSrc = _id;
				} else {
					_pathTo = _pathSrc = __path;
				}
				rqConf['paths'] = rqConf['paths'] || {};
				rqConf['paths'][_id] = _pathTo;
				if (__version != null) {
					// 记录版本
					rqConf['versions'] = rqConf['versions'] || {};
					rqConf['versions'][_id] = __version;
				}
				if (__id != null) {
					concats.push(
						normalizeFile(joinPath(__location, __version,  mdConf))
					);
				} 
			}
			// 文件合并
			if (concats.length) {
				building['concat'] = building['concat'] || {};
				building['concat'][_id] = {
					src: concats,
					dest: normalizeFile(joinPath(buildConf.dir.destOrgModules, __path))
				};
			}
		} else if (_.isObject(modules)) {
			// 模块解析
			for (var id in modules) {
				mdConf = modules[id];
				if (__id == null) {
					_id = id;
				} else {
					_id = __id + '/' + id;
				}
				if (mdConf == null) {
					// 只需要路径，无模块入口
					if (__path == null) {
						_pathTo = _pathSrc = __id;
					} else {
						_pathTo = _pathSrc = joinPath(__path, id);
					}
					rqConf['paths'] = rqConf['paths'] || {};
					rqConf['paths'][_id] = _pathTo;

					_location = joinPath(__location, __version);

					// TODO 复制路径下所有文件
					building['copy'] = building['copy'] || {};
					building['copy'][_id] = {
						expand: true,
						cwd: joinPath(_location, id),
						src: "**",
						dest: joinPath(buildConf.dir.destOrgModules, _pathTo)
					};
					DirCopies = DirCopies || {};
					DirCopies[_id] = building['copy'][_id];
				} else {
					if (mdConf.path == null) {
						_pathTo = _pathSrc = joinPath(__path, id);
						_location = joinPath(__location, id);
					} else {
						_pathSrc = joinPath(__path, mdConf.path);
						_pathTo = joinPath(__path, mdConf.pathTo == null ? id : mdConf.pathTo);
						_location = joinPath(__location, mdConf.path);
					}
					if (mdConf.main == null) {
						mdConf.main = id;
					}
					if (_.isUndefined(mdConf.version) && __version != null) {
						mdConf.version = __version;
					}
					if (mdConf.modules != null) {
						mdConf.__id = _id;
						if (_.isArray(mdConf.modules)) {
							mdConf.__path = joinPath(_pathSrc, mdConf.main);
						} else {
							mdConf.__path = _pathSrc;
						}
						mdConf.__version = mdConf.version == null ? __version : mdConf.version;
						mdConf.__location = _location;
						var _mdConf = parseModules(mdConf, level + 1);
						// 整合 requireConf
						rqConf['paths'] = _.extend({}, rqConf['paths'], _mdConf.require['paths']);
						rqConf['shim'] = _.extend({}, rqConf['shim'], _mdConf.require['shim']);
						if (_.isArray(_mdConf.require['packages'])) {
							rqConf['packages'] = rqConf['packages'] || [];
							rqConf['packages'] = rqConf['packages'].concat(_mdConf.require['packages']);
						}
						if (_mdConf.require['map']) {
							for (var key in _mdConf.require['map']) {
								rqConf['map'] = rqConf['map'] || {};
								rqConf['map'][key] = _.extend({}, rqConf['map'][key], _mdConf.require['map'][key]);
							}
						}
						rqConf['versions'] = _.extend({}, rqConf['versions'], _mdConf.require['versions']);
						// 整合 building
						building['concat'] = _.extend({}, building['concat'], _mdConf.building['concat']);
						building['copy'] = _.extend({}, building['copy'], _mdConf.building['copy']);
					}
					if (!_.isObject(mdConf)) {
						mdConf = { "version": mdConf, "main": id };
					} else {
						mdConf = _.extend({}, mdConf);
					}
					if (mdConf.version != null) {
						if (mdConf.package) {
							// 包形式模块
							rqConf['packages'] = rqConf['packages'] || [];
							rqConf['packages'].push({
								name: _id,
								location: _pathTo,
								main: mdConf.main
							});
						} else if (mdConf.map != null) {
							// map 形式模块
							rqConf['map'] = rqConf['map'] || {};
							var mapKey = mdConf.map + '';
							rqConf['map'][mapKey] = rqConf['map'][mapKey] || {};
							rqConf['map'][mapKey][_id] = joinPath(_pathTo, mdConf.main);
						} else {
							// paths 形式模块
							rqConf['paths'] = rqConf['paths'] || {};
							if (re_start_at.test(mdConf.main)) {
								rqConf['paths'][_id] = mdConf.main;
							} else {
								rqConf['paths'][_id] = joinPath(_pathTo, mdConf.main);
							}
						}
						if (mdConf.shim) {
							var moduleShim = parseModuleShim(mdConf, _pathTo, _id);
							rqConf['shim'] = rqConf['shim'] || {};
							if (!mdConf.package) {
								rqConf['shim'][_id] = moduleShim;
							} else {
								rqConf['shim'][joinPath(_id, mdConf.main)] = moduleShim;
							}
						}
						// 记录版本
						rqConf['versions'] = rqConf['versions'] || {};
						rqConf['versions'][_id] = mdConf.version;

						// 复制当前模块对应文件
						if (!_.isArray(mdConf.modules)) {
							building['copy'] = building['copy'] || {};
							if (re_start_at.test(mdConf.main)) {
								building['copy'][_id] = mdConf.main;
							} else {
								if (mdConf.package) {
									// 包形式模块复制目录下的所有文件
									building['copy'][_id] = {
										expand: true,
										cwd: joinPath(_location, mdConf.version),
										src: "**",
										dest: joinPath(buildConf.dir.destOrgModules, _pathTo)
									};
									DirCopies = DirCopies || {};
									DirCopies[_id] = building['copy'][_id];
								} else {
									building['copy'][_id] = {
										src: normalizeFile(joinPath(_location, mdConf.version, mdConf.main)),
										dest: mdConf.map != null 
											? normalizeFile(joinPath(buildConf.dir.destOrgModules, _pathTo, mdConf.main))
											: normalizeFile(joinPath(buildConf.dir.destOrgModules, rqConf['paths'][_id]))
									};
									MdCopies = MdCopies || {};
									MdCopies[_id] = building['copy'][_id];
									if (mdConf.shim || mdConf.deps) {
										var depsCopies = parseDepsBuildingCopies(
											mdConf,
											joinPath(_location, mdConf.version),
											joinPath(buildConf.dir.destOrgModules, _pathTo)
										);
										if (depsCopies) {
											building['copy'][_id+'$deps'] = depsCopies;
											MdCopies = MdCopies || {};
											MdCopies[_id+'$deps'] = building['copy'][_id+'$deps'] ;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	return {
		require: rqConf,
		building: building
	};
};

function parseModulePaths(mdPaths) {
	mdPaths = mdPaths || {};
	var mdPath, idSplits, idParent, idStart, idEnd;
	for (var id in mdPaths) {
		mdPath = mdPaths[id];
		if (re_start_at.test(mdPath)) {
			mdPath = mdPath.replace(re_start_at, "");
			idSplits = id.split('/');
			if (re_start_slash.test(mdPath)) {
				// @/
				mdPath = mdPath.replace(re_start_slash, "");
				mdPath = joinPath(mdPaths[idSplits[0]], mdPath.length ? '..' : '', mdPath);
			} else if (re_dot.test(mdPath)) {
				// @.
				mdPath = '';
				do {
					idEnd = idSplits.slice(-1).join('');
					idSplits = idSplits.slice(0, -1);
					idParent = idSplits.join('/');
					mdPath = joinPath(idEnd, mdPath);
					if (mdPaths[idParent] != null && !re_start_at.test(mdPaths[idParent])) {
						mdPath = joinPath(mdPaths[idParent], mdPath.length ? '..' : '', mdPath);
						break;
					}
				} while (
					idSplits.length > 0
				)
			} else {
				// @xxx
				idSplits = mdPath.split('/');
				idStart = idSplits[0];
				if (mdPaths[idStart] != null && !re_start_at.test(mdPaths[idStart])) {
					mdPath = idSplits.slice(1).join('/');
					mdPath = joinPath(mdPaths[idStart], mdPath.length ? '..' : '', mdPath);
				} else {
					idSplits = id.split('/');
					if (idSplits.length < 2) {
						mdPath = joinPath(idSplits[0], mdPath);
					} else {
						mdPath = joinPath(idSplits.slice(0, -1).join('/'), mdPath);
					}
				}
			}
			mdPaths[id] = mdPath;
		}
	}
	return mdPaths;
}

function parseModuleShim(mdConf, pathTo, id) {
	if (!mdConf || mdConf.shim == null) return [];
	var moduleShim;
	if (_.isArray(mdConf.shim.deps)) {
		moduleShim = _.extend({}, mdConf.shim);
		moduleShim.deps = parseModuleShim(mdConf.shim.deps, pathTo, id);
	} else {
		if (!_.isArray(mdConf.shim)) {
			moduleShim = [mdConf.shim];
		} else {
			moduleShim = [].concat(mdConf.shim);
		}
		var shim, cssPrefix = "rq/css!";
		for (var i=0; i<moduleShim.length; i++) {
			shim = moduleShim[i] + '';
			if (shim.indexOf(cssPrefix) == 0) {
				// dep css
				shim = shim.substring(cssPrefix.length);
				shim = cssPrefix + joinPath(pathTo, shim);
			} else if (re_start_at.test(shim)) {
				// dep module
				shim = shim.replace(re_start_at, "");
				if (re_relative_path.test(shim)) {
					shim = joinPath(id, shim);
				}
				shim = '@' + shim;
			}
			moduleShim[i] = shim;
		}
	}
	return moduleShim;
}

function parseBuildingCopies(bCopies) {
	bCopies = bCopies || {};
	var bCopy, idSplits, idParent, bCopyParent, i, j;
	var distinctCopies = {}, distinctKey;
	for (var id in bCopies) {
		bCopy = bCopies[id];
		if (re_start_at.test(bCopy)) {
			bCopy = bCopy.replace(re_start_at, "");
			idSplits = id.split('/');
			if (re_start_slash.test(bCopy)) {
				// @/
				if (re_slash.test(bCopy)) {
					bCopy = idSplits[0];
				} else {
					bCopy = bCopy.replace(re_start_slash, idSplits[0] + '/');
				}
			} else if (re_dot.test(bCopy)) {
				// @.
				bCopy = id;
			}
			i = 1;
			idSplits = bCopy.split('/');
			do {
				idParent = idSplits.slice(0, i).join('/');
				bCopyParent = bCopies[idParent];
				if (bCopyParent != null && _.isObject(bCopyParent)) {
					if (i == idSplits.length) {
						bCopy = null;
					} else {
						bCopy = {};
						if (_.isArray(bCopyParent.src)) {
							bCopy.src = [];
							for (j=0; j<bCopyParent.src[j]; j++) {
								bCopy.src[j] = normalizeFile(
									joinPath(bCopyParent.src[j], '..', idSplits.slice(i).join('/'))
								);
							}
						} else {
							bCopy.src = normalizeFile(
								joinPath(bCopyParent.src, '..', idSplits.slice(i).join('/'))
							);
						}
						if (_.isArray(bCopyParent.dest)) {
							bCopy.dest = [];
							for (j=0; j<bCopyParent.dest[j]; j++) {
								bCopy.dest[j] = normalizeFile(
									joinPath(bCopyParent.dest[j], '..', idSplits.slice(i).join('/'))
								);
							}
						} else {
							bCopy.dest = normalizeFile(
								joinPath(bCopyParent.dest, '..', idSplits.slice(i).join('/'))
							);
						}
					}
					break;
				}
				i++;
			} while (
				i <= idSplits.length
			)
			if (bCopy == null) {
				delete bCopies[id];
			} else {
				if (_.isObject(bCopy)) {
					distinctKey = JSON.stringify(bCopy);
				} else {
					distinctKey = bCopy;
				}
				if (distinctCopies[distinctKey]) {
					delete bCopies[id];
				} else {
					distinctCopies[distinctKey] = true;
					bCopies[id] = bCopy;
				}
			}
		}
	}
	return bCopies;
}

function parseDepsBuildingCopies(mdConf, location, pathTo) {
	if (!mdConf || (!mdConf.shim && !mdConf.deps)) return null;

	location = location == null ? '' : location + '';

	var depsCopies;

	if (mdConf.shim) {
		if (_.isArray(mdConf.shim.deps)) {
			parseCopies(mdConf.shim.deps, true);
		} else {
			parseCopies(mdConf.shim, true);
		}
	}

	if (mdConf.deps) {
		parseCopies(mdConf.deps);
	}

	function parseCopies(deps, isShim) {
		if (!_.isArray(deps)) {
			deps = [deps];
		}
		var dep, cssPrefix = "rq/css!";
		for (var i=0; i<deps.length; i++) {
			dep = deps[i] + '';
			if (isShim) {
				if (dep.indexOf(cssPrefix) == 0) {
					dep = normalizeFile(dep);
					dep = dep.substring(cssPrefix.length);
					appendToCopies(dep);
				}
			} else {
				dep = normalizeFile(dep);
				if (dep.indexOf(cssPrefix) == 0) {
					dep = dep.substring(cssPrefix.length);
				}
				appendToCopies(dep);
			}
		}
	}
	function appendToCopies(dep) {
		depsCopies = depsCopies || {};
		if (depsCopies.src != null) {
			depsCopies.expand = true;
			depsCopies.cwd = location;
			if (!_.isArray(depsCopies.src)) {
				depsCopies.src = [depsCopies.src];
			}
			var src, locationPath;
			if (re_end_slash.test(location)) {
				locationPath = location;
			} else {
				locationPath = location + '/';
			}
			for (var i=0; i<depsCopies.src.length; i++) {
				src = depsCopies.src[i] + '';
				if (src.indexOf(locationPath) == 0) {
					src = src.substring(locationPath.length);
					depsCopies.src[i] = src;
				}
			}
			if (_.indexOf(dep, depsCopies.src) == -1) {
				depsCopies.src.push(dep);
			}
			depsCopies.dest = pathTo;
		} else {
			depsCopies.src = joinPath(location, dep);
			depsCopies.dest = joinPath(pathTo, dep);
		}
	}
	return depsCopies;
}

function distinctBuildingCopies(buildingCopies) {
	buildingCopies = buildingCopies || {};
	if (DirCopies && MdCopies) {
		var dirCopy, copyAllDir,
			mdCopy, copySrc, inDir;
		for (var dirCopyKey in DirCopies) {
			dirCopy = DirCopies[dirCopyKey];
			copyAllDir = dirCopy.cwd != null ? dirCopy.cwd : dirCopy.src;
			if (copyAllDir != null) {
				if (!re_end_slash.test(copyAllDir)) {
					copyAllDir += '/';
				} else {
					copyAllDir += '';
				}
				for (var mdCopyKey in MdCopies) {
					mdCopy = MdCopies[mdCopyKey];
					if (mdCopy.src != null) {
						inDir = false;
						if (_.isArray(mdCopy.src)) {
							for (var i=0; i<mdCopy.src; i++) {
								copySrc = mdCopy.src[i] + '';
								if (inDir = (copySrc.indexOf(copyAllDir) == 0)) {
									break;
								}
							}
						} else {
							copySrc = mdCopy.src + '';
							inDir = copySrc.indexOf(copyAllDir) == 0;
						}
						if (inDir) {
							dirCopy = buildingCopies[dirCopyKey];
							if (dirCopy && dirCopy.src != null) {
								if (!_.isArray(dirCopy.src)) {
									dirCopy.src = [dirCopy.src];
								}
								dirCopy.src.push('!'+copySrc.substring(copyAllDir.length));
								buildingCopies[dirCopyKey] = dirCopy;
							}
						}
					}
				}
			}
		}
	}
	return buildingCopies;
}

function joinPath () {
	var args = Array.prototype.slice.call(arguments), arg;
	for (var i=0; i<args.length; i++) {
		args[i] == null && (args[i] = "");
	}
	var _path = path.join.apply(path, args);
	return _path.replace(/\\+/g, "/");
}

function normalizeFile(filename) {
	filename = filename == null ? '' : filename + '';
	var extname = path.extname(filename);
	var re_start_rq_css = /^rq\/css!/,
		re_end_wildcard_path = /\/\*\*?$/;
	if (!re_end_wildcard_path.test(filename) && (!extname || _.indexOf(extnames, extname) < 0)) {
		if (re_start_rq_css.test(filename)) {
			filename += ".css";
		} else {
			filename += ".js";
		}
	}
	return filename;
}

module.exports = buildConf;