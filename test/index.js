// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */

const SummersCompiler = require('summers-compile');
const SummersICE = require('../bin/www');

const compiler = new SummersCompiler();
compiler.watch({}, (err, status)=> {
    SummersICE.start({ summersCompiler: compiler });
});
