import AdmZip from "adm-zip";
import path from 'path'

function readZipArchive(filepath) {
    const entries = [];
    try {
        const zip = new AdmZip(path.resolve(filepath));

        for (const zipEntry of zip.getEntries()) {
            entries.push(zipEntry);
        }
    } catch (e) {
        console.log(`Something went wrong. ${e}`);
    }
    return entries;
}

function extractFile(zippath, filepath){
    //console.log(zippath, filepath)
    const zip = new AdmZip(path.resolve(zippath));
    return zip.readFile(`${filepath}`);
}

export {
    readZipArchive,
    extractFile
}
