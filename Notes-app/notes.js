const fs = require('fs')
const chalk = require('chalk')


const addNote = function(title, body) {
    const notes = loadNotes()
    const duplicateNotes = notes.filter(function(note) {
        return note.title === title
    })
    

    if (duplicateNotes.length === 0) {
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes)
        console.log(chalk.green.inverse('New note added!'));
    } else {
        console.log(chalk.red.inverse('Note title taken!'));
    }
}
const removeNote = function(title) {
    const notes = loadNotes()
    const notesToKeep = notes.filter((note) => note.title !== title)

    if (notes.length > notesToKeep.length) {
        console.log(chalk.green.inverse('Note removed'));
        saveNotes(notesToKeep)
    } else {
        console.log(chalk.red.inverse('No note found'));
    }

}

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

const listNotes = () => {
    const notes = loadNotes()
    console.log(chalk.blue.inverse("Lista"));
    notes.forEach((note) => {
        console.log(note.title);
    });
}
const readNotes = (title) => {
    const notes = loadNotes();
    const olvas = notes.find(note => note.title === title)
    if(!olvas){
        console.log(chalk.inverse.red('Title not found'));
    }
    else{
        console.log(chalk.inverse.greenBright(olvas.title)+" "+olvas.body);
    }
    
}

const saveNotes = function(notes) {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNotes: readNotes
}