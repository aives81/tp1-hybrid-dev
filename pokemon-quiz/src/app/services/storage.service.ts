import { Injectable } from '@angular/core';
import {Gamer} from '../models/pokemon.model';

declare const window: any;

@Injectable({ providedIn: 'root' })

export class StorageService {
  private fileName = 'scores.json';

  constructor() {}

  private getDataDir(): string {
    if (window.cordova && window.cordova.file) {
      return window.cordova.file.dataDirectory;
    }
    throw new Error('Cordova File plugin not available yet.');
  }

  // Sauvegarder un score
  saveScore(score: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(score);

      // Accès au dossier "dataDirectory" (stockage persistant app)
      window.resolveLocalFileSystemURL(this.getDataDir(), (dirEntry: any) => {
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
      const path = this.getDataDir() + this.fileName;
      window.resolveLocalFileSystemURL(path, (fileEntry: any) => {
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

  saveDataInLocalStorage(data: Gamer): void {
    const localData = this.getDataFromLocalStorage() || [];
    localData.push(data);
    localStorage.setItem('gameHistory', JSON.stringify(localData));
  }

  getDataFromLocalStorage(): Gamer[] {
    const data = localStorage.getItem('gameHistory') || '[]';
    return data ? JSON.parse(data) : [];
  }
}
