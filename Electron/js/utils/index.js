"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2022 Beijing Volcano Engine Technology Ltd.
 * SPDX-License-Identifier: MIT
 */
const os_1 = __importDefault(require("os"));
//错误反馈函数
function errorFeedback(funcName) {
    console.error(`In ${funcName}:  params is not right, please check!:  参数错误，请检查`);
    return -1;
}
exports.errorFeedback = errorFeedback;
//参数判定传递函数
function isNull(param) {
    return param === undefined || param === null;
}
exports.isNull = isNull;
function checkType(value, name, type, maybe_null) {
    if ((!maybe_null) && isNull(value)) {
        throw new Error(`${name} cannot be empty`);
    }
    if ((!isNull(value)) && (typeof value !== type)) {
        throw new Error(`Invalid ${name}: the value should be ${type} type.`);
    }
}
exports.checkType = checkType;
function checkStringType(value, name, maybe_null = false) {
    checkType(value, name, 'string', maybe_null);
}
exports.checkStringType = checkStringType;
function checkNumberType(value, name, maybe_null = false) {
    checkType(value, name, 'number', maybe_null);
}
exports.checkNumberType = checkNumberType;
function checkBooleanType(value, name, maybe_null = false) {
    checkType(value, name, 'boolean', maybe_null);
}
exports.checkBooleanType = checkBooleanType;
//macos 与 os.release()之间的版本映射关系
const versionMap = new Map([
    [21, ["Monterey", "12"]],
    [20, ["Big Sur", "11"]],
    [19, ["Catalina", "10.15"]],
    [18, ["Mojave", "10.14"]],
    [17, ["High Sierra", "10.13"]],
    [16, ["Sierra", "10.12"]],
    [15, ["El Capitan", "10.11"]],
    [14, ["Yosemite", "10.10"]],
    [13, ["Mavericks", "10.9"]],
    [12, ["Mountain Lion", "10.8"]],
    [11, ["Lion", "10.7"]],
    [10, ["Snow Leopard", "10.6"]],
    [9, ["Leopard", "10.5"]],
    [8, ["Tiger", "10.4"]],
    [7, ["Panther", "10.3"]],
    [6, ["Jaguar", "10.2"]],
    [5, ["Puma", "10.1"]],
]);
//获取macos 真正版本
exports.getMacVersion = () => {
    const macRelease = os_1.default.release();
    const firstReleaseVersion = Number(macRelease.split(".")[0]);
    const [name, version] = versionMap.get(firstReleaseVersion) || [
        "Unknown",
        "",
    ];
    return version;
};
//# sourceMappingURL=index.js.map