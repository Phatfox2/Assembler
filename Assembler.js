const fs = require('fs');  //make filestream constant
var filename = 'projects/06/Assembler/pong/Pong.asm' //input file name
writeFD = fs.openSync('projects/06/Assembler/Output/test.hack', 'w+'); //writeStream or writeopenSync with output file, (test.hack);
var linenumber = 0;  //line counter
var startvar = 16;
var symbolArray = new Array();  //Symbol Array with already built in symbols:
symbolArray['R0'] = 0;
symbolArray['R1'] = 1;
symbolArray['R2'] = 2;
symbolArray['R3'] = 3;
symbolArray['R4'] = 4;
symbolArray['R5'] = 5;
symbolArray['R6'] = 6;
symbolArray['R7'] = 7;
symbolArray['R8'] = 8;
symbolArray['R9'] = 9;
symbolArray['R10'] = 10;
symbolArray['R11'] = 11;
symbolArray['R12'] = 12;
symbolArray['R13'] = 13;
symbolArray['R14'] = 14;
symbolArray['R15'] = 15;
symbolArray['SCREEN'] = 16384;
symbolArray['KBD'] = 24576;
symbolArray['SP'] = 0;
symbolArray['LCL'] = 1;
symbolArray['ARG'] = 2;
symbolArray['THIS'] = 3;
symbolArray['THAT'] = 4;
function writeBuf(writeFD, instr) {  //writeBuf function to convert string to binary, add zeroes if neccessary, and then write to output file
    var inBinary = instr.toString(2);
    var Zeroesneeded = 16 - inBinary.length;
    var inBinarystring = '0';
    var fullstring;
    if (Zeroesneeded > 0) {
        while (Zeroesneeded != inBinarystring.length) {
            inBinarystring = inBinarystring.concat('0');
        }
        fullstring = inBinarystring.concat(inBinary);
    }
    else {
        fullstring = inBinary;
    }
    fs.writeSync(writeFD, fullstring); 
    fs.writeSync(writeFD, '\r\n');
    return;
}

var lines = fs.readFileSync(filename, 'utf-8').split('\n'); //take filename: filetype: 'utf8' and split new line
//essentially now lines is a huge array with all the lines in the program

for (var i in lines) {  //var i = line number, but counts comments, so we build our own line counter var
    var input = lines[i]; // input = Array of all asm code, and the corresponding line, so input is essentially the input
    input = input.trim(); 
    if (input.indexOf('/') == 0 || input.length == 0) { //ignore comments and empty lines
        continue;
    }
    if (input[0] == '(') {  //if label: remove parentheses from both sides, then return label with linecounter.
        var loop = input;
        var loop = loop.replace('(', '');
        var loop = loop.replace(')', '');
        var loopvalue = linenumber;
        symbolArray[loop] = loopvalue;

    
    } else {
        linenumber = linenumber + 1; // if not a label, comment, or empty line, increment line counter
    }
};
for (var i in lines) {  //2nd time: all labels have been added to Symbol Array now
    var input = lines[i]; //same as before
    input = input.trim();
    if (input.indexOf('/') == 0 || input.length == 0 || input.indexOf('(') == 0) { //this time also ignore labels, they've already been added into symbol array
        continue;
    }
    if (input.includes('/')) {
        while (input.includes('/')) {
            input = input.slice(0, -1);
        }
    }
    if (input.includes(' ')) {
        while (input.includes(' ')) {
            input = input.replace(' ', '');
        }
    }
        if (input[0] == '@') { //A instruction:
            var Ainstructionnumber = input.substring(1); //whatever is after @, not counting @
            var isitnumber = parseInt(Ainstructionnumber);
            var isitnumber = Number.isInteger(isitnumber);
            if (isitnumber == true) {  //simple A instruction, e.g. (@73)
                var instruction = parseInt(Ainstructionnumber);
                writeBuf(writeFD, instruction);
            
            } else { //built in symbol, variable, or label
                var builtinsymbols = symbolArray[Ainstructionnumber]; //look up symbol in array
                if (builtinsymbols != null) {  //will proceed to write if symbol or builtin because both will already be in array
                    writeBuf(writeFD, builtinsymbols);
                
                } else { //variable
                    symbolArray[Ainstructionnumber] = startvar; 
                    writeBuf(writeFD, startvar);
                    startvar = startvar + 1;  //startvar gets incremented for next time there is a var
                    
                }
                
            }
        } else { //C instruction
        
        var instruction = '111';  //all C instructions begin with 111, just common syntax
        var inputVar = input;  //backup of input
        var newInput = input;  //backup of input
        if (inputVar.includes(';')) {  //has jump bits
            while (inputVar.includes(';')) {  
                var inputVar = inputVar.substring(1);
            }
                var jmp = inputVar;
                while (newInput.includes(';')) {
                    var newInput = newInput.slice(0, -1)
                }
                var comp = newInput;
                if (jmp == 'JGT') {
                    var jumpbits = '001';
                }
                if (jmp == 'JEQ') {
                    var jumpbits = '010';
                }
                if (jmp == 'JGE') {
                    var jumpbits = '011';
                }
                if (jmp == 'JLT') {
                    var jumpbits = '100';
                }
                if (jmp == 'JNE') {
                    var jumpbits = '101';
                }
                if (jmp == 'JLE') {
                    var jumpbits = '110';
                }
                if (jmp == 'JMP') {
                    var jumpbits = '111';
                }
                
            
            } else {
                var jumpbits = '000';
            }
            var inputVar = input;  //remake backups in case jump bits 
            var newInput = input;
            if (inputVar.includes('=')) {
                while (inputVar.includes('=')) {  
                    var inputVar = inputVar.slice(0, -1); 
                }
            var dest = inputVar;
            } else {
                var dest = '';
            }
            if (newInput.includes('=')) {
                while (newInput.includes('=')) {
                    var newInput = newInput.substring(1);
                }
            var comp = newInput;
            if (input.includes('=') && input.includes(';')) {
                while (comp.includes(';')) {
                    var comp = comp.slice(0, -1);
                }
            }
            }
                if (dest == '') {
                    var destBits = '000';
                }
                if (dest == 'M') {
                    var destBits = '001';
                }
                if (dest == 'D') {
                    var destBits = '010';
                }
                if (dest == 'MD') {
                    var destBits = '011';
                }
                if (dest == 'A') {
                    var destBits = '100';
                }
                if (dest == 'AM') {
                    var destBits = '101';
                }
                if (dest == 'AD') {
                    var destBits = '110';
                }
                if (dest == 'AMD') {
                    var destBits = '111';
                }
                var aone = ['0', '1', '-1', 'D', 'A', '!D', '!A', '-D', '-A', 'D+1', 'A+1', 'D-1', 'A-1',
            'D+A', 'D-A', 'A-D', 'D&A', 'D|A'];
                if (aone.includes(comp)) {
                    var compbits = '0';
                } else {
                    var compbits = '1';
                }
                if (comp == '0') {
                    compbits = compbits.concat('101010');
                }
                if (comp == '1') {
                    compbits = compbits.concat('111111');
                }
                if (comp == '-1') {
                    compbits = compbits.concat('111010');
                }
                if (comp == 'D') {
                    compbits = compbits.concat('001100');
                }
                if (comp == 'A' || comp == 'M') {
                    compbits = compbits.concat('110000');
                }
                if (comp == '!D') {
                    var compbits = compbits.concat('001101');
                }
                if (comp == '!A' || comp == '!M') {
                    var compbits = compbits.concat('110001');
                }
                if (comp == '-D') {
                    var compbits = compbits.concat('001111');
                }
                if (comp == '-A' || comp == '-M') {
                    var compbits = compbits.concat('110011');
                }
                if (comp == 'D+1') {
                    var compbits = compbits.concat('011111');
                }
                if (comp == 'A+1' || comp == 'M+1') {
                    var compbits = compbits.concat('110111');
                }
                if (comp == 'D-1') {
                    var compbits = compbits.concat('001110');
                }
                if (comp == 'A-1' || comp == 'M-1') {
                    var compbits = compbits.concat('110010');
                }
                if (comp == 'D+A' || comp == 'D+M') {
                    var compbits = compbits.concat('000010');
                }
                if (comp == 'D-A' || comp == 'D-M') {
                    var compbits = compbits.concat('010011');
                }
                if (comp == 'A-D' || comp == 'M-D') {
                    var compbits = compbits.concat('000111');
                }
                if (comp == 'D&A' || comp == 'D&M') {
                    var compbits = compbits.concat('000000');
                }
                if (comp == 'D|A' || comp == 'D|M') {
                    var compbits = compbits.concat('010101');
                }
            var returnValue = instruction.concat(compbits, destBits, jumpbits);
            var parsed = parseInt(returnValue, 2);
            writeBuf(writeFD, parsed);


           
            
                
        
        
        
        }
    }