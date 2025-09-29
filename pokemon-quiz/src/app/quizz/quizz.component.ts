import {Component, OnInit} from '@angular/core';
import {PokemonService} from '../services/pokemon.service';
import {Question} from '../models/pokemon.model';
import {FormsModule} from '@angular/forms';
import {NgIf, NgStyle} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quizz',
  imports: [
    FormsModule,
    NgIf,
    NgStyle
  ],
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.scss'
})
export class QuizzComponent implements OnInit{

  question!: Question;
  index = 1;
  score = 0;

  nbQuestions = 10;

  silhouetteUrl?: string;
  answr = '';

  feedback: { ok: boolean, correctName: string } | null = null;

  constructor(private pokemonService: PokemonService, private router: Router) {
  }

  async ngOnInit() {
    await this.loadCurrent();
  }

  async loadCurrent() {
    let id: number = this.pokemonService.getRandomId();
    console.log("Index: " + this.index);
    this.pokemonService.getPokemon(id).subscribe({
      next: async (p) => {
        this.silhouetteUrl = p.sprites.regular;
        this.question = {
          id,
          name: p.name.fr.toLowerCase(),
          imageUrl: p.sprites?.regular || '',
        };
      },
      error: (err) => console.error('Erreur chargement pokémon', err)
    });
  }

  answer(input: string) {
    const q = this.question;
    const ok = input.trim().toLowerCase() === q.name;
    if (ok) this.score++;
    this.index++;
    return { ok, correctName: q.name };
  }

  isFinished() { return this.index > this.nbQuestions; }

  goToResultPage() {
    localStorage.setItem('quizScore', this.score.toString());
    this.router.navigate(['/quizz-result']);
  }

  onSubmit() {
    this.feedback = this.answer(this.answr);
    this.answr = '';
    if (!this.isFinished()) {
      setTimeout(async ()=> {
        this.feedback = null;
        await this.loadCurrent();
        }, 950);
    } else {
      this.goToResultPage();
    }
  }
}
