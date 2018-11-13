// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */

const summserICE = require('../bin/www');
const SummersCompiler = require('summers-compile');

const compiler = new SummersCompiler();
compiler.watch();

summserICE.start({ summersCompiler: compiler });

