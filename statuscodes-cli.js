#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const Table = require('cli-table');
const { StatusCode, statusClass, statusText, statusDesc } = require('./statuscodes');
const ack = chalk.greenBright(`Made with ❤ by Param Siddharth.`);

if (require && require.main === module) {
	var args = process.argv;
	args = yargs(hideBin(args));
	args = args
		.usage(`\
${chalk.yellowBright('HTTP Status Codes (statuscodes)')}
Gives details about HTTP status codes/messages.

Usage: statuscodes <value> [options]`)
		.check((argv, options) => {
			if (!argv.help && !argv.version && !argv.list && argv._.length < 1)
				throw 'Not enough non-option arguments: got 0, need at least 1';
			else
				return true;
		})
		.option('l', {
			alias: 'list',
			describe: 'Show all status codes',
			default: false,
			help: true,
			boolean: true
		})
		.example('statuscodes 200', `Gives information about status code 200.`)
		.example('statuscodes Ok', `Gives information about the HTTP status with message OK.`)
		.example('statuscodes not found', `Gives information about the HTTP status with message 'Not Found'.`)
		.alias('v', 'version')
		.alias('?', 'help')
		.help('?')
		.recommendCommands()
		.showHelpOnFail(true)
		.epilog(ack)
		.argv;
	
	if (args.list) {
		const table = new Table({
			head: ['Code', 'Message'].map(m => chalk.yellowBright(m)),
			colors: 'yellow'
		});
		for (const code in statusText) {
			table.push([
				chalk.greenBright(code),
				chalk.white(statusDesc[code])
			]);
		}
		console.log(table.toString());
		process.exit(0);
	}
	let value = args._[0];
	if (args._.length > 1)
		value = args._.join(' ');
	let status = null;
	try {
		status = new StatusCode(value);
	} catch(e) {
		process.stderr.write(`${chalk.redBright(e.message)}\n`);
		process.exit(1);
	}
	process.stdout.write(`\
Status Code: ${chalk.greenBright(status.Code)}
Textual Identifier: ${chalk.yellow(status.Text)}
Message: ${chalk.cyan(status.Desc)}
Class: ${chalk.yellow(Object.keys(statusClass).filter(k => statusClass[k] === status.Class)[0])}
`);
}
