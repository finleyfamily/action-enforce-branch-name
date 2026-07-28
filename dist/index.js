require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 730:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = run;
const core = __importStar(__nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const github_1 = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/github'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const styleBold = '\u001b[1m';
const styleReset = '\u001b[0m';
const validEvent = [
    'create',
    'push',
    'pull_request',
    'pull_request_target'
];
/**
 * Error raised when the event that triggered the action `create` but the ref type
 * is not a branch.
 *
 * @class CreateNotBranchError
 * @extends {Error}
 */
class CreateNotBranchError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = 'CreateNotBranchError';
    }
}
/**
 * Error raised when something is not implemented.
 *
 * @class NotImplementedError
 * @extends {Error}
 */
class NotImplementedError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = 'NotImplementedError';
    }
}
/**
 * Get the branch name.
 *
 * @returns {string} Name of the branch.
 */
function getBranchName(ctx) {
    switch (ctx.eventName) {
        case 'create':
            if (ctx.payload.ref_type !== 'branch') {
                throw new CreateNotBranchError(`ref_type must be "branch" but got ${ctx.payload.ref_type}`);
            }
            return ctx.ref.replace('refs/heads/', '');
        case 'pull_request_target':
        case 'pull_request': {
            const payload = ctx.payload;
            return payload.pull_request.head.ref;
        }
        case 'push':
            return ctx.ref.replace('refs/heads/', '');
        default:
            throw new NotImplementedError(`Invalid event name: ${ctx.eventName}`);
    }
}
/**
 * The main function for the action.
 *
 * @export
 * @return {Promise<void>}
 */
async function run() {
    const allowedPrefixesInput = core.getInput('allowed_prefixes');
    const excludeInput = core.getInput('exclude');
    const regexInput = core.getInput('regex');
    const allowedPrefixList = allowedPrefixesInput
        .split(',')
        .map((item) => item.trim());
    const excludeList = excludeInput
        .split(',')
        .map((item) => item.trim());
    const regexPattern = RegExp(regexInput);
    core.info(`${styleBold}Allowed Prefixes:${styleReset} ${allowedPrefixList.join(', ')}`);
    core.info(`${styleBold}Exclude list:${styleReset} ${excludeList.join(', ')}`);
    core.info(`${styleBold}Regex:${styleReset} ${regexInput}`);
    try {
        core.info(`${styleBold}Event name:${styleReset} ${github_1.context.eventName}`);
        if (!validEvent.includes(github_1.context.eventName)) {
            core.setFailed(`Invalid event: ${github_1.context.eventName}`);
            return;
        }
        const branchName = getBranchName(github_1.context);
        core.info(`${styleBold}Branch name:${styleReset} ${branchName}`);
        // check against exclude list
        if (excludeList.length > 0 &&
            excludeList.some((el) => branchName === el)) {
            core.info(`${branchName} is in the exclude list: ${excludeList.join(', ')}`);
            return;
        }
        // check against regex
        if (!regexPattern.test(branchName)) {
            core.setFailed(`${branchName} does not match regex: ${regexPattern}`);
            return;
        }
        // check against allowed prefixes
        if (allowedPrefixList.length > 0 &&
            !allowedPrefixList.some((el) => branchName.startsWith(el))) {
            core.setFailed(`${branchName} does not start with an allowed prefix: ${allowedPrefixList.join(', ')}`);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        if (error instanceof CreateNotBranchError) {
            core.info(`${github_1.context.eventName} event with ref_type ${github_1.context.payload.ref_type} isn't a branch`);
            return;
        }
        let message = 'Unknown Error';
        if (error instanceof Error)
            message = error.message;
        core.setFailed(message);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The entrypoint for the action.
 */
const main_1 = __nccwpck_require__(730);
(0, main_1.run)();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map