import { Injectable } from '@angular/core';

declare const window: any;

@Injectable({ providedIn: 'root' })
export class StorageService {
  fileName = 'scores.json';
  folder = ''; // root or cordova.file.dataDirectory when sur device

  constructor() {}

  private async readFromLocalStorage(): Promise<any[]> {
    const raw = localStorage.getItem('scores');
    return raw ? JSON.parse(raw) : [];
  }
  private async writeToLocalStorage(data: any[]) {
    localStorage.setItem('scores', JSON.stringify(data));
  }

  async getScores(): Promise<any[]> {
    // si cordova disponible et plugin file installé -> utiliser FS
    if (window && window.resolveLocalFileSystemURL) {
      try {
        const dir = window.cordova.file.dataDirectory || window.cordova.file.externalDataDirectory || window.cordova.file.documentsDirectory;
        const path = dir + this.fileName;
        return await this.readFile(dir, this.fileName);
      } catch (e) {
        return this.readFromLocalStorage();
      }
    } else {
      return this.readFromLocalStorage();
    }
  }

  async saveScore(entry: any): Promise<void> {
    const scores = await this.getScores();
    scores.push(entry);
    // trier desc par score, puis top 5 ailleurs
    if (window && window.resolveLocalFileSystemURL) {
      try {
        const dir = window.cordova.file.dataDirectory || window.cordova.file.externalDataDirectory || window.cordova.file.documentsDirectory;
        await this.writeFile(dir, this.fileName, JSON.stringify(scores));
        return;
      } catch(e) {
        await this.writeToLocalStorage(scores);
      }
    } else {
      await this.writeToLocalStorage(scores);
    }
  }

  // helpers pour plugin file
  private readFile(dir: string, filename: string): Promise<any[]> {
    return new Promise((res, rej) => {
      window.resolveLocalFileSystemURL(dir, (directoryEntry: any) => {
        directoryEntry.getFile(filename, { create: true }, (fileEntry: any) => {
          fileEntry.file((file: any) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              try {
                const text = reader.result as string;
                res(text ? JSON.parse(text) : []);
              } catch (err) { res([]); }
            };
            reader.readAsText(file);
          }, rej);
        }, rej);
      }, rej);
    });
  }
  private writeFile(dir: string, filename: string, data: string): Promise<void> {
    return new Promise((res, rej) => {
      window.resolveLocalFileSystemURL(dir, (directoryEntry: any) => {
        directoryEntry.getFile(filename, { create: true }, (fileEntry: any) => {
          fileEntry.createWriter((fileWriter: any) => {
            fileWriter.onwriteend = () => res();
            fileWriter.onerror = (e: any) => rej(e);
            const blob = new Blob([data], { type: 'application/json' });
            fileWriter.truncate(0);
            // nécessaire d'attendre le truncate dans certains devices, simplification:
            setTimeout(() => fileWriter.write(blob), 50);
          }, rej);
        }, rej);
      }, rej);
    });
  }
}
