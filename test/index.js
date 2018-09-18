// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */

const summersCompiler = require('summers-compile');
const summserICE = require('../bin/www');

const compile = new summersCompiler();
compile.watch();

summserICE.start({
    summersCompiler: compile
});