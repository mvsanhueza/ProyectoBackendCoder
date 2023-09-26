import { program } from 'commander';

program.option('-m, --mode <mode>', 'ambiente a trabajar', 'dev')
    .parse(process.argv);

export default program;