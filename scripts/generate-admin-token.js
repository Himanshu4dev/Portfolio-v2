#!/usr/bin/env node
const { randomBytes } = require('crypto')
const token = randomBytes(24).toString('hex')
console.log(token)
