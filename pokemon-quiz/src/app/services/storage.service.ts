import { Injectable } from '@angular/core';

declare const window: any;

@Injectable({ providedIn: 'root' })

export class StorageService {
  private fileName = 'scores.json';

  constructor() {}

  // Sauvegarder un score
  saveScore(score: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(score);

      // Accès au dossier "dataDirectory" (stockage persistant app)
      window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory, (dirEntry: any) => {
        dirEntry.getFile(this.fileName, { create: true }, (fileEntry: any) => {
          fileEntry.createWriter((fileWriter: any) => {
            fileWriter.onwriteend = () => resolve();
            fileWriter.onerror = (e: any) => reject(e);

            const blob = new Blob([data], { type: 'application/json' });
            fileWriter.write(blob);
          });
        });
      });
    });
  }

  // Lire les scores
  readScores(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory + this.fileName, (fileEntry: any) => {
        fileEntry.file((file: any) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              const content = reader.result as string;
              resolve(content ? JSON.parse(content) : []);
            } catch (e) {
              reject(e);
            }
          };
          reader.readAsText(file);
        });
      }, () => {
        // Si le fichier n’existe pas encore → on renvoie []
        resolve([]);
      });
    });
  }
}
