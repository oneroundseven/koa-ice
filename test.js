// Copyright 2018 FOCUS Inc.All Rights Reserved.

let ss = require('./bin/www');
const SummersCompiler = require("summers-compile");
const summersCompiler = new SummersCompiler();

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */
//summersCompiler.watch();
ss.start(summersCompiler);